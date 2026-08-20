import os
from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# 1. Initialize Supabase Client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# 2. Initialize FastAPI
app = FastAPI(title="Crashr API")

# Configure CORS so your React app can talk to it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Authentication Dependency
# This function intercepts the request, grabs the token from the header, and asks Supabase if it's valid.
async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.split(" ")[1]
    
    try:
        # Ask Supabase to verify the JWT
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid user")
        return user_response.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# --- Pydantic Models ---
class PartyCreate(BaseModel):
    title: str
    description: str
    event_time: datetime
    location: str
    price: float

class PartyResponse(PartyCreate):
    id: str
    host_id: str
    created_at: datetime

# --- Routes ---

@app.get("/parties", response_model=List[PartyResponse])
async def get_parties():
    """Fetch all upcoming parties. Open to the public."""
    response = supabase.table("parties").select("*").execute()
    return response.data

@app.get("/parties/{party_id}")
async def get_party_details(party_id: str):
    """Fetch details for a specific party."""
    response = supabase.table("parties").select("*").eq("id", party_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Party not found")
    return response.data[0]

@app.post("/parties", response_model=PartyResponse)
async def create_party(party: PartyCreate, current_user = Depends(get_current_user)):
    """Create a new party. Requires a valid Supabase Auth token."""
    
    # We construct the payload, injecting the authenticated user's ID as the host
    party_data = party.model_dump()
    party_data["event_time"] = party_data["event_time"].isoformat()
    party_data["host_id"] = current_user.id 
    
    # Insert into Supabase. RLS ensures this only works if the token is valid.
    response = supabase.table("parties").insert(party_data).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create party")
        
    return response.data[0]