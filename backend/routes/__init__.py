from fastapi import APIRouter
from .newsletter import router as newsletter_router
from .contact import router as contact_router
from .volunteer import router as volunteer_router
from .donations import router as donations_router
from .stories import router as stories_router
from .activities import router as activities_router
from .auth import router as auth_router
from .chatbot import router as chatbot_router
from .campaigns import router as campaigns_router
from .events import router as events_router
from .leaderboard import router as leaderboard_router
from .analytics import router as analytics_router
from .notifications import router as notifications_router
