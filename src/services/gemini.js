import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateActorProfile = async (actorName) => {
  if (!API_KEY) throw new Error("VITE_GEMINI_API_KEY is not set in environment");

  // Prioritizing Gemma 3 (High quota availability)
  const modelsToTry = [
    "models/gemma-3-27b-it",
    "models/gemma-3-27b",
    "models/gemini-2.0-flash-exp",
    "models/gemini-1.5-flash-8b",
    "models/gemini-robotics-er-1.5-preview",
    "gemini-1.5-pro"
  ];

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Gemini Service] Attempting to generate profile for '${actorName}' with model: ${modelName}`);
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
      Generate a threat actor profile for "${actorName}".
      
      Provide the output in the following JSON format ONLY:
      {
        "actor_name": "${actorName}",
        "origin": "Country or Region",
        "targets": "Industry or Sector",
        "malware": "Key malware families used",
        "last_active": "Recent timeframe (e.g. 'Late 2024')",
        "threat_level": "CRITICAL, HIGH, MEDIUM, or LOW",
        "threat_scores": {
          "technical": 85,
          "sophistication": 90,
          "infrastructure": 75,
          "evasion": 80,
          "impact": 95
        },
        "description_p1": "First paragraph highlighting origin, capability, first activity, motive/objective, type and targeting pattern.",
        "description_p2": "Second paragraph covering campaigns, tool sets, TTPs, malwares and collaboration with other TAs.",
        "description_p3": "Third paragraph covering latest campaign, recent change in their operational or behavioural tactics.",
        "cves": [
          {"id": "CVE-YYYY-XXXX", "description": "Brief description"}
        ]
      }
      
      IMPORTANT:
      1. THIS IS CRITICAL: If you do not have specific, verifiable intelligence on exactly "${actorName}", return ONLY: { "error": "Unknown Data" }
      2. INTERNAL ALIAS RESOLUTION: If the name is a vendor-specific alias (e.g., "Storm-0940", "Mint Sandstorm", etc.), INTERNALLY resolve it to its primary industry name (e.g., APT number, Chemical element) to fetch accurate data, BUT return the "actor_name" as "${actorName}".
      3. VERACITY CHECK: Double-check the Origin. For example, Storm-0940 is associated with China. Do not hallucinate origins.
      4. Fetch ALL known CVEs strictly associated with "${actorName}" (or its resolved alias). 
      5. The "actor_name" field in the JSON MUST be exactly "${actorName}".
      6. Ensure the response is valid JSON. Do not include markdown code blocks.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log(`[Gemini Service] Success with ${modelName}`);

      // robust cleanup to extract JSON
      let cleanText = text.trim();
      // Remove markdown blocks if present
      cleanText = cleanText.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '');

      // Find the first '{' and last '}' to ensure valid JSON boundaries
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }

      const parsedData = JSON.parse(cleanText);

      // STRICT VALIDATION
      if (parsedData.error) {
        throw new Error(`AI reported unknown actor: ${actorName}`);
      }

      const returnedName = parsedData.actor_name?.trim().toLowerCase();
      const requestedName = actorName.trim().toLowerCase();

      // Check if the returned name contains the requested name or vice versa, 
      // but strict enough to avoid "Storm-0940" matching "APT 28" (no overlap).
      // We'll use a strict check:
      if (returnedName !== requestedName) {
        console.warn(`[Gemini Service] Hallucination detected! Requested "${requestedName}" but got "${returnedName}". Discarding.`);
        // If we have models left, this will behave as an error and try the next model. 
        // If no models left, it will throw.
        throw new Error(`Data mismatch: Requested ${actorName}, got ${parsedData.actor_name}`);
      }

      return parsedData;

    } catch (error) {
      console.warn(`[Gemini Service] Failed with model ${modelName}:`, error.message);
      if (error.message.includes('429') || error.message.includes('Quota')) {
        lastError = new Error("API Quota Exceeded. Please wait a moment and try again.");
      } else {
        lastError = error;
      }
      // Continue to next model
    }
  }

  throw new Error(lastError?.message || `Unable to find verifiable intelligence for "${actorName}".`);
};

export const generateChatResponse = async (userMessage, contextActor) => {
  if (!API_KEY) throw new Error("API Key missing");

  const modelsToTry = [
    "models/gemma-3-27b-it",
    "models/gemini-2.0-flash-exp",
    "models/gemini-1.5-flash-8b",
    "models/gemini-1.5-flash"
  ];

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      // 1. Fetch the official profile first to establish ground truth
      // This ensures Chat Data == Dashboard Data
      let profileData = null;
      try {
        // parallelize if needed, but sequential safeguards consistency
        profileData = await generateActorProfile(contextActor);
      } catch (err) {
        console.warn("[Chat] Could not fetch verified profile:", err);
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
      System: You are UNI5X, an elite cyber threat intelligence AI.
      
      VERIFIED INTELLIGENCE PROFILE (GROUND TRUTH):
      ${profileData ? JSON.stringify(profileData, null, 2) : "Profile data currently unavailable. Rely on internal knowledge with caution."}

      CRITICAL INSTRUCTIONS:
      1. **Consistency**: You MUST align your answers with the "VERIFIED INTELLIGENCE PROFILE" above. 
         - If the verification profile is available, use it as the absolute source of truth.
      2. **Origin & Attribution Checks**: 
         - **SPECIFIC OVERRIDE**: "Storm-0940" is definitively associated with **CHINA** (BlueCharlie/Mustang Panda). It is NOT associated with Belarus or TA503. If the user asks about Storm-0940, state it is a Chinese threat actor.
         - Do not hallucinate attribution if unsure.
      3. **Internal Alias Resolution**: If the actor name is an alias (e.g. Storm-0940), treat it as the resolved identity (e.g. BlueCharlie).
      
      User Query: "${userMessage}"
      Context Actor: "${contextActor}"
      
      Response Guidelines:
      - Answer cleanly and professionally.
      - Focus on technical TTPs, IoCs, and defensive strategies.
      - If the model is Gemma, be concise.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e) {
      console.warn(`Chat failed with ${modelName}:`, e.message);
      lastError = e;
    }
  }
  throw new Error("Chat unavailable: " + (lastError?.message || "All models failed"));
};
