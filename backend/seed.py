# Scripts to initialize admin and seed data
import asyncio
from database import async_session_maker, create_tables
from models import Admin, Story, Activity
from auth import get_password_hash

async def seed_data():
    import sys
    sys.stdout.reconfigure(encoding='utf-8')
    await create_tables()

    async with async_session_maker() as session:
        # Create default admin
        admin = Admin(
            email="admin@rahehaq.org",
            password_hash=get_password_hash("Rahehaq387NGO"),
            name="Admin",
            is_superadmin=True
        )
        session.add(admin)

        # Seed stories
        stories = [
            Story(
                name="Amina Khan",
                role="Beneficiary",
                image="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
                story="Rah-E-Haq changed my life. Through their food distribution program, my family no longer worries about where our next meal will come from. The volunteers treated us with such dignity and respect.",
                rating=5,
                location="Karachi, Pakistan"
            ),
            Story(
                name="Muhammad Ali",
                role="Volunteer",
                image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                story="Volunteering with Rah-E-Haq has been the most rewarding experience of my life. Seeing the joy on people's faces when we deliver aid is priceless.",
                rating=5,
                location="Lahore, Pakistan"
            ),
            Story(
                name="Fatima Bibi",
                role="Parent",
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
                story="Thanks to their educational support program, my children now have textbooks, uniforms, and the encouragement they need to succeed in school.",
                rating=5,
                location="Islamabad, Pakistan"
            ),
        ]
        for story in stories:
            session.add(story)

        # Seed activities
        activities = [
            Activity(
                date="June 2024",
                title="Ramadan Food Drive",
                description="Distributed 500 food packages to families in need",
                impact="500 families"
            ),
            Activity(
                date="May 2024",
                title="School Supply Distribution",
                description="Provided educational materials to 200 students",
                impact="200 students"
            ),
            Activity(
                date="April 2024",
                title="Community Health Camp",
                description="Free medical checkups for 300 community members",
                impact="300 patients"
            ),
            Activity(
                date="March 2024",
                title="Eid Gift Program",
                description="Distributed gifts and clothes to underprivileged children",
                impact="150 children"
            ),
        ]
        for activity in activities:
            session.add(activity)

        await session.commit()
        print("[OK] Seed data created!")
        print("[INFO] Admin: admin@rahehaq.org")
        print("[INFO] Password: Rahehaq387NGO")

if __name__ == "__main__":
    asyncio.run(seed_data())
