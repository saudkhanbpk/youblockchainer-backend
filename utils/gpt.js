const OpenAI = require('openai');
const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: '../.env' });

let openai;
const initializeOpenAI = async () => {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, 
    });
  } catch (err) {
    console.log(err);
  }
};

const model_engine = 'gpt-3.5-turbo';

const get_response = async (user_input) => {
  try {
    //  Get the response from GPT-3
    let response = await openai.chat.completions.create({
      model: model_engine,
      messages: [{ role: 'user', content: user_input }],
      max_tokens: 2000,
      n: 1,
    });

    // Extract the response from the response object
    let response_text = response.choices[0].message.content;

    let chatbot_response = response_text.trim();
    
    return chatbot_response;
  } catch (err) {
    throw err;
  }
};

module.exports = { get_response, initializeOpenAI };
