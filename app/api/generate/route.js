export async function POST(request) {
  try {
    const requestData = await request.json();
    const { prompt, max_tokens, temperature, top_k, top_p, repetition_penalty } = requestData;

    const response = await fetch(
      "https://db259cfcd72e845a3bc5a510077dd53a9.clg07azjl.paperspacegradient.com/generate/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          max_tokens,
          temperature,
          top_k,
          top_p,
          repetition_penalty,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error proxying request:", error);
    return Response.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
} 