from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes.health import router as health_router
from app.api.routes.documents import router as documents_router
from app.api.routes.user_profile import router as user_profile_router
from app.api.routes.loans import router as loans_router
from app.schemas.health import HealthResponse

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="TrustLedger - AI + Cybersecurity Fraud Shield for Digital Lending API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for local and staging development
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GET /health directly as requested
@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Health"],
    summary="Health Check"
)
async def health_check():
    return HealthResponse(
        status="healthy",
        service=settings.SERVICE_NAME
    )

# Mount routers directly for direct URLs and versioned prefix
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
app.include_router(documents_router)
app.include_router(documents_router, prefix=settings.API_V1_PREFIX)
app.include_router(user_profile_router)
app.include_router(user_profile_router, prefix=settings.API_V1_PREFIX)
app.include_router(loans_router)
app.include_router(loans_router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Root"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "service": settings.SERVICE_NAME,
        "tagline": "AI + Cybersecurity Fraud Shield for Digital Lending",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
