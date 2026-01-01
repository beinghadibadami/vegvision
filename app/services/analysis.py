import json
from groq import Groq
from fastapi import HTTPException
from app.core.config import settings
from app.services.price import get_product_price
from app.utils.image import encode_image

async def analyze_image(image_data, force_refresh=False):
    """Analyze image using Groq API and fetch price data"""
    base64_img = encode_image(image_data)
    
    if not settings.GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY environment variable not set")
    
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    try:
        # Create the completion request
        prompt = """You are a fruit and vegetable expert. Your task is to analyze the provided image and respond with key quality information, actionable advice, and nutritional data.

### Evaluation Criteria:

1. **Name**
   Identify the name of the fruit or vegetable.

2. **Insight (Appearance, Texture, Color)**
   Provide a combined natural-language analysis of the appearance, texture, and color in one paragraph.

3. **Quality Score (%)**
   Assign a quality score (0–100%).

4. **Moisture Content (%)**
   Estimate moisture content (0–100%).

5. **Size**
   Categorize size as `small`, `medium`, or `big`.

6. **Shelf Life & Storage** ("Eat Me When")
   - `shelf_life_days`: Estimated days remaining before spoilage (e.g., "2-3 days", "Immediate").
   - `shelf_life_stage`: One of [`Ripening`, `Ripe`, `Peak Fresh`, `Overripe`].
   - `storage_tips`: Specific advice to extend freshness based on its current state (e.g., "Store in fridge to slow ripening").

7. **Nutritional Macros** (Macro Scanner)
   Estimate nutritional values for this **specific** identified item and size (per 100g approx, but scaled if size suggests).
   - `calories` (kcal)
   - `carbs` (g)
   - `protein` (g)
   - `fat` (g)
   - `fiber` (g)
   - `vitamins`: List of top 3-4 vitamins/minerals (e.g., ["Vitamin C", "Potassium"]).

8. **Context-Aware Recipes**
   Suggest 3 recipes **based on the specific quality**.
   - If fresh: Salads, raw usage.
   - If overripe: Baking, smoothies, cooked dishes.
   - Return a list of objects: `{"name": "...", "reason": "...", "time": "...", "difficulty": "Easy/Medium/Hard"}`.
   - `reason` should explain why *this* recipe is good for *this* fruit's condition.

---

### Output Format:
Respond with **strict JSON format only**.

```json
{
  "name": "Banana",
  "quality": 85,
  "moisture": 70,
  "size": "medium",
  "insight": "The banana is bright yellow with a few small brown spots, indicating it is perfectly ripe and sweet.",
  "shelf_life": {
    "days": "2-3 days",
    "stage": "Peak Fresh",
    "storage_tips": "Store at room temperature. To slow down further ripening, you can refrigerate it, though the skin may darken."
  },
  "macros": {
    "calories": 105,
    "carbs": 27,
    "protein": 1.3,
    "fat": 0.3,
    "fiber": 3.1,
    "vitamins": ["Vitamin B6", "Vitamin C", "Potassium"]
  },
  "recipes": [
    {
      "name": "Classic Fruit Salad",
      "reason": "The banana is at peak firmness, making it perfect for slicing without getting mushy.",
      "time": "10 mins",
      "difficulty": "Easy"
    },
    ... (total 3)
  ],
  "price": "...",
  "quantity": "..."
}
```

If the image is not a fruit/veg, return `{"error": "..."}`.
"""

        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                "role": "system",
                "content": prompt
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": ""
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_img}"
                            }
                        }
                    ]
                }
            ],
            temperature=0.6,
            max_completion_tokens=1024,
            top_p=0.8,
            stream=False,
            response_format={"type": "json_object"},
            stop=None,
        )
        
        # Parse the analysis result
        analysis_result = json.loads(completion.choices[0].message.content)
        
        # Fetch price information if it's a fruit or vegetable
        if "name" in analysis_result and analysis_result["name"] not in ["not a fruit or vegetable", "unknown"]:
            price_info = await get_product_price(analysis_result["name"], force_refresh)
            analysis_result.update(price_info)
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
