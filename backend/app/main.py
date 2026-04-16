from fastapi import FastAPI
from app.api.v1 import user, log, recommendation

app = FastAPI(title="Adaptive Health App")

app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(log.router, prefix="/logs", tags=["Logs"])
app.include_router(
    recommendation.router, prefix="/recommendations", tags=["Recommendations"]
)
