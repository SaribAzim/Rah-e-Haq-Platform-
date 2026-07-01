from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Contact, Notification
from schemas import ContactCreate, ContactResponse
from auth import get_current_admin
from email_service import send_notification_email
import asyncio

router = APIRouter(prefix="/api/contact", tags=["Contact"])

async def _create_notification(db: AsyncSession, msg: str, related_id: int):
    notif = Notification(type="contact", message=msg, related_id=related_id)
    db.add(notif)
    await db.commit()

@router.post("/", response_model=ContactResponse)
async def submit_contact(
    contact: ContactCreate,
    db: AsyncSession = Depends(get_db)
):
    db_contact = Contact(
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        subject=contact.subject,
        message=contact.message
    )
    db.add(db_contact)
    await db.commit()
    await db.refresh(db_contact)

    # In-app notification
    msg = f"New message from {contact.name}: {contact.subject or 'No subject'}"
    asyncio.create_task(_create_notification(db, msg, db_contact.id))

    # Email notification
    asyncio.create_task(send_notification_email(
        "contact",
        f"New Message from {contact.name}",
        {
            "From": contact.name,
            "Email": contact.email,
            "Phone": contact.phone or "Not provided",
            "Subject": contact.subject or "No subject",
            "Message": contact.message[:200] + ("..." if len(contact.message) > 200 else ""),
        }
    ))

    return db_contact

@router.get("/", response_model=List[ContactResponse])
async def get_all_contacts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Contact).order_by(Contact.created_at.desc()))
    return result.scalars().all()

@router.get("/unread", response_model=List[ContactResponse])
async def get_unread_contacts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Contact).where(Contact.is_read == False).order_by(Contact.created_at.desc())
    )
    return result.scalars().all()

@router.put("/{contact_id}/read")
async def mark_as_read(
    contact_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    contact.is_read = True
    await db.commit()
    return {"message": "Marked as read"}

@router.delete("/{contact_id}")
async def delete_contact(
    contact_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin)
):
    result = await db.execute(select(Contact).where(Contact.id == contact_id))
    contact = result.scalar_one_or_none()
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    await db.delete(contact)
    await db.commit()
    return {"message": "Deleted successfully"}
