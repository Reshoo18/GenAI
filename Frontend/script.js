




const input=document.querySelector("#input")


const chatContainer=document.querySelector("#chat-container")
const askBtn=document.querySelector("#ask")


input?.addEventListener('keyup',handler);
askBtn.addEventListener('click',handlerAsk)


const loading=document.createElement('div')
loading.className='my-6'
loading.textContent='Thinking....'

async function generate(text){

    // Append msg you ui

    const msg=document.createElement('div');
    msg.className=`my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit`;
    msg.textContent=text;
    chatContainer?.appendChild(msg);
    input.value='';
    
    chatContainer?.appendChild(loading)
    

    // send it to LLM


    // show LLm respond to ui
    const assistantMsg=await callServer(text)
    const assistantMsgElem=document.createElement('div');
    assistantMsgElem.className=`max-w-fit`;
    assistantMsgElem.textContent=assistantMsg;
    loading.remove();
    chatContainer?.appendChild(assistantMsgElem);
    
}

async function callServer(inputText){
    const response=await fetch('http://localhost:3001/chat',{ 
        method:'POST',
        headers:{
            'content-type':'application/json',
        },
        body: JSON.stringify({message:inputText})
})

      if(!response.ok){
        throw new Error("Something went wrong")
      }

      const result=await response.json();
      return result.message;

}
   

async function handlerAsk(e){
     const text=input?.value.trim()
    if(!text){
        return
    }
    await generate(text)
   
}

async function handler(e){

   if(e.key==='Enter'){
   const text=input?.value.trim()
    if(!text){
        return
    }
    await generate(text)
   }
}