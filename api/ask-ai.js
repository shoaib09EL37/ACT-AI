module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      reply: 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      reply: 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.'
    });
  }

  let body = {};
  try {
    body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
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

  const systemInstruction = `You are ACT AI, an adaptive Applied Physics and Electrical Engineering tutor for first-year engineering students.

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

Teaching rules:
1. Explain concepts clearly using appropriate first-year engineering terminology.
2. Connect explanations to the student's current simulation values when provided.
3. Show the relevant equation before performing calculations.
4. Explain the physical meaning of the result, not only the numerical answer.
5. Use SI units and clearly identify variables.
6. When a student makes a mistake, identify the likely conceptual or mathematical error and guide the student toward correction.
7. Prefer hints and step-by-step reasoning before immediately revealing the final answer.
8. Never invent experimental results or values that were not provided.
9. Adapt the explanation to the student's apparent level of understanding.
10. For practice questions, do not reveal the answer immediately.
11. When evaluating a student's answer, explain what was correct, identify errors, and provide a short improvement suggestion.
12. If a question is outside the supported topics, politely state that it is outside the current learning module.

The current simulation context is:
${JSON.stringify(simulationContext, null, 2)}

The current topic is:
${currentTopic}

The student's question is:
${question}`;

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nPlease answer the student's question clearly and helpfully.` }]
          }
        ]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error('Gemini request failed');
    }

    const geminiData = await geminiResponse.json();
    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Gemini AI request failed');
    return res.status(502).json({
      reply: 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.'
    });
  }
}
