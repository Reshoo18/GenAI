console.log("working")


const input=document.querySelector("#input")


const chatContainer=document.querySelector("#chat-container")
const askBtn=document.querySelector("#ask")


input?.addEventListener('keyup',handler);
askBtn.addEventListener('click',handlerAsk)

function generate(text){

    // Append msg you ui

    const msg=document.createElement('div');
    msg.className=`my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit`;
    msg.textContent=text;
    chatContainer?.appendChild(msg);
    input.value='';

    

    // send it to LLM


    // show LLm respond to ui

}

function handlerAsk(e){
     const text=input?.value.trim()
    if(!text){
        return
    }
    generate(text)
   
}

function handler(e){

   if(e.key==='Enter'){
   const text=input?.value.trim()
    if(!text){
        return
    }
    generate(text)
   }
}