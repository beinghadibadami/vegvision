from datetime import datetime, timedelta
from app.core.database import db
from app.services.scraper import scrape_bigbasket

async def get_product_price(product_name, force_refresh=False):
    """Get product price with caching"""
    product_name_normalized = product_name.lower()
    
    collection = db.get_collection()
    
    # Check cache if MongoDB is available
    if collection is not None and not force_refresh:
        cache_cutoff = datetime.utcnow() - timedelta(hours=24)
        cached_product = collection.find_one({
            "name": product_name_normalized.capitalize(),
            "scraped_at": {"$gt": cache_cutoff}
        })
        
        if cached_product:
            return {
                "price": cached_product["price"],
                "quantity": cached_product["quantity"]
            }
    
    # Scrape new data
    return await scrape_bigbasket(product_name_normalized)
