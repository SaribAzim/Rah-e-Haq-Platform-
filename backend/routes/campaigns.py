from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Campaign
from schemas import CampaignCreate, CampaignResponse
from auth import get_current_admin

router = APIRouter(prefix="/api/campaigns", tags=["Campaigns"])

@router.get("/", response_model=List[CampaignResponse])
async def get_active_campaigns(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Campaign).where(Campaign.is_active == True).order_by(Campaign.created_at.desc())
    )
    return result.scalars().all()

@router.get("/all", response_model=List[CampaignResponse])
async def get_all_campaigns(db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    result = await db.execute(select(Campaign).order_by(Campaign.created_at.desc()))
    return result.scalars().all()

@router.post("/", response_model=CampaignResponse)
async def create_campaign(campaign: CampaignCreate, db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    db_campaign = Campaign(
        title=campaign.title,
        description=campaign.description,
        goal_amount=campaign.goal_amount,
        deadline=campaign.deadline,
        image_url=campaign.image_url,
    )
    db.add(db_campaign)
    await db.commit()
    await db.refresh(db_campaign)
    return db_campaign

@router.put("/{campaign_id}", response_model=CampaignResponse)
async def update_campaign(campaign_id: int, campaign: CampaignCreate, db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    result = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    db_campaign = result.scalar_one_or_none()
    if not db_campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    db_campaign.title = campaign.title
    db_campaign.description = campaign.description
    db_campaign.goal_amount = campaign.goal_amount
    db_campaign.deadline = campaign.deadline
    db_campaign.image_url = campaign.image_url
    await db.commit()
    await db.refresh(db_campaign)
    return db_campaign

@router.put("/{campaign_id}/toggle")
async def toggle_campaign(campaign_id: int, db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    result = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    db_campaign = result.scalar_one_or_none()
    if not db_campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    db_campaign.is_active = not db_campaign.is_active
    await db.commit()
    return {"message": f"Campaign {'activated' if db_campaign.is_active else 'deactivated'}", "is_active": db_campaign.is_active}

@router.delete("/{campaign_id}")
async def delete_campaign(campaign_id: int, db: AsyncSession = Depends(get_db), admin=Depends(get_current_admin)):
    result = await db.execute(select(Campaign).where(Campaign.id == campaign_id))
    db_campaign = result.scalar_one_or_none()
    if not db_campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    await db.delete(db_campaign)
    await db.commit()
    return {"message": "Deleted successfully"}
