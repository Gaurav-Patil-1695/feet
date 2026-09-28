from enum import Enum
from typing import List

from fastapi import Depends, HTTPException, status

from backend.app.dependencies import get_current_user


class Role(str, Enum):
    administrator = "administrator"
    manager = "manager"
    technician = "technician"


def require_role(*roles: Role):
    """Dependency factory that restricts access to users with one of the given roles."""
    allowed: List[str] = [r.value for r in roles]

    async def dependency(current_user=Depends(get_current_user)):
        if current_user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )
        return current_user

    return dependency
