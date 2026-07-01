from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from database import get_db
from models import Donation, Notification, Campaign
from schemas import DonationCreate, DonationResponse
from auth import get_current_admin
from email_service import send_notification_email
import asyncio
import uuid
import os
import shutil

router = APIRouter(prefix="/api/donations", tags=["Donations"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def _create_notification(db: AsyncSession, msg: str, related_id: int):
    notif = Notification(type="donation", message=msg, related_id=related_id)
    db.add(notif)
    await db.commit()

# ─── Submit donation with screenshot (multipart) ────────────────────────────
@router.post("/submit", response_model=DonationResponse)
async def submit_donation(
    donor_name: str = Form(...),
    donor_email: str = Form(...),
    amount: float = Form(...),
    payment_method: str = Form("Bank Transfer"),
    donor_message: Optional[str] = Form(None),
    is_public: bool = Form(False),
    screenshot: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
):
    screenshot_url = None
    if screenshot and screenshot.filename:
        ext = os.path.splitext(screenshot.filename)[-1].lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
            raise HTTPException(status_code=400, detail="Only image files are allowed")
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(screenshot.file, f)
        screenshot_url = filename

    db_donation = Donation(
        donor_name=donor_name,
        donor_email=donor_email,
        amount=amount,
        currency="PKR",
        payment_method=payment_method,
        is_public=is_public,
        donor_message=donor_message,
        screenshot_url=screenshot_url,
    )
    db.add(db_donation)
    await db.commit()
    await db.refresh(db_donation)

    msg = f"New donation of PKR {amount:,.0f} from {donor_name}"
    asyncio.create_task(_create_notification(db, msg, db_donation.id))

    asyncio.create_task(send_notification_email(
        "donation",
        f"New Donation — PKR {amount:,.0f}",
        {
            "Donor": donor_name,
            "Email": donor_email,
            "Amount": f"PKR {amount:,.2f}",
            "Method": payment_method,
        }
    ))

    return db_donation

# ─── Create donation (JSON, legacy) ─────────────────────────────────────────
@router.post("/", response_model=DonationResponse)
async def create_donation(
    donation: DonationCreate,
    db: AsyncSession = Depends(get_db)
):
    db_donation = Donation(
        donor_name=donation.donor_name,
        donor_email=donation.donor_email,
        amount=donation.amount,
        currency=donation.currency,
        payment_method=donation.payment_method,
        is_public=donation.is_public,
        donor_message=donation.donor_message,
        campaign_id=donation.campaign_id,
    )
    db.add(db_donation)
    await db.commit()
    await db.refresh(db_donation)

    if donation.campaign_id:
        result = await db.execute(select(Campaign).where(Campaign.id == donation.campaign_id))
        campaign = result.scalar_one_or_none()
        if campaign:
            campaign.current_amount = (campaign.current_amount or 0) + donation.amount
            await db.commit()

    msg = f"New donation of {donation.currency} {donation.amount:,.0f} from {donation.donor_name}"
    asyncio.create_task(_create_notification(db, msg, db_donation.id))

    asyncio.create_task(send_notification_email(
        "donation",
        f"New Donation — {donation.currency} {donation.amount:,.0f}",
        {
            "Donor": donation.donor_name,
            "Email": donation.donor_email,
            "Amount": f"{donation.currency} {donation.amount:,.2f}",
            "Method": donation.payment_method or "Not specified",
        }
    ))

    return db_donation

# ─── Get all donations ────────────────────────────────────────────────────────
@router.get("/", response_model=List[DonationResponse])
async def get_all_donations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Donation).order_by(Donation.created_at.desc()))
    return result.scalars().all()

# ─── Donation stats ───────────────────────────────────────────────────────────
@router.get("/stats")
async def get_donation_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Donation))
    donations = result.scalars().all()
    total_amount = sum(d.amount for d in donations)
    donation_count = len(donations)
    verified_count = sum(1 for d in donations if d.is_completed)
    return {
        "total_donations": donation_count,
        "total_amount": total_amount,
        "verified_donations": verified_count,
        "average_donation": total_amount / donation_count if donation_count > 0 else 0
    }

# ─── Mark donation as verified ────────────────────────────────────────────────
@router.put("/{donation_id}/complete")
async def complete_donation(
    donation_id: int,
    transaction_id: str = None,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = await db.execute(select(Donation).where(Donation.id == donation_id))
    donation = result.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")
    donation.is_completed = True
    if transaction_id:
        donation.transaction_id = transaction_id
    await db.commit()
    return {"message": "Donation marked as verified"}

# ─── Delete donation ──────────────────────────────────────────────────────────
@router.delete("/{donation_id}")
async def delete_donation(
    donation_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = await db.execute(select(Donation).where(Donation.id == donation_id))
    donation = result.scalar_one_or_none()
    if not donation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Donation not found")
    # Delete screenshot file if it exists
    if donation.screenshot_url:
        filepath = os.path.join(UPLOAD_DIR, donation.screenshot_url)
        if os.path.exists(filepath):
            os.remove(filepath)
    await db.delete(donation)
    await db.commit()
    return {"message": "Deleted successfully"}
