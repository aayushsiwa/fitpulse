from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import user, log, recommendation

app = FastAPI(title="Adaptive Health App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(log.router, prefix="/logs", tags=["Logs"])
app.include_router(
    recommendation.router, prefix="/recommendations", tags=["Recommendations"]
)
