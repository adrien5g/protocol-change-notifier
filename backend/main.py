import uvicorn
from config import settings

if __name__ == "__main__":
    uvicorn.run(
        app="app:socket_app",
        reload=True,
        host=settings.backend_host,
        port=settings.backend_port,
        app_dir="backend"
    )
