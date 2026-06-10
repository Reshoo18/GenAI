import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';


export async function indexTheDocument(filePath){
 
  const loader = new PDFLoader(filePath,{splitPages:false});

  const docs = await loader.load();
  
  
  const textsplitters= new RecursiveCharacterTextSplitter({
    chunkSize:500,
    chunkOverlap:100,
  })
  
  const text= await textsplitters.splitText(docs[0].pageContent)
  console.log(text.length);
  
}