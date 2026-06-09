import {PDFLoader} from '@langchain/community/document_loaders/fs/pdf'


export async function indexTheDocument(filePath){
  console.log("File Path:", filePath);

  const loader = new PDFLoader(filePath);

  const docs = await loader.load();

  console.log("Documents Loaded:");
  console.log(docs);

  return docs;
}