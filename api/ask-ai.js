const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      reply: 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Gemini API key configured:', Boolean(apiKey));
  if (!apiKey) {
    return res.status(503).json({
      error: 'Missing Gemini API key',
      reply: 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.'
    });
  }

  let body = {};
  try {
    if (req.body && typeof req.body === 'object') {
      body = req.body;
    } else if (typeof req.body === 'string' && req.body) {
      body = JSON.parse(req.body);
    } else {
      body = {};
    }
  } catch (error) {
    return res.status(400).json({
      reply: 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.'
    });
  }

  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const currentTopic = typeof body.currentTopic === 'string' ? body.currentTopic : 'Applied Physics';
  const simulationContext = body.simulationContext && typeof body.simulationContext === 'object'
    ? body.simulationContext
    : {};

  if (!question) {
    return res.status(400).json({
      reply: 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.'
    });
  }

  const systemInstruction = `You are an adaptive Applied Physics and Electrical Engineering tutor for first-year engineering students.

Your purpose is to help students understand concepts through reasoning, simulation, and guided practice.

Supported topics include:
- Electrical resistance
- Resistivity
- Ohm's Law
- Voltage, current, and resistance
- Temperature dependence of resistance
- PTC and NTC behavior
- Resistor color codes
- Series and parallel resistor networks
- Basic electrical and magnetic concepts

Response rules:
1. Keep answers concise and student-facing.
2. Start directly with the answer; do not use long introductions.
3. Use plain text only; never use LaTeX syntax or commands.
4. Do not use any of these LaTeX tokens: \\frac, \\times, \\rho, \\Omega, \\Delta, \\cdot, ^{}, _{}, \\[, \\], $...$.
5. Write equations in plain text with Unicode symbols when helpful.
6. Use simple browser-friendly formatting only.
7. For simple questions, answer in 2–4 sentences.
8. For calculations, use no more than 5–7 short lines.
9. For "Explain My Result", use no more than 6–8 short bullet points.
10. Only provide detailed explanations when the student explicitly asks for detail.
11. Do not repeat information already visible in the user interface.
12. Do not invent values or experimental details that were not provided.
13. Use current simulation values only when directly relevant.

Preferred response structure:
- For a normal question:
  Answer:\n  [direct answer in 1–3 sentences]\n\n  Equation:\n  [only if necessary, in plain text]\n\n  Meaning:\n  [one short sentence connecting it to the simulation]

- For a calculation:
  Result:\n  [final answer first]\n\n  Calculation:\n  [short plain-text calculation]\n\n  Meaning:\n  [one sentence explaining the physical meaning]

- For simulation analysis:
  Result:\n  [state the main result directly]\n\n  Why:\n  [explain the most important physical reason]\n\n  Key equation:\n  [use plain text, not LaTeX]

Example equations:
R = ρ × L / A
V = I × R
P = I² × R

The current simulation context is:
${JSON.stringify(simulationContext, null, 2)}

The current topic is:
${currentTopic}

The student's question is:
${question}`;

  const prompt = `${systemInstruction}\n\nPlease answer the student's question clearly and helpfully.`;
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`;
  const requestPayload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt
          }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7
    }
  };

  console.log('Gemini request endpoint:', geminiEndpoint);
  console.log('Gemini request model: gemini-3.5-flash-lite');

  try {
    const geminiResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });

    console.log('Gemini response status:', geminiResponse.status);
    const responseText = await geminiResponse.text();
    console.log('Gemini response body:', responseText);

    let geminiData = null;
    try {
      geminiData = responseText ? JSON.parse(responseText) : null;
    } catch (parseError) {
      console.error('Failed to parse Gemini response JSON:', parseError.message);
    }

    if (!geminiResponse.ok) {
      const errorMessage = geminiData?.error?.message || geminiData?.message || responseText || `HTTP ${geminiResponse.status}`;
      console.error('Gemini request failed', geminiResponse.status, errorMessage);
      return res.status(502).json({
        error: 'Gemini API request failed',
        details: errorMessage,
        reply: 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.'
      });
    }

    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.';

    return res.status(200).json({ reply });
  } catch (error) {
    const errorMessage = error?.message || 'Unknown Gemini error';
    console.error('Gemini AI request failed', errorMessage);
    return res.status(502).json({
      error: 'Gemini API request failed',
      details: errorMessage,
      reply: 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.'
    });
  }
};
