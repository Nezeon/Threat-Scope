# THREAT SCOPE // INTEL PLATFORM

**Next-Generation Cyber Threat Intelligence Interface**

![Status](https://img.shields.io/badge/Status-Production%20Ready-cyan?style=for-the-badge)
![Security](https://img.shields.io/badge/Clearance-Level%205-red?style=for-the-badge)

## 🔎 Overview

**THREAT SCOPE** is an advanced AI-powered dashboard designed for analyzing, tracking, and simulating conversations with global threat actors. It integrates real-time intelligence feeds, automated profiling, and neural chat capabilities into a high-fidelity "Cyber-Minimalist" interface.

## 🚀 Key Modules

### 1. **ACTORS (Tracking Database)**
*   **Automated Profiling:** Generates deep technical profiles of threat actors (APTs) using Gemini AI.
*   **CVE Correlation:** Automatically maps known Vulnerabilities (CVEs) to specific actors.
*   **Threat Radar:** Visualizes the capability of an actor across Technical, Sophistication, Infrastructure, and Evasion metrics.
*   **Export:** Generate clean Excel (`.xlsx`) reports for offline analysis.

### 2. **CHAT (Neural Channel)**
*   **Context-Aware AI:** Chat directly with a simulated persona of the threat actor or an analyst assistant.
*   **War-Room Simulation:** Ask questions like "How do I mitigate your malware?" or "What are your recent targets?".

### 3. **LIVE FEED (Global Intercept)**
*   **Real-time Intel:** Aggregates RSS feeds from major cybersecurity sources (The Hacker News, Kremlin, NSA, etc.).
*   **Severity Scoring:** Automatically tags news with `CRITICAL`, `HIGH`, or `MEDIUM` impact levels.

## 🛠️ Technology Stack

*   **Frontend:** React 18, Vite
*   **Styling:** TailwindCSS, Framer Motion (Animations)
*   **AI Engine:** Google Gemini (1.5 Pro / Flash)
*   **Data:** Recharts (Visualization), XLSX (Reporting)

## 🔒 Security Note
This platform handles sensitive threat intelligence data. Ensure API keys are stored securely and never committed to version control.

---
*Created for HivePro Threat Intel Operations.*
