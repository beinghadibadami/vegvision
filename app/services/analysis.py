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
        prompt = "You are a fruit and vegetable expert. Your task is to analyze the provided image and respond with key quality information.\\n\\n### Evaluation Criteria:\\n\\n1. **Name**  \\n   Identify the name of the fruit or vegetable in the image.\\n\\n2. **Insight (Appearance, Texture, Color)**  \\n   Provide a combined natural-language analysis of the appearance, texture, and color. This should describe quality indicators like ripeness, defects, firmness, and color uniformity — **all combined in one paragraph under the field `insight`**.\\n\\n3. **Quality Score (%)**  \\n   Assign a quality score in percentage (0–100%) based on the combined analysis.\\n\\n4. **Moisture Content (%)**  \\n   Estimate the moisture content in percentage (0–100%) based on visual signs (color and texture).\\n\\n5. **Size**  \\n   Categorize the size as `small`, `medium`, or `big`.\\n\\n6. **Price and Quantity**  \\n   If known, include estimated market `price` (in ₹) and `quantity` (like '500 g', '1 kg').\\n\\n---\\n\\n### Output Format:\\n- Always respond with **strict JSON format only**.\\n- Do **not** include appearance, texture, or color as separate fields. They must be described **only inside `insight`**.\\n- If the image does not contain a fruit or vegetable, return:\\n```json\\n{\\n  \"error\": \"The image does not contain a fruit or vegetable.\"\\n}\\n```\\n\\n---\\n\\n### Example Output:\\n```json\\n{\\n  \"name\": \"Tomato\",\\n  \"quality\": 92,\\n  \"moisture\": 85,\\n  \"size\": \"medium\",\\n  \"insight\": \"This tomato is vibrant red, smooth, and plump with no visible blemishes, indicating ripeness and freshness. The color is uniform, and the texture appears firm, suggesting excellent quality.\",\\n  \"price\": \"₹80\",\\n  \"quantity\": \"500 g\"\\n}\\n```\n"

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
            analysis_result["price"] = price_info["price"]
            analysis_result["quantity"] = price_info["quantity"]
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
