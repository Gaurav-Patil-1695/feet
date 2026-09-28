"""Structured request/response logging middleware."""

import logging
import time
import uuid
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.types import ASGIApp

logger = logging.getLogger("fleet.access")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware that emits a structured log record for every HTTP request/response.

    Each record contains:
    - ``request_id``  — a per-request UUID (also echoed back as the
      ``X-Request-ID`` response header).
    - ``method``      — HTTP verb.
    - ``path``        — URL path (without query string).
    - ``query``       — raw query string (may be empty).
    - ``status_code`` — HTTP status code of the final response.
    - ``duration_ms`` — wall-clock time in milliseconds.
    - ``client``      — remote IP address.
    - ``user``        — ``sub`` claim from the JWT payload when the
      ``AuthMiddleware`` has already populated ``request.state.user``,
      otherwise ``anonymous``.
    """

    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request_id: str = str(uuid.uuid4())
        start: float = time.perf_counter()

        # Attach the request-id early so downstream handlers can use it.
        request.state.request_id = request_id

        response: Response = await call_next(request)

        duration_ms: float = (time.perf_counter() - start) * 1000

        # Resolve the authenticated user identity (best-effort).
        user: str = "anonymous"
        user_payload = getattr(request.state, "user", None)
        if isinstance(user_payload, dict):
            user = str(user_payload.get("sub", "anonymous"))

        client_host: str = ""
        if request.client:
            client_host = request.client.host

        logger.info(
            "HTTP request",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "query": request.url.query,
                "status_code": response.status_code,
                "duration_ms": round(duration_ms, 3),
                "client": client_host,
                "user": user,
            },
        )

        response.headers["X-Request-ID"] = request_id
        return response
