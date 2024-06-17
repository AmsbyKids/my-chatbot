const fs = require("fs");
const https = require('https');

const createAssistant = async (openai) => {
  const assistantFilePath = "assistant.json";
  if (!fs.existsSync(assistantFilePath)) {
    const file = await openai.files.create({
      file: fs.createReadStream("kunskapgbt.docx"),
      purpose: "assistants",
    });
    let vectorStore = await openai.beta.vectorStores.create({
      name: "Chat Demo",
      file_ids: [file.id],
    });
    const assistant = await openai.beta.assistants.create({
      name: "BabyK",
      instructions: `BabyKassans AI kombinerar djup kunskap inom kodning och föräldrapenning...`,
      tools: [{ type: "file_search" }],
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
      model: "gpt-4",
    });
    fs.writeFileSync(assistantFilePath, JSON.stringify(assistant));
    return assistant;
  } else {
    const assistant = JSON.parse(fs.readFileSync(assistantFilePath));
    return assistant;
  }
};

function keepAlive() {
  https.get('https://wwwbykassanse-info1478.replit.app/start', (res) => {
    res.on('data', (chunk) => {
      console.log(`KEEP ALIVE: ${chunk}`);
    });
  }).on('error', (err) => {
    console.error('Error: ', err);
  });
}

// Kör keepAlive varje 5 minuter
setInterval(keepAlive, 300000); // 300000 ms = 5 minuter

module.exports = { createAssistant };
