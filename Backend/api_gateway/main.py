from fastapi import FastAPI, Request
import httpx

app = FastAPI()

routes = {
    "/auth": "http://auth-service:8001",
    "/customer": "http://customer-service:8003",
    "/authorization": "http://authorization-service:8002",
    "/delivery": "http://delivery-service:8004",
    "/inventory": "http://inventory-service:8005"
}

@app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def proxy(full_path: str, request: Request):
    path = "/" + full_path
    service_url = None

    for prefix, target in routes.items():
        if path.startswith(prefix):
            service_url = target + path
            break

    if not service_url:
        return {"error": "Ruta no encontrada"}

    async with httpx.AsyncClient() as client:
        req_data = await request.body()
        headers = dict(request.headers)
        method = request.method.lower()

        response = await getattr(client, method)(
            service_url,
            headers=headers,
            content=req_data
        )

    return response.json()
