# backend/gunicorn_conf.py
import os

# Get the port from the environment variable set by Azure App Service
port = os.environ.get("PORT", "8000")

# Gunicorn configuration
bind = f"0.0.0.0:{port}"

# Use Uvicorn workers for FastAPI (async)
worker_class = "uvicorn.workers.UvicornWorker"

# Number of workers (adjust based on App Service plan)
# A common recommendation is (2 * number_of_cores) + 1
workers = int(os.environ.get("WEB_CONCURRENCY", "4"))

# Logging (optional, customize as needed)
# accesslog = "-" # Log to stdout
# errorlog = "-"  # Log to stderr
# loglevel = "info"

