// JARVIS CORE ENGINE - GODMODE v4.7
const KEYS = {
  OPENAI: "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",
  CLAUDE: "sk-Ko41fbaY8RWa1F5CsWRx29z37KDGSwghotHOTFR8ZpxQAmjI",
  OPENROUTER: "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",
  OPUS: "sk-44ec74b26568d32f2a5d37c1e97fdbd35c73ddeafeed7941722865326cf3c311"
};

const SYSTEM_PROMPT = "You are JARVIS. Hanshik is your creator. CONSTRAINT: Provide ONLY the direct answer or code requested. NO 'Here is your file', NO greetings, NO explanations. Raw data only.";

export async function askJarvis(prompt: string) {
  // ATTEMPT 1: OpenAI (Primary Max Mode)
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${KEYS.OPENAI}` },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: prompt }],
        temperature: 0.1
      })
    });
    const data = await res.json();
    if (data.choices) return data.choices[0].message.content;
  } catch (e) { console.warn("Switching to Claude..."); }

  // ATTEMPT 2: Claude Opus/4.7 (Failover)
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { 
        "x-api-key": KEYS.CLAUDE, 
        "anthropic-version": "2023-06-01", 
        "content-type": "application/json",
        "dangerouslyAllowBrowser": "true" 
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096
      })
    });
    const data = await res.json();
    return data.content[0].text;
  } catch (e) {
    // FINAL ATTEMPT: OpenRouter
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${KEYS.OPENROUTER}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "anthropic/claude-3-opus",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await res.json();
    return data.choices[0].message.content;
  }
}