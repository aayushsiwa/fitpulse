from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    # 1. Ensure the database exists
    # Derive administrative connection string from DATABASE_URL
    # Base URL: protocol://user:pass@host:port/
    base_url = settings.DATABASE_URL.rsplit("/", 1)[0]
    db_name = settings.DATABASE_URL.rsplit("/", 1)[1]
    pg_url = f"{base_url}/postgres"

    conn = psycopg2.connect(pg_url)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()

    cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (db_name,))
    exists = cur.fetchone()
    if not exists:
        # Use simple string formatting since DB names can't be parameterized in CREATE DATABASE
        cur.execute(f"CREATE DATABASE {db_name}")

    cur.close()
    conn.close()

    # 2. Ensure all tables are created
    # Import all models here so SQLAlchemy knows about them
    from app.models.user import User  # noqa: F401
    from app.models.daily_log import DailyLog  # noqa: F401
    from app.models.recommendations import Recommendation  # noqa: F401

    Base.metadata.create_all(bind=engine)
