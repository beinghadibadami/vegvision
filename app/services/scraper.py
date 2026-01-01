import logging
import traceback
from datetime import datetime
from playwright.async_api import async_playwright
from app.core.database import db

# Setup logging
logger = logging.getLogger(__name__)

async def scrape_bigbasket(search_query):
    """
    Scrape BigBasket for product details using Async Playwright.
    """
    url = f"https://www.bigbasket.com/ps/?q={search_query}"
    
    playwright = await async_playwright().start()
    browser = await playwright.firefox.launch(headless=True)
    
    try:
        context = await browser.new_context()
        page = await context.new_page()

        # Set timeouts
        page.set_default_navigation_timeout(30000)

        # Block heavy resources for speed
        async def block_resources(route, request):
            if request.resource_type in ["image", "font", "stylesheet", "media"]:
                await route.abort()
            else:
                await route.continue_()

        await page.route("**/*", block_resources)

        try:
            await page.goto(url, wait_until="domcontentloaded")

            # Wait ONLY for the first product card
            first_card = await page.wait_for_selector(
                "div.SKUDeck___StyledDiv-sc-1e5d9gk-0.bFjDCO",
                timeout=10000
            )

            # Product name
            name_el = await first_card.query_selector("div.break-words.h-10.w-full h3")
            
            # Quantity (2 possible variants as per test script)
            qty_el = await first_card.query_selector("span.Label-sc-15v1nk5-0.jnBJRV.truncate")
            if not qty_el:
                qty_el = await first_card.query_selector("span.Label-sc-15v1nk5-0.sc-ggpjZQ.jnBJRV.kgMUbj")

            # Price
            price_el = await first_card.query_selector("span.Label-sc-15v1nk5-0.sc-iMTnTL.jnBJRV.knDrlZ")

            product_name = await name_el.inner_text() if name_el else "N/A"
            quantity = await qty_el.inner_text() if qty_el else "N/A"
            price = await price_el.inner_text() if price_el else "N/A"
            
            # Clean up strings
            product_name = product_name.strip()
            quantity = quantity.strip()
            price = price.strip()

            # Update MongoDB
            collection = db.get_collection()
            if collection is not None:
                current_time = datetime.utcnow()
                
                # Data to set as "current"
                current_data = {
                    "name": search_query.capitalize(),
                    "quantity": quantity,
                    "price": price,
                    "scraped_at": current_time,
                    "source_url": url,
                    "actual_product_name": product_name
                }
                
                # Data to push to history
                history_entry = {
                    "price": price,
                    "scraped_at": current_time
                }
                
                try:
                    collection.update_one(
                        {"name": search_query.capitalize()},
                        {
                            "$set": current_data,
                            "$push": {"price_history": history_entry}
                        },
                        upsert=True
                    )
                except Exception as db_error:
                    logger.error(f"Database error: {db_error}")

            return {
                "name": product_name,
                "quantity": quantity,
                "price": price,
                "success": True
            }

        except Exception as e:
            logger.warning(f"Scraping failed for {search_query}: {e}")
            return {
                "error": str(e),
                "success": False
            }

    except Exception as e:
        logger.error(f"Playwright error: {e}")
        return {
            "error": f"Critical scraper error: {str(e)}",
            "success": False
        }
        
    finally:
        await browser.close()
        await playwright.stop()
