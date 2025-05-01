# backend/src/main.py
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))  # DON'T CHANGE THIS !!!

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv

# Import Azure Key Vault clients
from azure.identity.aio import DefaultAzureCredential # Use async version
from azure.keyvault.secrets.aio import SecretClient # Use async version

# Load environment variables from .env file (primarily for local development)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".", ".env")) # Corrected path relative to main.py

# --- Azure Key Vault Integration --- 
async def load_credentials_from_keyvault():
    """Fetches DB credentials from Key Vault or uses environment variables."""
    key_vault_uri = os.getenv("KEY_VAULT_URI")
    db_user_secret_name = os.getenv("DB_USER_SECRET_NAME", "db-username")
    db_password_secret_name = os.getenv("DB_PASSWORD_SECRET_NAME", "db-password")

    db_user = None
    db_password = None

    if key_vault_uri:
        print(f"Attempting to fetch secrets from Key Vault: {key_vault_uri}")
        try:
            credential = DefaultAzureCredential()
            secret_client = SecretClient(vault_url=key_vault_uri, credential=credential)
            
            # Retrieve secrets asynchronously
            db_user_secret = await secret_client.get_secret(db_user_secret_name)
            db_password_secret = await secret_client.get_secret(db_password_secret_name)
            
            db_user = db_user_secret.value
            db_password = db_password_secret.value
            print("Successfully retrieved database credentials from Azure Key Vault.")
            await credential.close() # Close credential when done
            await secret_client.close()
        except Exception as e:
            print(f"Error retrieving secrets from Key Vault: {e}. Falling back to environment variables.")
            if credential: await credential.close()
            if secret_client: await secret_client.close()

    # Fallback to environment variables
    if not db_user:
        db_user = os.getenv("DB_USERNAME", "default_user")
    if not db_password:
        db_password = os.getenv("DB_PASSWORD", "default_password")
        
    # Set environment variables for database.py to pick up
    os.environ["DB_USERNAME"] = db_user
    os.environ["DB_PASSWORD"] = db_password
    print("Database credentials set.")

# --- End Azure Key Vault Integration ---

# Import database setup AFTER potentially setting credentials via Key Vault
from src.database import engine, create_tables
from src.models.models import Base # Import Base for table creation

# Import routers
from src.api import users, epics, tasks # Assuming __init__.py in api imports routers

# Define the path for the React frontend build directory
frontend_build_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dist"))

app = FastAPI(
    title="DevFlow API",
    description="API for managing development workflows (Epics, Tasks, Users)",
    version="0.1.0"
)

@app.on_event("startup")
async def startup_event():
    """Load credentials and create tables on startup."""
    await load_credentials_from_keyvault()
    # Re-initialize engine or sessionmaker here if credentials needed at that point
    # Or ensure database.py reads the updated os.environ variables when called
    await create_tables() # Create tables after credentials are set

# Include API routers
app.include_router(users.router, prefix="/api", tags=["Users"])
app.include_router(epics.router, prefix="/api", tags=["Epics"])
app.include_router(tasks.router, prefix="/api", tags=["Tasks"])

# Serve React App (Mount static files and serve index.html for SPA routing)
if os.path.exists(frontend_build_path):
    # Mount the assets directory first
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_build_path, "assets")), name="assets")
    # Mount the root static files (like favicon.ico, etc.)
    app.mount("/static_root", StaticFiles(directory=frontend_build_path), name="static_root")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """Serves static files or the index.html for SPA routing."""
        file_path = os.path.join(frontend_build_path, full_path)
        # Check if the requested path corresponds to a file in the build directory
        if os.path.isfile(file_path):
             return FileResponse(file_path)
        # If it's not a file, assume SPA routing and serve index.html
        index_path = os.path.join(frontend_build_path, 'index.html')
        if os.path.exists(index_path):
            return FileResponse(index_path)
        else:
            return {"message": "Frontend index.html not found."}, 404
else:
    print(f"Frontend build directory not found at: {frontend_build_path}")
    @app.get("/")
    async def root():
        return {"message": "Backend is running, but frontend build is missing."}

# For running locally with uvicorn
if __name__ == "__main__":
    import uvicorn
    # Run startup logic manually if running directly (uvicorn handles it when run as command)
    # import asyncio
    # asyncio.run(startup_event())
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)

