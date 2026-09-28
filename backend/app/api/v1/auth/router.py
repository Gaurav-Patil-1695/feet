from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm

from backend.app.api.v1.auth.schemas import TokenResponse, UserResponse
from backend.app.api.v1.auth.service import AuthService
from backend.app.dependencies import get_auth_service, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    token = await auth_service.login(form_data.username, form_data.password)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    current_user: UserResponse = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service),
) -> Response:
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    await auth_service.logout(current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
async def get_me(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return current_user
