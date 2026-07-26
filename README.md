# ACT AI — Adaptive Circuit & Theory Tutor

ACT AI is an AI-powered interactive learning environment for first-year Electrical Engineering and Applied Physics students. It combines interactive physics simulations with a context-aware AI tutor so students can explore electrical concepts, test ideas, and receive guided explanations based on their current experiment values.

## 1. What the App Does

ACT AI helps students understand electrical engineering concepts through interactive simulations and an AI tutor. Instead of only memorizing equations, learners can adjust voltage, resistance, temperature, and circuit parameters to see what changes and ask ACT AI for help with their current experiment.

## 2. The Real Problem

First-year engineering students often memorize formulas but struggle to connect equations to physical meaning. Traditional calculators and lecture notes rarely explain why a result changes when a parameter is adjusted. ACT AI solves this by linking each simulation to an AI tutor that explains the result in context.

## 3. Target Users

- First-year Electrical Engineering students
- Applied Physics students
- Engineering students learning basic electrical concepts

## 4. Live Application

The live deployment is available at:

(https://act-ai-3yqr.vercel.app/)

## 5. GitHub Repository

Public repository:

[https://github.com/shoaib09EL37/ACT-AI](https://github.com/shoaib09EL37/ACT-AI)

## 6. Complete Features

The application currently includes:

- Interactive resistance simulation
- Resistivity calculations
- Ohm's Law playground
- Voltage/current/resistance relationships
- Temperature effects on resistance
- PTC and NTC behavior examples
- Resistor color code decoder
- Series and parallel resistor calculators
- Equivalent resistance calculations
- Exam practice quiz
- ACT AI Tutor
- Explain My Result

## 7. AI Feature

ACT AI uses the current simulation values to provide contextual explanations. When a student asks a question or clicks Explain My Result, the app sends the current topic and live simulation context to a secure server-side API route. The AI tutor then explains the concept, the equation, and the physical meaning of the result.

## 8. AI System Prompt

The application uses the following system prompt with Gemini:

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
2. Always connect explanations to the student's current simulation values when those values are provided.
3. Show the relevant equation before performing calculations.
4. Explain the physical meaning of the result, not only the numerical answer.
5. Use SI units and clearly identify all variables.
6. When a student makes a mistake, identify the likely conceptual or mathematical error and guide the student toward correction.
7. Prefer hints and step-by-step reasoning before immediately revealing the final answer.
8. Never invent experimental results or values that were not provided.
9. Adapt the explanation to the student's apparent level of understanding.
10. For practice questions, do not reveal the answer immediately.
11. When evaluating a student's answer, explain what was correct, identify errors, and provide a short improvement suggestion.
12. If a question is outside the supported topics, politely state that it is outside the current learning module.

Current topic:
{currentTopic}

Current simulation context:
{simulationContext}

Student question:
{question}
```

## 9. Tools, Services, and Models

The project uses:

- HTML
- CSS
- JavaScript
- Tailwind CSS
- Chart.js
- Font Awesome
- VS Code
- GitHub
- Vercel
- Google Gemini API
- Gemini model: `gemini-2.0-flash`

## 10. Security

The Gemini API key is stored as a server-side environment variable named `GEMINI_API_KEY`. It is never committed to the public repository or embedded in the frontend source.

## 11. How to Run Locally

```bash
git clone https://github.com/shoaib09EL37/ACT-AI.git
cd ACT-AI
npm install
```

Create a local environment file named `.env.local` and add:

```text
GEMINI_API_KEY=your_api_key_here
```

Then run:

```bash
npx vercel dev
```

Do not commit `.env.local`.

## 12. Deployment

The project is deployed on Vercel. To enable the live AI tutor, add the `GEMINI_API_KEY` environment variable in the Vercel dashboard and redeploy the project. The `.env.local` file should contain only local development variables and must not be used to store secrets for the public deployment.

## 13. Screenshots

The screenshots folder contains example assets:

- [screenshots/home.png](screenshots/Working 1.png)
- [screenshots/simulation.png](screenshots/Working 2.png)
- [screenshots/ai-tutor.png](screenshots/Working 3.png)

## 14. Application Architecture

```text
Student
↓
ACT AI Frontend
↓
Interactive Simulation
↓
Current Simulation Context
↓
Secure API Route
↓
Gemini AI
↓
Personalized Explanation
```

## 15. Future Improvements

- Student accounts
- Learning progress tracking
- AI-generated quizzes
- AI answer evaluation
- Instructor dashboard
- More physics simulations
- Personalized learning paths

## 16. Author

Dr. Shoaib Ahmed Khatri

Assistant Professor

Department of Electrical Engineering

Mehran University of Engineering and Technology, Jamshoro, Pakistan

