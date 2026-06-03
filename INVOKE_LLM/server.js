import express from "express"
import cors from 'cors';

import { generate } from "./chatbot.js";

const app=express();
const PORT=3001;

app.use(cors())
app.use(express.json());

app.get('/',(req,res)=>{
   res.send("Hello world")
  
})

app.post('/chat',async(req,res)=>{
    const {message,theadId}=req.body;

    if(!message || !theadId){
        res.status(400).json({message:"ALl field are required"})
    }

     console.log('message',message)
     const result=await generate(message,theadId)
     res.json({message:result})
})

app.listen(PORT,()=>{
    console.log(`Server are listening at this port ${PORT}`)
})