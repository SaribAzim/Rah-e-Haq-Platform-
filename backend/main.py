from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from database import create_tables
from config import settings
import os
from routes import (
    newsletter_router,
    contact_router,
    volunteer_router,
    donations_router,
    stories_router,
    activities_router,
    auth_router,
    chatbot_router,
    campaigns_router,
    events_router,
    leaderboard_router,
    analytics_router,
    notifications_router,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    await create_tables()
    print("[OK] Database tables created!")
    yield
    print("[INFO] Shutting down...")

app = FastAPI(
    title="Rah-E-Haq API",
    description="Backend API for Rah-E-Haq NGO Website",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Core routers
app.include_router(newsletter_router)
app.include_router(contact_router)
app.include_router(volunteer_router)
app.include_router(donations_router)
app.include_router(stories_router)
app.include_router(activities_router)
app.include_router(auth_router)
app.include_router(chatbot_router)

# New feature routers
app.include_router(campaigns_router)
app.include_router(events_router)
app.include_router(leaderboard_router)
app.include_router(analytics_router)
app.include_router(notifications_router)

# Serve uploaded screenshots
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Rah-E-Haq API",
        "version": "2.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
