import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, userContext } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply:
          "🔑 AI Coach Notice: GEMINI_API_KEY is not set in your .env.local file. Please add your Gemini API key to enable live AI responses!",
      });
    }

    const systemPrompt = `You are JDAS AI Coach, an expert bodybuilding, biomechanics, movement mechanics, and nutrition specialist.
User Context:
- Goal: ${userContext?.goal || "recomp"}
- Weight: ${userContext?.weightKg || 70} kg
- Active Medical Limitations/Pain: ${userContext?.medicalNotes || "None"}

Provide clear, direct, encouraging, and scientifically sound fitness or nutrition coaching. If the user mentions pain (e.g., sciatica, lower back, shoulder), suggest alternative safe exercises and biomechanical cues. Keep your answers concise, structured, and easy to read on mobile.`;

    const formattedContents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood. I am JDAS AI Coach, ready to assist with customized workout form, nutrition, and safety advice.",
          },
        ],
      },
      ...messages.map((m: { role: string; text: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: formattedContents }),
      },
    );

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API Error details:", data.error);
      return NextResponse.json({
        reply: `⚠️ API Error: ${data.error.message || "Failed connecting to Gemini."}`,
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm here to help with your workout and nutrition questions! Could you rephrase your question?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Handler Catch Error:", error);
    return NextResponse.json(
      {
        reply:
          "Network issue contacting the AI Coach server. Please check your internet connection.",
      },
      { status: 500 },
    );
  }
}
