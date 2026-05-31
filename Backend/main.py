from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router.auth_router import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#handle routing
@app.get("/")
def read_root():
    return {"message": "CineLog API is running!"}

app.include_router(auth_router)