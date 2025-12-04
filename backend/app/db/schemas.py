from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    
    class Config:
        from_attributes = True

# --- Chat Schemas ---
class ChatMessageBase(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatSessionCreate(BaseModel):
    title: str = "New Chat"

class ChatSessionResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    messages: List[ChatMessageBase] = []

    class Config:
        from_attributes = True