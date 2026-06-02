import readline from 'node:readline/promises'
import Groq from "groq-sdk";
import {tavily} from "@tavily/core"
import dotenv from "dotenv"
import { stdin, stdout } from 'node:process';

dotenv.config()
const tvly= tavily({apiKey:process.env.TAVILY_API_KEY})
const groq=new Groq({apiKey:process.env.GROQ_API_KEY})

export async function generate(userMessage){
    
      
      const messages=[
          {
            role:'system',
          content:`You are a smart assistant.
          Current date and time : ${new Date().toUTCString()} 
           
           Instructions:
- Answer naturally like ChatGPT.
- Use plain text.
- Do not use markdown tables.
- Keep responses easy to read.
- When providing weather, news, or search results, summarize them in normal sentences.
          `
          },
          // {
          //   role :'user',
          //   content:'when i phone 16 launched?'
          // }
        ]

       
          
          messages.push({
            role:'user',
            content:userMessage
          })

          while (true){
           const completions =await groq.chat.completions.create({
        //response_format:{type:'json_object'},
        temperature:0,
        model:'openai/gpt-oss-120b',
        messages:messages,
        
        tools:[
          {
      "type": "function",
      "function": {
        "name": "webSearch",
        "description": "Search the latest information and realtime data on internet",
        "parameters": {
          // JSON Schema object
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "the search query to perform on search"
            },
           
          },
          "required": ["query"]
        }
      }
    }
        ],
        
       });
      messages.push(completions.choices[0].message)
       const toolCalls=completions.choices[0].message.tool_calls

        if(!toolCalls){
         return completions.choices[0].message.content
          break;
        }

        for(const tool of toolCalls){
         // console.log('tool',tool)
          const functionName=tool.function.name;
          const functionParams=tool.function.arguments;
          if(functionName==='webSearch'){
           const toolresult= await webSearch(JSON.parse(functionParams))
           //console.log('toolResult:',toolresult)
           messages.push({
            tool_call_id:tool.id,
            role:'tool',
            name:functionName,
            content:toolresult
           })
          }
        }
        }
        
      
}





async function webSearch({query}){

  console.log('calling webSearch......')
        const respose= await tvly.search(query)
       // console.log('Response:',respose)

        const finalResult=respose.results.map((result)=>result.content).join("\n\n");;

        
        
  return finalResult;
}