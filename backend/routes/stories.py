from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Story
from schemas import StoryCreate, StoryResponse
from auth import get_current_admin

router = APIRouter(prefix="/api/stories", tags=["Stories"])

@router.get("/", response_model=List[StoryResponse])
async def get_active_stories(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Story).where(Story.is_active == True).order_by(Story.created_at.desc())
    )
    return result.scalars().all()

@router.get("/all", response_model=List[StoryResponse])
async def get_all_stories(
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    result = await db.execute(select(Story).order_by(Story.created_at.desc()))
    return result.scalars().all()

@router.post("/", response_model=StoryResponse)
async def create_story(
    story: StoryCreate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    db_story = Story(
        name=story.name,
        role=story.role,
        image=story.image,
        story=story.story,
        rating=story.rating,
        location=story.location
    )
    db.add(db_story)
    await db.commit()
    await db.refresh(db_story)
    return db_story

@router.put("/{story_id}", response_model=StoryResponse)
async def update_story(
    story_id: int,
    story: StoryCreate,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    result = await db.execute(select(Story).where(Story.id == story_id))
    db_story = result.scalar_one_or_none()

    if not db_story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )

    db_story.name = story.name
    db_story.role = story.role
    db_story.image = story.image
    db_story.story = story.story
    db_story.rating = story.rating
    db_story.location = story.location

    await db.commit()
    await db.refresh(db_story)
    return db_story

@router.delete("/{story_id}")
async def delete_story(
    story_id: int,
    db: AsyncSession = Depends(get_db),
    admin = Depends(get_current_admin)
):
    result = await db.execute(select(Story).where(Story.id == story_id))
    story = result.scalar_one_or_none()

    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )

    await db.delete(story)
    await db.commit()
    return {"message": "Deleted successfully"}
