import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mapas import mapas_bp
from middlewares.auth import AuthMiddleware

load_dotenv()

app = FastAPI()

# Registrar los microservicios como Blueprints
app.include_router(mapas_bp)

app.add_middleware(AuthMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Ejecutar la aplicación FastAPI
if __name__ == "__main__":
    puerto = os.getenv("SERVICE_MAPAS_PORT")
    if puerto:
        puerto = int(puerto)
        uvicorn.run("app:app", host="0.0.0.0", port=puerto, reload=True)
