# Rate Limiting Middleware using SlowAPI
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

# Allow 100 requests per minute per IP by default; can be overridden per route.
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        # The limiter works as a dependency; we just forward the request.
        response = await call_next(request)
        return response

# Dependency to use in routers
rate_limit = limiter.limit
