import os

import httpx
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import Response

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SERVICE_MAP = {
    "wikis": f"http://{os.getenv('ENDPOINT_WIKIS')}:{os.getenv('SERVICE_WIKIS_PORT')}/v3/wikis",
    "entradas": f"http://{os.getenv('ENDPOINT_ENTRADAS')}:{os.getenv('SERVICE_ENTRADAS_PORT')}/v3/entradas",
    "versiones": f"http://{os.getenv('ENDPOINT_ENTRADAS')}:{os.getenv('SERVICE_ENTRADAS_PORT')}/v3/versiones",
    "comentarios": f"http://{os.getenv('ENDPOINT_COMENTARIOS')}:{os.getenv('SERVICE_COMENTARIOS_PORT')}/v3/comentarios",
    "valoraciones": f"http://{os.getenv('ENDPOINT_COMENTARIOS')}:{os.getenv('SERVICE_COMENTARIOS_PORT')}/v3/valoraciones",
    "usuarios": f"http://{os.getenv('ENDPOINT_USUARIOS')}:{os.getenv('SERVICE_USUARIOS_PORT')}/v3/usuarios",
    "archivos": f"http://{os.getenv('ENDPOINT_ARCHIVOS')}:{os.getenv('SERVICE_ARCHIVOS_PORT')}/v3/archivos",
    "notificaciones": f"http://{os.getenv('ENDPOINT_NOTIFICACIONES')}:{os.getenv('SERVICE_NOTIFICACIONES_PORT')}/v3/notificaciones",
    "mapas": f"http://{os.getenv('ENDPOINT_MAPAS')}:{os.getenv('SERVICE_MAPAS_PORT')}/v3/mapas",
    "traducciones": f"http://{os.getenv('ENDPOINT_TRADUCCIONES')}:{os.getenv('SERVICE_TRADUCCIONES_PORT')}/v3/traducciones",
}


@app.api_route(
    "/{service}/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    include_in_schema=False,
)
async def gateway(request: Request, service: str, path: str):
    # Validate the requested service
    if service not in SERVICE_MAP:
        raise HTTPException(status_code=404, detail="Service not found")

    # Construct the target URL
    query_params = request.query_params
    target_url = f"{SERVICE_MAP[service]}/{path}"
    if query_params:
        target_url += f"?{query_params}"

    # Forward the request
    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                request.method,
                target_url,
                headers=request.headers.raw,
                content=await request.body(),
            )
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers),
            )
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", reload=True)
