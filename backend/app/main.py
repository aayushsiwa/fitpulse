from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import user, log, recommendation, auth
from app.core.database import init_db, get_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("🚀 Starting APMHOS Backend...")
    print(f"📡 CORS Origins: {settings.CORS_ORIGINS}")
    
    # Mask password for logging
    db_log = settings.DATABASE_URL
    if ":" in db_log and "@" in db_log:
        try:
            prefix, rest = db_log.split("://", 1)
            creds, host_path = rest.split("@", 1)
            user = creds.split(":", 1)[0]
            db_log = f"{prefix}://{user}:****@{host_path}"
        except: pass
    print(f"🗄️ Database: {db_log}")
    
    init_db()
    yield
    # Shutdown logic (none needed for now)


from app.core.config import settings

app = FastAPI(title="APMHOS", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/users", tags=["Users"])
app.include_router(log.router, prefix="/logs", tags=["Logs"])
app.include_router(
    recommendation.router, prefix="/recommendations", tags=["Recommendations"]
)


@app.get("/health")
def health_check(db=Depends(get_db)):
    from sqlalchemy import text
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "up"}
    except Exception as e:
        return {"status": "error", "database": "down", "details": str(e)}


@app.head("/")
def root_head():
    return None


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
