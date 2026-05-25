import Groq from "groq-sdk";
import dotenv from "dotenv"

dotenv.config()
const groq=new Groq({apiKey:process.env.GROQ_API_KEY})

async function main(){
    
      const completion =await groq.chat.completions.create({
        model:'llama-3.3-70b-versatile',
        messages:[
          {
            role:'system',
            content:'Hy i am a assistant '
          },
          {
            role :'user',
            content:'who are you?'
          }
        ]
       });
       console.log(completion.choices[0].message.content)
}

main()