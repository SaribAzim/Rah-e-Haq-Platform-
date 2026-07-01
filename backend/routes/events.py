from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Event
from schemas import EventCreate, EventResponse
from auth import get_current_admin

router = APIRouter(prefix="/api/events", tags=["Events"])

@router.get("/upcoming", response_model=List[EventResponse])
async def get_upcoming_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Event).where(Event.is_active == True).order_by(Event.event_date.asc())
    )
    return result.scalars().all()

@router.get("/", response_model=List[EventResponse])
async def get_all_events(db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    result = await db.execute(select(Event).order_by(Event.event_date.desc()))
    return result.scalars().all()

@router.post("/", response_model=EventResponse)
async def create_event(event: EventCreate, db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    db_event = Event(
        title=event.title,
        description=event.description,
        event_date=event.event_date,
        location=event.location,
        city=event.city,
        max_volunteers=event.max_volunteers,
    )
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event

@router.put("/{event_id}", response_model=EventResponse)
async def update_event(event_id: int, event: EventCreate, db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    db_event = result.scalar_one_or_none()
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    db_event.title = event.title
    db_event.description = event.description
    db_event.event_date = event.event_date
    db_event.location = event.location
    db_event.city = event.city
    db_event.max_volunteers = event.max_volunteers
    await db.commit()
    await db.refresh(db_event)
    return db_event

@router.put("/{event_id}/join")
async def join_event(event_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    db_event = result.scalar_one_or_none()
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    if db_event.max_volunteers and db_event.current_volunteers >= db_event.max_volunteers:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Event is full")
    db_event.current_volunteers += 1
    await db.commit()
    return {"message": "Joined successfully", "current_volunteers": db_event.current_volunteers}

@router.delete("/{event_id}")
async def delete_event(event_id: int, db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    result = await db.execute(select(Event).where(Event.id == event_id))
    db_event = result.scalar_one_or_none()
    if not db_event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    await db.delete(db_event)
    await db.commit()
    return {"message": "Deleted successfully"}
