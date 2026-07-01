from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import timedelta
from database import get_db
from models import Admin
from schemas import AdminLogin, Token
from auth import verify_password, get_password_hash, create_access_token, get_current_admin
from config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
async def login(
    credentials: AdminLogin,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Admin).where(Admin.email == credentials.email))
    admin = result.scalar_one_or_none()

    if not admin or not verify_password(credentials.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_current_user(
    admin: Admin = Depends(get_current_admin)
):
    return {
        "id": admin.id,
        "email": admin.email,
        "name": admin.name,
        "is_superadmin": admin.is_superadmin
    }

@router.post("/logout")
async def logout():
    # With JWT, logout is handled client-side by removing the token
    return {"message": "Successfully logged out"}
