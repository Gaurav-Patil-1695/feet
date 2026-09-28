"""Authentication middleware for JWT extraction and user injection into request state."""

from typing import Optional

from fastapi import Request, Response
from jose import JWTError
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import JSONResponse

from backend.app.core.security import decode_access_token


PUBLIC_PATHS = {
    "/api/v1/auth/login",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/health",
}


class AuthMiddleware(BaseHTTPMiddleware):
    """Middleware that extracts a JWT from the Authorization header and injects
    the decoded user payload into ``request.state.user``.

    Requests to public paths bypass token verification.  All other requests
    that are missing a valid Bearer token receive a 401 response.
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        path: str = request.url.path

        # Allow public paths through without authentication.
        if self._is_public(path):
            request.state.user = None
            return await call_next(request)

        token: Optional[str] = self._extract_token(request)
        if token is None:
            return JSONResponse(
                status_code=401,
                content={"detail": "Not authenticated"},
            )

        try:
            payload = decode_access_token(token)
        except JWTError:
            return JSONResponse(
                status_code=401,
                content={"detail": "Could not validate credentials"},
            )

        if payload is None:
            return JSONResponse(
                status_code=401,
                content={"detail": "Could not validate credentials"},
            )

        # Inject the decoded token payload so downstream handlers can use it.
        request.state.user = payload
        return await call_next(request)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _is_public(path: str) -> bool:
        """Return True when *path* does not require authentication."""
        if path in PUBLIC_PATHS:
            return True
        # Allow sub-paths of docs / openapi.
        for public in PUBLIC_PATHS:
            if path.startswith(public + "/"):
                return True
        return False

    @staticmethod
    def _extract_token(request: Request) -> Optional[str]:
        """Return the raw JWT string from the ``Authorization: Bearer <token>``
        header, or *None* when the header is absent or malformed.
        """
        authorization: Optional[str] = request.headers.get("Authorization")
        if not authorization:
            return None
        parts = authorization.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return None
        return parts[1]
