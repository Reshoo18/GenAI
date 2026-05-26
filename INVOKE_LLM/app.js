import Groq from "groq-sdk";
import dotenv from "dotenv"

dotenv.config()
const groq=new Groq({apiKey:process.env.GROQ_API_KEY})

async function main(){
    
      const completion =await groq.chat.completions.create({
        //response_format:{type:'json_object'},
        model:'llama-3.3-70b-versatile',
        
        messages:[
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
        ],
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
        tool_choice:'auto',
       });

       const toolCalls=completion.choices[0].message.tool_calls

        if(!toolCalls){
          console.log(`AI ${completion.choices[0].message.content}`)
          return
        }

        for(const tool of toolCalls){
          console.log('tool',tool)
          const functionName=tool.function.name;
          const functionParams=tool.function.arguments;
          if(functionName==='webSearch'){
           const toolresult= await webSearch(JSON.parse(functionParams))
           console.log('toolResult:',toolresult)
          }
        }
       //console.log(JSON.stringify(completion.choices[0].message,null,2))
}

main();



function webSearch({query}){

  console.log('calling webSearch......')

  return "i phone 16 was launched on september 2024";
}