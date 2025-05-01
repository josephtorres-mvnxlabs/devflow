# backend/src/database.py
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Import Azure Key Vault clients (if needed directly here, though likely handled in main app setup)
# from azure.identity import DefaultAzureCredential
# from azure.keyvault.secrets import SecretClient

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# --- Database Connection Setup ---
# Reuse logic to get credentials (Key Vault or Env Vars)
# This part might be better placed in a config module or main app setup
# For simplicity here, we directly use os.getenv, assuming they are set

key_vault_uri = os.getenv("KEY_VAULT_URI")
db_user = os.getenv("DB_USERNAME", "default_user")
db_password = os.getenv("DB_PASSWORD", "default_password")

# TODO: Integrate Key Vault credential fetching properly if needed here
# if key_vault_uri:
#     try:
#         credential = DefaultAzureCredential()
#         secret_client = SecretClient(vault_url=key_vault_uri, credential=credential)
#         db_user = secret_client.get_secret(os.getenv("DB_USER_SECRET_NAME", "db-username")).value
#         db_password = secret_client.get_secret(os.getenv("DB_PASSWORD_SECRET_NAME", "db-password")).value
#     except Exception as e:
#         print(f"Warning: Failed to get DB credentials from Key Vault: {e}. Using env vars.")

db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "5432")
db_name = os.getenv("DB_NAME", "default_db")

# Use asyncpg driver for PostgreSQL with asyncio
DATABASE_URL = f"postgresql+asyncpg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}?ssl=require"

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=True) # echo=True for debugging SQL

# Create async session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Dependency to get DB session
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# Import Base from models to potentially use for table creation
from src.models.models import Base

async def create_tables():
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all) # Use drop_all carefully
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables checked/created.")

