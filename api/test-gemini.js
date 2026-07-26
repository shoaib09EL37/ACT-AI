const handler = require('./ask-ai');
const req = {
  method: 'POST',
  body: {
    question: 'Why does current decrease when resistance increases?',
    currentTopic: "Ohm's Law",
    simulationContext: { voltage: 12, resistance: 6, current: 2 }
  }
};
let statusCode = 200;
let data = null;
const res = {
  status(code) { statusCode = code; return this; },
  json(payload) { data = payload; },
  setHeader() {}
};
handler(req, res).then(() => {
  console.log(JSON.stringify({ statusCode, data }, null, 2));
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
