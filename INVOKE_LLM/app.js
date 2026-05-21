import  Groq  from "groq-sdk";

const groq=new Groq({apiKey:process.env.GROQ_API_KEY})

async function main(){
   const Completion=await groq.chat.completions.create({
    model :'llama-3.3-70b-versatile',
    messages:[
        {
            role:'system',
            content:'You are a jarvis .you are h grate be always polite'
        },
        {
            role:'user',
            content:'who are you?'
        },
    ],
   })
   console.log(Completion.choices[0].message.content)
}

main()