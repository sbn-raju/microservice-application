from fastapi import FastAPI, Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import os
import jwt

ALGORITHM = "HS256"

app = FastAPI()

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        JWT_SECRET = os.getenv('ACCESS_TOKEN')
        print("Cookies:", request.cookies)
        print("JWT_SECRET:", JWT_SECRET)

        token = request.cookies.get("accessToken")
        print("Token from cookie:", token)

        if not token:
            return JSONResponse(status_code=401, content={"message": "Missing auth token"})

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
            print("Payload:", payload)
            request.state.user = payload
        except jwt.ExpiredSignatureError:
            print("Token expired")
            return JSONResponse(status_code=401, content={"message": "Token expired"})
        except jwt.InvalidTokenError as e:
            print("Invalid token:", e)
            return JSONResponse(status_code=401, content={"message": "Invalid token"})
        except Exception as e:
            print("Unexpected JWT error:", e)
            return JSONResponse(status_code=500, content={"message": "Internal Server Error"})

        response = await call_next(request)
        return response

app.add_middleware(AuthMiddleware)