# DevFlow: Idea to Iterate AI Project

This project is a web application designed to manage development workflows, including epics, tasks, and users. It features a React frontend and a Python/FastAPI backend.

## Original Project Info (Lovable)

**URL**: https://lovable.dev/projects/c75002c4-f9bd-4c9b-a86b-4a97eaa05aae

## Technologies Used

*   **Frontend:** Vite, TypeScript, React, shadcn-ui, Tailwind CSS
*   **Backend:** Python, FastAPI, SQLAlchemy (async)
*   **Database:** PostgreSQL (Designed for Azure PostgreSQL Flexible Server)
*   **Secrets Management:** Azure Key Vault
*   **Deployment:** Azure App Service (Linux)

## Local Development Setup

### Prerequisites

*   Node.js and npm (or pnpm/yarn) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
*   Python 3.11+
*   A local PostgreSQL instance (optional, for testing backend locally)

### Steps

1.  **Clone the repository:**
    ```sh
    git clone <YOUR_GIT_URL>
    cd <YOUR_PROJECT_NAME>
    ```

2.  **Setup Frontend:**
    ```sh
    # Navigate to the root directory if not already there
    npm install # or pnpm install / yarn install
    ```

3.  **Setup Backend:**
    ```sh
    cd backend
    python3.11 -m venv venv
    source venv/bin/activate # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

4.  **Configure Backend Environment (Local):**
    *   Create a `.env` file in the `backend` directory.
    *   Add your local PostgreSQL connection details:
        ```dotenv
        # Optional: For local testing if not using Key Vault locally
        DB_USERNAME=your_local_db_user
        DB_PASSWORD=your_local_db_password
        DB_HOST=localhost
        DB_PORT=5432
        DB_NAME=your_local_db_name
        # KEY_VAULT_URI= (Leave empty or comment out for local DB testing)
        ```
    *   If using a local DB, create the database specified in `DB_NAME`.

5.  **Create Database Tables (Local):**
    The FastAPI application is configured to automatically check and create database tables on startup using the `create_tables()` function in `database.py`. Ensure your local database is running before starting the backend.

6.  **Run Development Servers:**
    *   **Frontend:** In the root directory, run:
        ```sh
        npm run dev
        ```
        (Access at http://localhost:8080 or similar)
    *   **Backend:** In the `backend` directory (with venv activated), run:
        ```sh
        uvicorn src.main:app --host 0.0.0.0 --port 5000 --reload
        ```
        (API accessible at http://localhost:5000, interactive docs at http://localhost:5000/docs)

## Azure Deployment

This application is designed to be deployed to Azure App Service (Linux) with Azure PostgreSQL Flexible Server and Azure Key Vault.

### Prerequisites

*   Azure Account
*   Azure CLI installed and configured (`az login`)
*   Node.js and npm (for building the frontend)
*   Python 3.11+

### 1. Provision Azure Resources

You need to create the following Azure resources. Replace placeholders like `<resource-group>`, `<app-name>`, `<location>`, `<db-server-name>`, `<db-name>`, `<db-admin-user>`, `<db-admin-password>`, `<keyvault-name>` with your desired names.

*   **Resource Group:**
    ```sh
    az group create --name <resource-group> --location <location>
    ```
*   **Azure PostgreSQL Flexible Server:**
    ```sh
    # Create the server
    az postgres flexible-server create --resource-group <resource-group> --name <db-server-name> --location <location> --admin-user <db-admin-user> --admin-password <db-admin-password> --sku-name Standard_B1ms --tier Burstable --public-access 0.0.0.0 --storage-size 32 --version 14

    # Create the database
    az postgres flexible-server db create --resource-group <resource-group> --server-name <db-server-name> --database-name <db-name>

    # Note: Ensure firewall allows access from your deployment source and Azure App Service later.
    # Get your App Service outbound IPs after creating it and add firewall rules.
    ```
*   **Azure Key Vault:**
    ```sh
    # Create Key Vault
    az keyvault create --name <keyvault-name> --resource-group <resource-group> --location <location>

    # Store database credentials as secrets
    az keyvault secret set --vault-name <keyvault-name> --name db-username --value <db-admin-user>
    az keyvault secret set --vault-name <keyvault-name> --name db-password --value <db-admin-password>
    ```
*   **Azure App Service (Linux, Python):**
    ```sh
    # Create App Service Plan (Linux)
    az appservice plan create --name <app-plan-name> --resource-group <resource-group> --location <location> --is-linux --sku B1

    # Create Web App (Python 3.11)
    az webapp create --resource-group <resource-group> --plan <app-plan-name> --name <app-name> --runtime "PYTHON|3.11"

    # Enable Managed Identity for App Service
    az webapp identity assign --resource-group <resource-group> --name <app-name>
    # Copy the principalId from the output
    PRINCIPAL_ID="<principalId_from_output>"

    # Grant App Service Managed Identity access to Key Vault secrets
    az keyvault set-policy --name <keyvault-name> --resource-group <resource-group> --object-id $PRINCIPAL_ID --secret-permissions get list
    ```

### 2. Configure App Service Settings

Set the necessary environment variables/application settings for your App Service. These tell the FastAPI app how to connect to Key Vault and the database.

```sh
az webapp config appsettings set --resource-group <resource-group> --name <app-name> --settings \
    KEY_VAULT_URI="https://<keyvault-name>.vault.azure.net/" \
    DB_HOST="<db-server-name>.postgres.database.azure.com" \
    DB_PORT="5432" \
    DB_NAME="<db-name>" \
    DB_USER_SECRET_NAME="db-username" \
    DB_PASSWORD_SECRET_NAME="db-password" \
    SCM_DO_BUILD_DURING_DEPLOYMENT=true \
    WEBSITE_RUN_FROM_PACKAGE=1
```

Set the startup command for Gunicorn with Uvicorn workers:
```sh
az webapp config set --resource-group <resource-group> --name <app-name> --startup-file "gunicorn -c backend/gunicorn_conf.py backend.src.main:app"
```

### 3. Build and Deploy

*   **Build Frontend:**
    ```sh
    npm run build
    # This creates the `dist` directory with static frontend assets.
    ```
*   **Prepare Deployment Package:** Create a zip file containing:
    *   The entire `backend` directory (including `venv`, `requirements.txt`, `gunicorn_conf.py`, `src`, etc.)
    *   The `dist` directory (from the frontend build)
    *   Ensure the structure in the zip file mirrors the project structure (e.g., `backend/`, `dist/` at the root).

*   **Deploy using Azure CLI (Zip Deploy):**
    ```sh
    # Make sure you are in the project's root directory
    # Create the zip file (example using zip command)
    zip -r deployment.zip backend dist

    # Deploy the zip file
    az webapp deployment source config-zip --resource-group <resource-group> --name <app-name> --src deployment.zip
    ```

### 4. Create Database Tables on Azure

The FastAPI application is configured to automatically attempt to create the database tables on startup using the `create_tables()` function defined in `backend/src/database.py` and called in `backend/src/main.py`. Check the App Service logs (Log stream) after deployment to confirm successful table creation or diagnose any issues.

### 5. Access Your Application

Your application should now be accessible at `https://<app-name>.azurewebsites.net`. The API documentation will be available at `https://<app-name>.azurewebsites.net/docs`.

## Original Lovable Deployment Info

### How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c75002c4-f9bd-4c9b-a86b-4a97eaa05aae) and click on Share -> Publish.

### Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

