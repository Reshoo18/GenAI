import  Groq  from "groq-sdk";

const groq=new Groq({apiKey:process.env.GROQ_API_KEY})

async function main(){
   const Completion=await groq.chat.completions.create({
    model :'llama-3.3-70b-versatile',
    temperature:0,
    messages:[
        {
            role:'system',
            content:'You are a personal assistance who answer the asked question'
        },
        {
            role:'user',
            content:'when i phone 16 launched?'
        },
    ],
   })
   console.log(Completion.choices[0].message.content)
}

main()