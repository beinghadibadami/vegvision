from fastapi import APIRouter, File, UploadFile, Query, HTTPException, Depends
from fastapi.responses import JSONResponse
from app.models.schemas import ImageUrlInput
from app.services.analysis import analyze_image
from app.services.price import get_product_price
from app.utils.image import download_image
from app.core.database import db
from app.core.config import settings

router = APIRouter()

@router.post("/analyze/upload", response_class=JSONResponse)
async def analyze_upload(
    file: UploadFile = File(...),
    force_refresh: bool = Query(False, description="Force a new price scrape instead of using cached data")
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file is not an image")
    
    image_data = await file.read()
    result = await analyze_image(image_data, force_refresh)
    return JSONResponse(content=result)

@router.post("/analyze/url", response_class=JSONResponse)
async def analyze_url(
    input_data: ImageUrlInput,
    force_refresh: bool = Query(False, description="Force a new price scrape instead of using cached data")
):
    image_data = download_image(input_data.image_url)
    result = await analyze_image(image_data, force_refresh)
    return JSONResponse(content=result)

@router.get("/price/{product_name}", response_class=JSONResponse)
async def get_price_endpoint(
    product_name: str,
    force_refresh: bool = Query(False, description="Force a new scrape instead of using cached data")
):
    price_info = await get_product_price(product_name, force_refresh)
    return JSONResponse(content={"name": product_name.capitalize(), **price_info})

@router.get("/health")
async def health_check():
    """Health check endpoint for deployment"""
    return {
        "status": "healthy",
        "mongodb": "connected" if db.get_db() is not None else "disconnected",
        "groq_api": "configured" if settings.GROQ_API_KEY else "not configured",
        "version": settings.VERSION,
    }

@router.get("/")
async def root():
    return {
        "message": settings.PROJECT_NAME,
        "status": "running",
        "version": settings.VERSION,
        "endpoints": {
            "analyze_upload": "/analyze/upload - Upload an image for complete analysis including price",
            "analyze_url": "/analyze/url - Provide an image URL for complete analysis including price",
            "get_price": "/price/{product_name} - Get only price information for a product",
            "health": "/health - Health check endpoint"
        }
    }
