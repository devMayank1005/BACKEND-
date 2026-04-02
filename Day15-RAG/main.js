import pdf from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import fs from "fs";

dotenv.config();

// ✅ Pinecone init
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.index("mayai-rag");

// // ✅ Read PDF
// const dataBuffer = fs.readFileSync("./RP.pdf");

// // ✅ Correct pdf-parse usage
// const data = await pdf(dataBuffer);

// console.log("Extracted text length:", data.text.length);

// ✅ Split text
// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 1200,
//   chunkOverlap: 0,
// });

// const chunks = await splitter.splitText(data.text);

// ✅ Embeddings
const embeddings = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-embed",
});


// const docs = await Promise.all(chunks.map(async (chunk) => {
//     const embedding = await embeddings.embedQuery(chunk)
//     return {
//         text: chunk,
//         embedding
//     }
// }))

// const result = await index.upsert({
//     records: docs.map((doc, i) => ({
//         id: `doc-${i}`,
//         values: doc.embedding,
//         metadata: {
//             text: doc.text
//         }
//     }))
// })
//console.log("Upsert result:", result);

const queryEmbedding = await embeddings.embedQuery("give me abstract of the paper");




console.log(queryEmbedding)

const result = await index.query({
    vector: queryEmbedding,
    topK: 2,
    includeMetadata: true
})


console.log(JSON.stringify(result))
