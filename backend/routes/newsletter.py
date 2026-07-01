from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import Newsletter
from schemas import NewsletterCreate, NewsletterResponse

router = APIRouter(prefix="/api/newsletter", tags=["Newsletter"])

@router.post("/", response_model=NewsletterResponse)
async def subscribe_newsletter(
    newsletter: NewsletterCreate,
    db: AsyncSession = Depends(get_db)
):
    # Check if email already exists
    result = await db.execute(select(Newsletter).where(Newsletter.email == newsletter.email))
    existing = result.scalar_one_or_none()

    if existing:
        if existing.subscribed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already subscribed"
            )
        # Reactivate subscription
        existing.subscribed = True
        await db.commit()
        return existing

    # Create new subscription
    db_newsletter = Newsletter(email=newsletter.email)
    db.add(db_newsletter)
    await db.commit()
    await db.refresh(db_newsletter)
    return db_newsletter

@router.get("/", response_model=list[NewsletterResponse])
async def get_all_subscribers(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Newsletter).order_by(Newsletter.created_at.desc()))
    return result.scalars().all()

@router.delete("/{email}")
async def unsubscribe_newsletter(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Newsletter).where(Newsletter.email == email))
    newsletter = result.scalar_one_or_none()

    if not newsletter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found"
        )

    newsletter.subscribed = False
    await db.commit()
    return {"message": "Unsubscribed successfully"}

# Get subscriber count
@router.get("/stats/count")
async def get_subscriber_count(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Newsletter).where(Newsletter.subscribed == True)
    )
    count = len(result.scalars().all())
    return {"count": count}
