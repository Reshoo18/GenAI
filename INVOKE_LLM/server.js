import express from "express"

const app=express();
const PORT=3001;

app.use(express.json());

app.get('/',(req,res)=>{
   res.send("Hello world")
  
})

app.post('/chat',(req,res)=>{
    const {message}=req.body;
     console.log('message',message)
     res.json({message:'Ok'})
})

app.listen(PORT,()=>{
    console.log(`Server are listening at this port ${PORT}`)
})