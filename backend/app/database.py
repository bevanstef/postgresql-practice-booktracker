import os
from urllib.parse import urlparse, urlunparse
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

raw_db_url = os.getenv("DATABASE_URL")
connect_args = {}

if raw_db_url:
    # 1. SQLAlchemy asyncpg requires 'postgresql+asyncpg://' driver scheme
    if raw_db_url.startswith("postgres://"):
        DATABASE_URL = raw_db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif raw_db_url.startswith("postgresql://") and not raw_db_url.startswith("postgresql+asyncpg://"):
        DATABASE_URL = raw_db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    else:
        DATABASE_URL = raw_db_url

    # 2. Strip libpq query params (sslmode, channel_binding, etc.) that asyncpg doesn't support
    parsed = urlparse(DATABASE_URL)
    
    # If any SSL indicators were present in the URL, enable SSL for asyncpg
    if "ssl" in parsed.query.lower() or "require" in parsed.query.lower():
        connect_args["ssl"] = True

    # Clean the query string completely so asyncpg doesn't get unexpected kwargs
    DATABASE_URL = urlunparse(parsed._replace(query=""))
else:
    user = os.getenv("POSTGRES_USER", "postgres")
    password = os.getenv("POSTGRES_PASSWORD", "postgres")
    host = os.getenv("POSTGRES_HOST", "localhost")
    port = os.getenv("POSTGRES_PORT", "5432")
    db_name = os.getenv("POSTGRES_DB", "postgres")
    DATABASE_URL = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db_name}"

# Create async engine with SSL config
engine = create_async_engine(DATABASE_URL, echo=True, connect_args=connect_args)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
