from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# ============ Newsletter ============
class NewsletterCreate(BaseModel):
    email: EmailStr

class NewsletterResponse(BaseModel):
    id: int
    email: str
    subscribed: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ============ Contact ============
class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: str = Field(..., min_length=1)

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    subject: Optional[str]
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ============ Volunteer ============
class VolunteerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=50)
    city: Optional[str] = None
    skills: Optional[str] = None
    skills_list: Optional[List[str]] = None  # Extended field
    availability: Optional[str] = None
    motivation: Optional[str] = None
    event_interest: Optional[str] = None  # Extended field

class VolunteerResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    city: Optional[str]
    skills: Optional[str]
    availability: Optional[str]
    motivation: Optional[str]
    event_interest: Optional[str]
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ============ Donation ============
class DonationCreate(BaseModel):
    donor_name: str = Field(..., min_length=1, max_length=255)
    donor_email: EmailStr
    amount: float = Field(..., gt=0)
    currency: str = "PKR"
    payment_method: Optional[str] = None
    is_public: bool = False
    donor_message: Optional[str] = None
    campaign_id: Optional[int] = None

class DonationResponse(BaseModel):
    id: int
    donor_name: str
    donor_email: str
    amount: float
    currency: str
    payment_method: Optional[str]
    transaction_id: Optional[str]
    is_completed: bool
    is_public: bool
    donor_message: Optional[str]
    campaign_id: Optional[int]
    screenshot_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# ============ Story ============
class StoryCreate(BaseModel):
    name: str
    role: str
    image: Optional[str] = None
    story: str
    rating: int = 5
    location: Optional[str] = None

class StoryResponse(BaseModel):
    id: int
    name: str
    role: str
    image: Optional[str]
    story: str
    rating: int
    location: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ============ Activity ============
class ActivityCreate(BaseModel):
    date: str
    title: str
    description: str
    impact: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    people_helped: Optional[int] = None

class ActivityResponse(BaseModel):
    id: int
    date: str
    title: str
    description: str
    impact: Optional[str]
    city: Optional[str]
    people_helped: Optional[int]
    latitude: Optional[float]
    longitude: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True

class ActivityMapResponse(BaseModel):
    id: int
    title: str
    date: str
    city: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    people_helped: Optional[int]

    class Config:
        from_attributes = True

# ============ Auth ============
class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

# ============ Campaign ============
class CampaignCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: str
    goal_amount: float = Field(..., gt=0)
    deadline: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool = True

class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    goal_amount: Optional[float] = None
    current_amount: Optional[float] = None
    deadline: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class CampaignResponse(BaseModel):
    id: int
    title: str
    description: str
    goal_amount: float
    current_amount: float
    deadline: Optional[str]
    image_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ============ Event ============
class EventCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: str
    event_date: str
    location: Optional[str] = None
    city: Optional[str] = None
    max_volunteers: Optional[int] = None
    is_active: bool = True

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    max_volunteers: Optional[int] = None
    is_active: Optional[bool] = None

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    event_date: str
    location: Optional[str]
    city: Optional[str]
    max_volunteers: Optional[int]
    current_volunteers: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# ============ Notification ============
class NotificationResponse(BaseModel):
    id: int
    type: str
    message: str
    is_read: bool
    related_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

# ============ Leaderboard ============
class LeaderboardEntry(BaseModel):
    donor_name: str
    donor_email: str
    total_amount: float
    currency: str
    donor_message: Optional[str]
    rank: int
