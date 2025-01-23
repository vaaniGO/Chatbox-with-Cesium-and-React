from fastapi import FastAPI
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
from dotenv import load_dotenv
import shutil
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
load_dotenv()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)
CHROMA_PATH = "chroma"
DATA_PATH = "data"

@app.get("/")
def showConnection():
    return "Connection established."

@app.post("/generate-database")
def generate_data_store():
    documents = load_documents()
    chunks = split_text(documents)
    save_to_chroma(chunks)
    return {"message": "ChromaDB generated successfully."}

@app.get("/query")
def query_database(query: str):
    db = Chroma(
        persist_directory=CHROMA_PATH, 
        embedding_function=GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    )
    results = db.similarity_search(query, k=5)
    return {"results": [result.dict() for result in results]}

def load_documents():
    loader = DirectoryLoader(DATA_PATH, glob="*.md")
    documents = loader.load()
    return documents

def split_text(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=200,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.split_documents(documents)
    return chunks

def save_to_chroma(chunks: list[Document]):
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    db = Chroma.from_documents(
        chunks, GoogleGenerativeAIEmbeddings(model="models/embedding-001"), persist_directory=CHROMA_PATH
    )
    db.persist()
