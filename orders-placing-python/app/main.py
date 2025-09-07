from dotenv import load_dotenv
import os

#Loading ENV file
load_dotenv()


from fastapi import FastAPI
from routes import placeOrders
from middlewares.authMiddleware import AuthMiddleware

app = FastAPI()


# Adding the middleware
app.add_middleware(AuthMiddleware)

@app.get("/test")
async def test():
    return {"message": "middleware test"}

#Rest of the routes.
app.include_router(placeOrders.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8083, reload=True)
