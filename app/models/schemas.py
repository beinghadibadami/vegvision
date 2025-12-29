from pydantic import BaseModel

class ImageUrlInput(BaseModel):
    image_url: str
