from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Activity
from schemas import ActivityCreate, ActivityResponse, ActivityMapResponse
from auth import get_current_admin

router = APIRouter(prefix="/api/activities", tags=["Activities"])

@router.get("/", response_model=List[ActivityResponse])
async def get_all_activities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Activity).order_by(Activity.created_at.desc()))
    return result.scalars().all()

@router.get("/map", response_model=List[ActivityMapResponse])
async def get_map_activities(db: AsyncSession = Depends(get_db)):
    """Returns lightweight activity data for the Impact Map (only records with coordinates)."""
    result = await db.execute(
        select(Activity).where(
            Activity.latitude != None,
            Activity.longitude != None
        ).order_by(Activity.created_at.desc())
    )
    return result.scalars().all()

@router.post("/", response_model=ActivityResponse)
async def create_activity(
    activity: ActivityCreate,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    db_activity = Activity(
        date=activity.date,
        title=activity.title,
        description=activity.description,
        impact=activity.impact,
        city=activity.city,
        latitude=activity.latitude,
        longitude=activity.longitude,
        people_helped=activity.people_helped,
    )
    db.add(db_activity)
    await db.commit()
    await db.refresh(db_activity)
    return db_activity

@router.put("/{activity_id}", response_model=ActivityResponse)
async def update_activity(
    activity_id: int,
    activity: ActivityCreate,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = await db.execute(select(Activity).where(Activity.id == activity_id))
    db_activity = result.scalar_one_or_none()
    if not db_activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    db_activity.date = activity.date
    db_activity.title = activity.title
    db_activity.description = activity.description
    db_activity.impact = activity.impact
    db_activity.city = activity.city
    db_activity.latitude = activity.latitude
    db_activity.longitude = activity.longitude
    db_activity.people_helped = activity.people_helped

    await db.commit()
    await db.refresh(db_activity)
    return db_activity

@router.delete("/{activity_id}")
async def delete_activity(
    activity_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = await db.execute(select(Activity).where(Activity.id == activity_id))
    activity = result.scalar_one_or_none()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    await db.delete(activity)
    await db.commit()
    return {"message": "Deleted successfully"}
