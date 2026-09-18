from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Returns the current operating status and service identifier."
)
async def get_health():
    return HealthResponse(
        status="healthy",
        service=settings.SERVICE_NAME
    )
