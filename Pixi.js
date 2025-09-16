export async function handler(event) {
  const query = event.queryStringParameters.q || "";
  const mode = event.queryStringParameters.mode || "google";

  try {
    if (mode === "google") {
      const googleRes = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}`
      );
      const data = await googleRes.json();
      return { statusCode: 200, body: JSON.stringify(data) };
    }

    if (mode === "pixi") {
      const body = {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Pixi, a concise friendly AI assistant." },
          { role: "user", content: query }
        ],
        max_tokens: 500,
      };

      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(body),
      });
      const data = await aiRes.json();
      return { statusCode: 200, body: JSON.stringify(data) };
    }

    return { statusCode: 400, body: JSON.stringify({ error: "Invalid mode" }) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
