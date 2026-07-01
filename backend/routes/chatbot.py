from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import time
import logging
from groq import Groq
from config import settings
from knowledge_base import SYSTEM_PROMPT

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chatbot"])

# ── Simple in-memory rate limiter ─────────────────────────────────────────────
_rate_limit_store: dict[str, list[float]] = {}
RATE_LIMIT_REQUESTS = 15   # requests per window
RATE_LIMIT_WINDOW   = 60   # seconds

def _check_rate_limit(ip: str) -> bool:
    """Returns True if request is allowed, False if rate-limited."""
    now = time.time()
    timestamps = _rate_limit_store.get(ip, [])
    # Remove old timestamps outside the window
    timestamps = [t for t in timestamps if now - t < RATE_LIMIT_WINDOW]
    if len(timestamps) >= RATE_LIMIT_REQUESTS:
        _rate_limit_store[ip] = timestamps
        return False
    timestamps.append(now)
    _rate_limit_store[ip] = timestamps
    return True

# ── Schemas ───────────────────────────────────────────────────────────────────
class ChatMessage(BaseModel):
    role: str   # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    language: Optional[str] = "en"   # "en" or "ur"

class ChatResponse(BaseModel):
    reply: str
    language: str

# ── Groq Client ───────────────────────────────────────────────────────────────
def get_groq_client() -> Groq:
    if not settings.GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured.")
    return Groq(api_key=settings.GROQ_API_KEY)

# ── Endpoint ──────────────────────────────────────────────────────────────────
@router.post("/", response_model=ChatResponse)
async def chat(request: Request, body: ChatRequest):
    # Rate limiting
    client_ip = request.client.host if request.client else "unknown"
    if not _check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please wait a moment before sending another message."
        )

    # Validate message
    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    if len(message) > 1000:
        raise HTTPException(status_code=400, detail="Message is too long (max 1000 characters).")

    # Build conversation history (keep last 10 exchanges = 20 messages max)
    history = body.history or []
    if len(history) > 20:
        history = history[-20:]

    # Construct messages array for Groq
    system_instruction = SYSTEM_PROMPT
    if body.language == "ur":
        system_instruction += "\n\nCRITICAL INSTRUCTION: The user has selected URDU mode. You MUST respond entirely in Urdu, regardless of the language the user uses to ask the question."
    else:
        system_instruction += "\n\nCRITICAL INSTRUCTION: The user has selected ENGLISH mode. You MUST respond entirely in English, regardless of the language the user uses to ask the question."
        
    messages = [{"role": "system", "content": system_instruction}]
    for msg in history:
        if msg.role in ("user", "assistant"):
            messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": message})

    try:
        client = get_groq_client()
        completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            max_tokens=settings.GROQ_MAX_TOKENS,
            temperature=0.7,
            top_p=0.9,
        )
        reply = completion.choices[0].message.content.strip()

        # Detect response language (simple heuristic)
        urdu_chars = sum(1 for c in reply if '\u0600' <= c <= '\u06FF')
        detected_lang = "ur" if urdu_chars > len(reply) * 0.2 else "en"

        return ChatResponse(reply=reply, language=detected_lang)

    except Exception as e:
        logger.error(f"Groq API error: {e}")
        # Friendly fallback messages
        fallback_en = "I'm sorry, I'm having a moment of difficulty. Please try again shortly, or reach out to us at admin@rahehaq.org for immediate help."
        fallback_ur = "معذرت، مجھے ابھی تکنیکی مسئلہ ہے۔ براہ کرم دوبارہ کوشش کریں یا ہم سے admin@rahehaq.org پر رابطہ کریں۔"
        reply = fallback_ur if body.language == "ur" else fallback_en
        return ChatResponse(reply=reply, language=body.language or "en")
