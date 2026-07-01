from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from database import get_db
from models import Donation

router = APIRouter(prefix="/api/leaderboard", tags=["Leaderboard"])

@router.get("/")
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    """Return top 20 public donors ranked by total donation amount."""
    result = await db.execute(
        select(Donation).where(
            Donation.is_public == True,
            Donation.is_completed == True
        ).order_by(Donation.amount.desc())
    )
    donations = result.scalars().all()

    # Group by donor_email and aggregate
    donor_map = {}
    for d in donations:
        key = d.donor_email
        if key not in donor_map:
            donor_map[key] = {
                "donor_name": d.donor_name,
                "total_amount": 0.0,
                "currency": d.currency,
                "donor_message": d.donor_message,
                "donation_count": 0,
            }
        donor_map[key]["total_amount"] += d.amount
        donor_map[key]["donation_count"] += 1

    leaderboard = sorted(donor_map.values(), key=lambda x: x["total_amount"], reverse=True)[:20]

    return {"leaderboard": leaderboard, "total_donors": len(leaderboard)}
