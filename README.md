# ACT-AI — MUET Resistance Tutor

An interactive, static HTML simulator and learning aid for resistance, Ohm's law, resistor color codes, and series/parallel networks. The app now also includes a secure ACT AI tutor that uses Google Gemini from a serverless Vercel function.

## Features

- Atomic resistance simulator with microscopic electron drift visualization
- Ohm's Law playground and series/parallel solver
- Resistor color decoder and exam-prep quiz
- Temperature chamber with Chart.js visualizations
- Secure ACT AI tutor powered by Gemini through a server-side API route
- Clean, responsive UI built with Tailwind CSS

## Files of interest

- `index.html` — main static page for the simulator and AI tutor UI
- `api/ask-ai.js` — Vercel serverless function that calls Gemini securely

## AI feature overview

The ACT AI tutor sends the student's question, current topic, and the current simulation values to a server-side endpoint at `/api/ask-ai`. The browser never receives or exposes the Gemini API key. The only server-side environment variable used is `GEMINI_API_KEY`.

## AI system prompt

The server uses the following teaching instruction for Gemini:

```text
You are ACT AI, an adaptive Applied Physics and Electrical Engineering tutor for first-year engineering students.

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
```

## Gemini integration and security

- The Gemini API key is stored only in the environment variable `GEMINI_API_KEY`.
- The key is read inside the serverless function at `api/ask-ai.js`.
- The frontend contains no Gemini API key, secret token, or browser-side key exposure.

## Run locally

1. Install dependencies if needed:

```powershell
npm install
```

2. Start a local static server and the Vercel-compatible API route. A simple option is to use Vercel CLI if available:

```powershell
npx vercel dev
```

3. Open the local URL shown by Vercel CLI to use the simulator and AI tutor.

## Secure environment variable setup

Before deploying, create a Vercel environment variable named `GEMINI_API_KEY` and set it to your Gemini API key.

For local development, set the same variable in your shell before running the app:

```powershell
$env:GEMINI_API_KEY="your_gemini_api_key_here"
```

## Deploy with Vercel

1. Sign in to Vercel and import the GitHub repository.
2. Add the `GEMINI_API_KEY` environment variable in the Vercel project settings.
3. Deploy the project. The `/api/ask-ai` route will be served automatically.

## Notes & Best Practices

- Keep external assets on CDNs as-is for simplicity; for offline builds consider vendoring them.
- Ensure any large assets (images) are optimized for web performance.
- If you want a custom domain, Vercel supports DNS setup for the deployed app.

## Contributing

Contributions are welcome — open an issue or submit a pull request.

## License

This repository has no license specified. Add a license file (for example, `LICENSE`) if you want to allow reuse. A permissive option is the MIT License.

