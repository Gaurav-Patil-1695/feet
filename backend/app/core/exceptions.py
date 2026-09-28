from typing import Any, Dict, Optional

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from jose import JWTError


# ---------------------------------------------------------------------------
# Domain exception hierarchy
# ---------------------------------------------------------------------------


class AppException(Exception):
    """Base class for all application-level exceptions."""

    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail: str = "An unexpected error occurred."

    def __init__(self, detail: Optional[str] = None, extra: Optional[Dict[str, Any]] = None):
        self.detail = detail or self.default_detail
        self.extra = extra or {}
        super().__init__(self.detail)


class NotFoundException(AppException):
    """Raised when a requested resource does not exist."""

    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "The requested resource was not found."


class ConflictException(AppException):
    """Raised when an operation conflicts with the current state (e.g. duplicate)."""

    status_code = status.HTTP_409_CONFLICT
    default_detail = "A conflict occurred with the current state of the resource."


class UnauthorizedException(AppException):
    """Raised when authentication credentials are missing or invalid."""

    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "Authentication credentials are missing or invalid."


class ForbiddenException(AppException):
    """Raised when the authenticated user lacks permission for the action."""

    status_code = status.HTTP_403_FORBIDDEN
    default_detail = "You do not have permission to perform this action."


class ValidationException(AppException):
    """Raised when business-logic validation fails (distinct from request schema errors)."""

    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    default_detail = "Validation failed."


class BadRequestException(AppException):
    """Raised when the request is malformed or contains invalid parameters."""

    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Bad request."


# ---------------------------------------------------------------------------
# Helper to build a uniform error response body
# ---------------------------------------------------------------------------


def _error_body(detail: str, extra: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    body: Dict[str, Any] = {"detail": detail}
    if extra:
        body.update(extra)
    return body


# ---------------------------------------------------------------------------
# Global exception handlers — register via register_exception_handlers(app)
# ---------------------------------------------------------------------------


async def _app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=_error_body(exc.detail, exc.extra if exc.extra else None),
    )


async def _request_validation_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )


async def _jwt_error_handler(request: Request, exc: JWTError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content=_error_body("Could not validate credentials."),
        headers={"WWW-Authenticate": "Bearer"},
    )


async def _unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=_error_body("An unexpected error occurred."),
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Attach all global exception handlers to the FastAPI application instance."""
    app.add_exception_handler(AppException, _app_exception_handler)  # type: ignore[arg-type]
    app.add_exception_handler(RequestValidationError, _request_validation_handler)  # type: ignore[arg-type]
    app.add_exception_handler(JWTError, _jwt_error_handler)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, _unhandled_exception_handler)  # type: ignore[arg-type]
