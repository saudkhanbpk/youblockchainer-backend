const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');

// load env vars
dotenv.config({ path: '../.env' });

let openai;
const initializeOpenAI = async () => {
  try {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    openai = new OpenAIApi(configuration);
  } catch (err) {
    console.log(err);
  }
};

const model_engine = 'text-davinci-003';

const get_response = async (user_input) => {
  try {
    //  Get the response from GPT-3
    let response = await openai.createCompletion({
      model: model_engine,
      prompt: user_input,
      max_tokens: 1024,
      n: 1,
    });

    // Extract the response from the response object
    let response_text = response.data.choices[0].text;

    let chatbot_response = response_text.trim();
    
    return chatbot_response;
  } catch (err) {
    throw err;
  }
};

module.exports = { get_response, initializeOpenAI };
