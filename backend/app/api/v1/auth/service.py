from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt
from fastapi import HTTPException, status

from backend.app.api.v1.auth.schemas import TokenResponse, UserResponse
from backend.app.config import settings


class AuthService:
    def __init__(self, user_repository) -> None:
        self.user_repository = user_repository

    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )

    def _hash_password(self, password: str) -> str:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

    def _create_access_token(
        self,
        subject: str,
        extra_claims: dict | None = None,
        expires_delta: timedelta | None = None,
    ) -> str:
        expire = datetime.now(timezone.utc) + (
            expires_delta
            if expires_delta is not None
            else timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        payload = {"sub": subject, "exp": expire}
        if extra_claims:
            payload.update(extra_claims)
        return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    def decode_access_token(self, token: str) -> dict:
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

    async def login(self, username: str, password: str) -> TokenResponse:
        user = await self.user_repository.get_by_username(username)
        if user is None or not self._verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token = self._create_access_token(
            subject=str(user.id),
            extra_claims={"username": user.username, "role": user.role},
        )
        return TokenResponse(access_token=access_token, token_type="bearer")

    async def logout(self, user_id: int) -> None:
        # Stateless JWT: no server-side token invalidation required.
        # If a token blacklist is introduced, add it here.
        pass

    async def get_current_user(self, token: str) -> UserResponse:
        payload = self.decode_access_token(token)
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = await self.user_repository.get_by_id(int(user_id))
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return UserResponse(
            id=user.id,
            username=user.username,
            email=getattr(user, "email", None),
            full_name=getattr(user, "full_name", None),
            role=getattr(user, "role", None),
        )
