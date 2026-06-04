import readline from 'node:readline/promises'
import Groq from "groq-sdk";
import {tavily} from "@tavily/core"
import dotenv from "dotenv"
import { stdin, stdout } from 'node:process';
import NodeCache from 'node-cache';



dotenv.config()
const myCache= new NodeCache({stdTTL:60*60*24});




const tvly= tavily({apiKey:process.env.TAVILY_API_KEY})
const groq=new Groq({apiKey:process.env.GROQ_API_KEY})

export async function generate(userMessage,theadId){
    
      
        const baseMessages=[
          {
            role:'system',
          content:`You are a smart assistant.
          Current date and time : ${new Date().toUTCString()} 
           
           IMPORTANT:
- Respond ONLY in plain text.
- Never use markdown.
- Never use markdown tables.
- Never use **bold** formatting.
- Never use headings.
- Never use bullet points.
- Never use the characters *, #, |, or - for formatting.
- Write answers as normal conversational sentences.
- Summarize information naturally like ChatGPT.

          `
          },
          // {
          //   role :'user',
          //   content:'when i phone 16 launched?'
          // }
        ]

        const messages=myCache.get(theadId) ?? baseMessages
       
          
          messages.push({
            role:'user',
            content:userMessage
          })
          
          const MAX_RETRIES=10;
          let count=0;

          while (true){
            if(count>MAX_RETRIES){
              return "I could not find the result, pls try again later"
            }
            count++;
           const completions =await groq.chat.completions.create({
        //response_format:{type:'json_object'},
        temperature:0,
        model:'llama-3.1-8b-instant',
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
         myCache.set(theadId,messages)
       
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

        const finalResult=respose.results.map((result)=>result.content).join("\n\n");

        

        
        
  return finalResult;
}