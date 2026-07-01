from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Volunteer, Notification
from schemas import VolunteerCreate, VolunteerResponse
from auth import get_current_admin
from email_service import send_notification_email
import asyncio
import json

router = APIRouter(prefix="/api/volunteer", tags=["Volunteer"])

async def _create_notification(db: AsyncSession, msg: str, related_id: int):
    notif = Notification(type="volunteer", message=msg, related_id=related_id)
    db.add(notif)
    await db.commit()

@router.post("/", response_model=VolunteerResponse)
async def apply_volunteer(
    volunteer: VolunteerCreate,
    db: AsyncSession = Depends(get_db)
):
    # Merge skills_list into skills string if provided
    skills_str = volunteer.skills
    if volunteer.skills_list:
        skills_str = ", ".join(volunteer.skills_list)

    db_volunteer = Volunteer(
        name=volunteer.name,
        email=volunteer.email,
        phone=volunteer.phone,
        city=volunteer.city,
        skills=skills_str,
        availability=volunteer.availability,
        motivation=volunteer.motivation,
        event_interest=volunteer.event_interest,
    )
    db.add(db_volunteer)
    await db.commit()
    await db.refresh(db_volunteer)

    # In-app notification
    msg = f"New volunteer application from {volunteer.name} ({volunteer.city or 'Unknown city'})"
    asyncio.create_task(_create_notification(db, msg, db_volunteer.id))

    # Email notification
    asyncio.create_task(send_notification_email(
        "volunteer",
        f"New Volunteer — {volunteer.name}",
        {
            "Name": volunteer.name,
            "Email": volunteer.email,
            "City": volunteer.city or "Not specified",
            "Skills": skills_str or "Not specified",
            "Event Interest": volunteer.event_interest or "Not specified",
        }
    ))

    return db_volunteer

@router.get("/", response_model=List[VolunteerResponse])
async def get_all_volunteers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Volunteer).order_by(Volunteer.created_at.desc()))
    return result.scalars().all()

@router.get("/pending", response_model=List[VolunteerResponse])
async def get_pending_volunteers(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = await db.execute(
        select(Volunteer).where(Volunteer.is_approved == False).order_by(Volunteer.created_at.desc())
    )
    return result.scalars().all()

@router.get("/approved", response_model=List[VolunteerResponse])
async def get_approved_volunteers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Volunteer).where(Volunteer.is_approved == True).order_by(Volunteer.created_at.desc())
    )
    return result.scalars().all()

@router.put("/{volunteer_id}/approve")
async def approve_volunteer(
    volunteer_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = await db.execute(select(Volunteer).where(Volunteer.id == volunteer_id))
    volunteer = result.scalar_one_or_none()
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer not found")
    volunteer.is_approved = True
    await db.commit()
    return {"message": "Volunteer approved"}

@router.delete("/{volunteer_id}")
async def delete_volunteer(
    volunteer_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = await db.execute(select(Volunteer).where(Volunteer.id == volunteer_id))
    volunteer = result.scalar_one_or_none()
    if not volunteer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Volunteer not found")
    await db.delete(volunteer)
    await db.commit()
    return {"message": "Deleted successfully"}
