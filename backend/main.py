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
    location: str          # General neighborhood (Public)
    exact_address: str     # Hidden until ticket is bought
    price: float
    capacity: int = 26     # Defaulting to 26 guests
    requires_approval: bool = False
    cover_image_url: Optional[str] = None

class PartyResponse(PartyCreate):
    id: str
    host_id: str
    created_at: datetime

class TicketCreate(BaseModel):
    party_id: str

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    favorite_genres: Optional[List[str]] = None

class TicketUpdate(BaseModel):
    status: str # 'confirmed' or 'denied'
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

@app.post("/tickets")
async def purchase_ticket(ticket: TicketCreate, current_user = Depends(get_current_user)):
    """Buy a ticket or join the waitlist"""
    
    # 1. Check party capacity
    party_res = supabase.table("parties").select("capacity, requires_approval").eq("id", ticket.party_id).execute()
    if not party_res.data:
        raise HTTPException(status_code=404, detail="Party not found")
        
    party = party_res.data[0]
    
    # 2. Count existing tickets
    count_res = supabase.table("tickets").select("id", count="exact").eq("party_id", ticket.party_id).execute()
    current_guests = count_res.count
    
    # 3. Determine status based on capacity and approval settings
    status = "confirmed"
    if party["requires_approval"]:
        status = "pending"
    elif current_guests >= party["capacity"]:
        status = "waitlisted"
        
    # 4. Create the ticket
    ticket_data = {
        "party_id": ticket.party_id,
        "guest_id": current_user.id,
        "status": status
    }
    
    response = supabase.table("tickets").insert(ticket_data).execute()
    return response.data[0]


@app.get("/profiles/me")
async def get_my_profile(current_user = Depends(get_current_user)):
    """Fetch the logged-in user's profile."""
    response = supabase.table("profiles").select("*").eq("id", current_user.id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    return response.data[0]

@app.put("/profiles/me")
async def update_my_profile(profile: ProfileUpdate, current_user = Depends(get_current_user)):
    """Update the logged-in user's profile."""
    # Drop None values so we only update what was actually sent
    update_data = {k: v for k, v in profile.model_dump().items() if v is not None}
    
    response = supabase.table("profiles").update(update_data).eq("id", current_user.id).execute()
    return response.data[0]


@app.get("/parties")
async def get_parties():
    """Fetch all upcoming parties with host profiles."""
    # The nested select grabs the full_name and avatar from the linked profile
    response = supabase.table("parties").select("*, profiles(full_name, avatar_url)").execute()
    return response.data

@app.get("/parties/{party_id}")
async def get_party_details(party_id: str):
    """Fetch details for a specific party with the host profile."""
    response = supabase.table("parties").select("*, profiles(full_name, avatar_url)").eq("id", party_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Party not found")
    return response.data[0]


@app.get("/host/dashboard")
async def get_host_dashboard(current_user = Depends(get_current_user)):
    """Fetch all parties hosted by the user, including guests and their profiles."""
    response = supabase.table("parties") \
        .select("*, tickets(*, profiles(full_name, avatar_url, email))") \
        .eq("host_id", current_user.id) \
        .order("event_time", desc=False) \
        .execute()
    return response.data

@app.put("/tickets/{ticket_id}/status")
async def update_ticket_status(ticket_id: str, update_data: TicketUpdate, current_user = Depends(get_current_user)):
    """Approve or deny a pending ticket request."""
    # 1. Verify the current user is actually the host of this party
    ticket_res = supabase.table("tickets").select("party_id").eq("id", ticket_id).execute()
    if not ticket_res.data:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    party_res = supabase.table("parties").select("host_id").eq("id", ticket_res.data[0]["party_id"]).execute()
    if party_res.data[0]["host_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to manage this party's tickets")
        
    # 2. Update the status
    response = supabase.table("tickets").update({"status": update_data.status}).eq("id", ticket_id).execute()
    return response.data[0]

@app.delete("/parties/{party_id}")
async def cancel_party(party_id: str, current_user = Depends(get_current_user)):
    """Cancel a party and delete it from the feed."""
    # Verify ownership
    party_res = supabase.table("parties").select("host_id").eq("id", party_id).execute()
    if not party_res.data or party_res.data[0]["host_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Delete the party (ensure Supabase foreign keys are set to ON DELETE CASCADE for tickets)
    response = supabase.table("parties").delete().eq("id", party_id).execute()
    return {"message": "Party cancelled"}