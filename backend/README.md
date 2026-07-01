# Rah-E-Haq Backend API

FastAPI backend for the Rah-E-Haq NGO website.

## Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed database and create admin
python seed.py

# Run server
uvicorn main:app --reload
```

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | API health status |
| POST | `/api/newsletter/` | Subscribe to newsletter |
| POST | `/api/contact/` | Submit contact form |
| POST | `/api/volunteer/` | Apply as volunteer |
| POST | `/api/donations/` | Log donation intention |
| GET | `/api/stories/` | Get active testimonials |
| GET | `/api/activities/` | Get recent activities |

### Protected Endpoints (Require Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/newsletter/` | Get all subscribers |
| GET | `/api/contact/` | Get all contacts |
| GET | `/api/volunteer/pending` | Get pending volunteers |
| GET | `/api/donations/stats` | Get donation statistics |
| POST | `/api/stories/` | Create testimonial |
| POST | `/api/activities/` | Create activity |

## Authentication

Login to get JWT token:
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@rahehaq.org", "password": "Rahehaq387NGO"}'
```

Use token in requests:
```bash
curl http://localhost:8000/api/contact/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Admin
- **Email:** admin@rahehaq.org
- **Password:** Rahehaq387NGO

## Documentation

Visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## Tech Stack
- FastAPI
- SQLAlchemy (async)
- SQLite
- JWT Auth
- Pydantic
