from fastapi import FastAPI
from database import engine,Base
from fastapi.middleware.cors import CORSMiddleware
from routes import router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/transactions")