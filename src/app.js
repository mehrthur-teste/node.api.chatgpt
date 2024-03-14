import express from "express";
import { Configuration, OpenAIApi } from "openai";
const app = express();

const messages = [
  {role: "user", content: "Say this is a test!"},
]

//Health Check[0]
app.get('/', (req, res) => {
  console.log(req)
  res.status(200).send('Live');
}) 

//Train [1]
app.post('/smart/train/me', async (req, res) => {
  var message ="";
  var id = "";

  // config open ai
  const configuration = new Configuration({
    organization: "",
    apiKey: "",
});

  try{
  const openai = new OpenAIApi(configuration);
  //const response = await openai.listEngines();

  const response = await openai.createFile(
    fs.createReadStream('./data_prepared.jsonl'),
    'fine-tune');

    message = "Deu Certo";
    id = response.data.id;

  await openai.createFineTune({
    training_file: id,
    model: 'davinci:ft-personal-2023-03-31-01-09-15'
  });
  
  console.log(id)
  }
  catch (error){
    console.error(error.response.data.error);
  }
  //intent.push(req.body)
  res.status(200).json(message)
})

//Chat Completion [2]
app.post('/smart/go', async (req, res) => {
  var message ="";

  // config open ai
  const configuration = new Configuration({
    organization: "org-df7OMj3TagBeqN9JXhzo5Y6E",
    apiKey: "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",
});

  try{
    const openai = new OpenAIApi(configuration);
    //const response = await openai.listEngines(); Chat gpt-3.5-turbo
   const response = await openai.createCompletion({
      model: "davinci:ft-personal-2023-03-31-01-09-15",
      messages: messages,
      temperature:1,
      max_tokens:10,
    });
    //console.log(response.data.choices.message.content)
    message = JSON.stringify(response.data.choices[0].message.content) 
  }
  catch (error){
    console.error(error);
  }
 

  //intent.push(req.body)
  res.status(200).json(message)
})

//Fine-Tune[3] - optional
app.post('/smart/fine-tune/me', async (req, res) => {
  var message ="";


  // config open ai
  const configuration = new Configuration({
    organization: "org-df7OMj3TagBeqN9JXhzo5Y6E",
    apiKey: "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",
});

  try{
    const openai = new OpenAIApi(configuration);
    //const response = await openai.listEngines();
    const response = await openai.createFineTune({
    training_file: "",
    model: 'davinci:ft-personal-2023-03-31-01-09-15'
  });
  message = "Deu Certo"
  console.log(response)
  }
  catch (error){
    console.error(error.response.data.error);
  }
 

  //intent.push(req.body)
  res.status(200).json(message)
})

export default app