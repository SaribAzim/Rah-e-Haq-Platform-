from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models import Donation, Volunteer, Newsletter, Contact, Activity
from auth import get_current_admin
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/overview")
async def get_overview(db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    """Return aggregated KPI stats for the admin dashboard."""
    # Donations
    donations_result = await db.execute(select(Donation))
    donations = donations_result.scalars().all()
    completed = [d for d in donations if d.is_completed]
    total_raised = sum(d.amount for d in completed)

    # Volunteers
    vol_result = await db.execute(select(Volunteer))
    volunteers = vol_result.scalars().all()
    approved_vols = [v for v in volunteers if v.is_approved]

    # Subscribers
    sub_result = await db.execute(select(Newsletter).where(Newsletter.subscribed == True))
    subscribers = sub_result.scalars().all()

    # Contacts (unread)
    contact_result = await db.execute(select(Contact).where(Contact.is_read == False))
    unread_contacts = contact_result.scalars().all()

    # Activities
    activity_result = await db.execute(select(Activity))
    activities = activity_result.scalars().all()

    return {
        "total_donations": len(donations),
        "completed_donations": len(completed),
        "total_raised": round(total_raised, 2),
        "average_donation": round(total_raised / len(completed), 2) if completed else 0,
        "total_volunteers": len(volunteers),
        "approved_volunteers": len(approved_vols),
        "pending_volunteers": len(volunteers) - len(approved_vols),
        "total_subscribers": len(subscribers),
        "unread_messages": len(unread_contacts),
        "total_activities": len(activities),
    }

@router.get("/donations-timeline")
async def get_donations_timeline(db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    """Return daily donation totals for the past 30 days."""
    result = await db.execute(select(Donation).where(Donation.is_completed == True))
    donations = result.scalars().all()

    # Build 30-day buckets
    today = datetime.utcnow().date()
    buckets = {}
    for i in range(29, -1, -1):
        day = today - timedelta(days=i)
        buckets[day.isoformat()] = {"date": day.strftime("%b %d"), "amount": 0, "count": 0}

    for d in donations:
        day_key = d.created_at.date().isoformat()
        if day_key in buckets:
            buckets[day_key]["amount"] += d.amount
            buckets[day_key]["count"] += 1

    return {"timeline": list(buckets.values())}

@router.get("/volunteers-timeline")
async def get_volunteers_timeline(db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    """Return monthly volunteer signups for the past 6 months."""
    result = await db.execute(select(Volunteer))
    volunteers = result.scalars().all()

    today = datetime.utcnow()
    buckets = {}
    for i in range(5, -1, -1):
        month = (today.replace(day=1) - timedelta(days=i * 30))
        key = month.strftime("%Y-%m")
        buckets[key] = {"month": month.strftime("%b %Y"), "count": 0}

    for v in volunteers:
        key = v.created_at.strftime("%Y-%m")
        if key in buckets:
            buckets[key]["count"] += 1

    return {"timeline": list(buckets.values())}
