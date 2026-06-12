from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers.auth_controller import router as auth_router
from controllers.movie_controller import router as movie_router
from controllers.tv_controller import router as tv_router
from controllers.watchlist_controller import router as watchlist_router
from controllers.stats_controller import router as dashboard_router


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
app.include_router(movie_router)
app.include_router(tv_router)
app.include_router(watchlist_router)
app.include_router(dashboard_router)