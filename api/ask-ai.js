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

  const prompt = `${systemInstruction}\n\nPlease answer the student's question clearly and helpfully.`;
  const geminiBaseEndpoint = 'https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.0-flash:generateMessage';
  const isOAuthToken = apiKey.startsWith('ya29.') || apiKey.startsWith('Bearer ');
  const requestUrl = isOAuthToken ? geminiBaseEndpoint : `${geminiBaseEndpoint}?key=${encodeURIComponent(apiKey)}`;
  const requestHeaders = {
    'Content-Type': 'application/json'
  };
  if (isOAuthToken) {
    requestHeaders.Authorization = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
  }

  console.log('Gemini request endpoint:', requestUrl);
  console.log('Gemini request model: gemini-2.0-flash');
  console.log('Gemini auth method:', isOAuthToken ? 'Bearer token' : 'API key query parameter');

  try {
    const requestPayload = {
      prompt: {
        messages: [
          {
            author: 'system',
            content: [{ type: 'text', text: systemInstruction }]
          },
          {
            author: 'user',
            content: [{ type: 'text', text: prompt }]
          }
        ]
      },
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 400
    };

    console.log('Gemini request payload keys:', Object.keys(requestPayload));
    const geminiResponse = await fetch(requestUrl, {
      method: 'POST',
      headers: requestHeaders,
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

    const reply = geminiData?.candidates?.[0]?.content?.[0]?.text
      || geminiData?.message?.content?.[0]?.text
      || geminiData?.response?.output?.[0]?.content?.[0]?.text
      || geminiData?.output?.[0]?.content?.[0]?.text
      || 'AI Tutor is temporarily unavailable. You can continue using the interactive simulations.';

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
