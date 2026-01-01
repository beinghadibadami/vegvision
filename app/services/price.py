from datetime import datetime, timedelta
from app.core.database import db
from app.services.scraper import scrape_bigbasket

def parse_price(price_str):
    """Extract numeric price from string like '₹45' or 'Rs 45'"""
    try:
        # Remove non-numeric chars except dot
        import re
        clean = re.sub(r'[^\d.]', '', price_str)
        return float(clean)
    except:
        return 0.0

async def get_product_price(product_name, force_refresh=False):
    """Get product price with caching and analysis"""
    product_name_normalized = product_name.lower()
    
    collection = db.get_collection()
    cached_product = None
    
    # Check cache if MongoDB is available
    if collection is not None and not force_refresh:
        cache_cutoff = datetime.utcnow() - timedelta(hours=24)
        cached_product = collection.find_one({
            "name": product_name_normalized.capitalize(),
            "scraped_at": {"$gt": cache_cutoff}
        })
        
    result = None
    if cached_product:
        result = {
            "price": cached_product["price"],
            "quantity": cached_product["quantity"],
            "price_history": cached_product.get("price_history", [])
        }
    else:
        # Scrape new data
        scrape_result = await scrape_bigbasket(product_name_normalized)
        # If scrape was successful, we might want to fetch the updated doc to get full history
        # allowing for a slight delay or just use what we have
        if scrape_result.get("success"):
            # Re-fetch from DB to get history if available, or just partial fields
            if collection is not None:
                updated_doc = collection.find_one({"name": product_name_normalized.capitalize()})
                if updated_doc:
                     result = {
                        "price": updated_doc["price"],
                        "quantity": updated_doc["quantity"],
                        "price_history": updated_doc.get("price_history", [])
                    }
        
        if not result and scrape_result.get("success"):
             result = {
                "price": scrape_result["price"],
                "quantity": scrape_result["quantity"],
                "price_history": []
            }
        elif not result:
            return {"price": "N/A", "quantity": "N/A", "price_analysis": {"verdict": "Unknown"}}

    # Perform Price Analysis
    current_price = parse_price(result["price"])
    history = result.get("price_history", [])
    
    analysis = {
        "verdict": "Fair Price",
        "difference": 0,
        "average": current_price
    }
    
    if current_price > 0 and len(history) > 1:
        # Calculate average of PAST entries (excluding current if duplicate/recent pushed)
        # We can just take all valid prices
        total = 0
        count = 0
        for entry in history:
            p = parse_price(entry.get("price", "0"))
            if p > 0:
                total += p
                count += 1
        
        if count > 0:
            avg_price = total / count
            diff_percent = ((current_price - avg_price) / avg_price) * 100
            
            analysis["average"] = round(avg_price, 2)
            analysis["difference"] = round(diff_percent, 1)
            
            if diff_percent <= -10:
                analysis["verdict"] = "Great Deal"
            elif diff_percent >= 10:
                analysis["verdict"] = "High Price"
            else:
                analysis["verdict"] = "Fair Price"
                
    result["price_analysis"] = analysis
    
    # Clean up history and serialize datetime objects
    if result.get("price_history"):
        sanitized_history = []
        for entry in result["price_history"]:
            sanitized_entry = entry.copy()
            if "scraped_at" in sanitized_entry and isinstance(sanitized_entry["scraped_at"], datetime):
                sanitized_entry["scraped_at"] = sanitized_entry["scraped_at"].isoformat()
            if "_id" in sanitized_entry:
                sanitized_entry.pop("_id")
            sanitized_history.append(sanitized_entry)
        result["price_history"] = sanitized_history

    return result
