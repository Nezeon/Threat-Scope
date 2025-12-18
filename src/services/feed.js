const RSS_URL = "https://api.rss2json.com/v1/api.json?rss_url=https://thehackernews.com/feeds/posts/default";

const MOCK_FEED = [
    {
        title: "Active Exploitation of CVE-2024-21345 in Government Sector",
        summary: "Advanced Persistent Threat actors are actively exploiting a critical vulnerability in Windows Server.",
        time: "10:30:00",
        link: "#",
        categories: ["APT", "Critical", "Windows"],
        source: "CISA_ALERT"
    },
    {
        title: "New 'BlackBastion' Ransomware Variant Analyzed",
        summary: "A new variant of BlackCat ransomware has been identified targeting healthcare institutions.",
        time: "09:15:00",
        link: "#",
        categories: ["Ransomware", "Malware"],
        source: "UNIT_42"
    },
    {
        title: "Zero-Day Suspected in Popular VPN Appliance",
        summary: "Unexplained traffic patterns suggest a pre-auth RCE zero-day in standard enterprise VPN gateways.",
        time: "08:45:00",
        link: "#",
        categories: ["ZeroDay", "RCE"],
        source: "VULN_WATCH"
    }
];

export const fetchThreatIntelFeed = async () => {
    try {
        const res = await fetch(RSS_URL);
        const data = await res.json();

        if (data && data.items && data.items.length > 0) {
            return data.items.map(item => ({
                source: "THN_WIRE",
                title: item.title,
                summary: item.description || "No summary available.",
                time: item.pubDate ? item.pubDate.split(' ')[1] : new Date().toLocaleTimeString(),
                link: item.link,
                categories: item.categories || []
            }));
        }
        throw new Error("No items found");
    } catch (error) {
        console.warn("Feed fetch failed, using fallback data", error);
        return MOCK_FEED;
    }
};
