import sys
import asyncio
import uvicorn

# Set the event loop policy for Windows specifically for Playwright compatibility
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

if __name__ == "__main__":
    # Run Uvicorn with the app
    # We use "app.main:app" string to enable reload support
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
