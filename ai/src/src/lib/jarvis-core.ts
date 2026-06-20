const API_CONFIG = {
  OPENAI: "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",
  CLAUDE: "sk-Ko41fbaY8RWa1F5CsWRx29z37KDGSwghotHOTFR8ZpxQAmjI",
  OPENROUTER: "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",
  DIRECTIVE: "You are JARVIS. User is Hanshik. Output the absolute necessary text only. No conversational filler. If asked for a file, output only the file content. No intro/outro."
};

export async function askJarvis(prompt: string): Promise<string> {
  // ATTEMPT 1: OpenAI (GPT-4o)
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_CONFIG.OPENAI}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: API_CONFIG.DIRECTIVE }, { role: "user", content: prompt }],
        temperature: 0.2
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI core offline, switching to Claude...");
    
    // ATTEMPT 2: OpenRouter Failover
    try {
      const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_CONFIG.OPENROUTER}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "anthropic/claude-3.5-sonnet",
          messages: [{ role: "user", content: API_CONFIG.DIRECTIVE + " Prompt: " + prompt }]
        })
      });
      const orData = await orResponse.json();
      return orData.choices[0].message.content;
    } catch (finalErr) {
      return "ERROR: Jarvis Core Integrity Failure. Check API keys and credits.";
    }
  }
}