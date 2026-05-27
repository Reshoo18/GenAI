import Groq from "groq-sdk";
import {tavily} from "@tavily/core"
import dotenv from "dotenv"

dotenv.config()
const tvly= tavily({apiKey:process.env.TAVILY_API_KEY})
const groq=new Groq({apiKey:process.env.GROQ_API_KEY})

async function main(){
      const messages=[
          {
            role:'system',
            content:`you are the smart assistance who answer the asked question
            you have access to following tools:
           You can use webSearch tool to search latest information.`
          },
          {
            role :'user',
            content:'when i phone 16 launched?'
          }
        ]
      const completions =await groq.chat.completions.create({
        //response_format:{type:'json_object'},
        model:'llama-3.3-70b-versatile',
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
        tool_choice: {
  type: "function",
  function: {
    name: "webSearch"
  }

},
       });
      messages.push(completions.choices[0].message)
       const toolCalls=completions.choices[0].message.tool_calls

        if(!toolCalls){
          console.log(`AI ${completions.choices[0].message.content}`)
          return
        }

        for(const tool of toolCalls){
          console.log('tool',tool)
          const functionName=tool.function.name;
          const functionParams=tool.function.arguments;
          if(functionName==='webSearch'){
           const toolresult= await webSearch(JSON.parse(functionParams))
           console.log('toolResult:',toolresult)
           messages.push({
            tool_call_id:tool.id,
            role:'tool',
            name:functionName,
            content:toolresult
           })
          }
        }
            const completions2 =await groq.chat.completions.create({
        //response_format:{type:'json_object'},
        model:'llama-3.3-70b-versatile',
        
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
        tool_choice: {
  type: "function",
  function: {
    name: "webSearch"
  }
  
},
       });
       console.log(JSON.stringify(completions2.choices[0].message,null,2))
}

main();



async function webSearch({query}){

  console.log('calling webSearch......')
        const respose= await tvly.search(query)
        console.log('Response:',respose)

        const finalResult=respose.results.map((result)=>result.content).join("\n");;
        
  return finalResult;
}