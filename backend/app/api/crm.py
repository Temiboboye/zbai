"""
CRM & Campaign API Routes - Admin Only
"""
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.core import deps
from app.models.models import User, Lead, Campaign

router = APIRouter()


# --- Admin dependency ---
async def require_admin(current_user: User = Depends(deps.get_current_active_user)) -> User:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# --- Schemas ---
class LeadCreate(BaseModel):
    name: Optional[str] = None
    email: str
    company: Optional[str] = None
    status: str = "new"
    source: Optional[str] = "manual"
    notes: Optional[str] = None

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None

class LeadResponse(BaseModel):
    id: int
    name: Optional[str]
    email: str
    company: Optional[str]
    status: str
    source: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class CampaignCreate(BaseModel):
    name: str
    template_category: Optional[str] = None
    template_name: Optional[str] = None
    subject: str
    body: str
    recipient_ids: List[int] = []

class CampaignResponse(BaseModel):
    id: int
    name: str
    template_category: Optional[str]
    template_name: Optional[str]
    subject: str
    body: str
    recipient_count: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# --- Lead endpoints ---

@router.get("/leads", response_model=List[LeadResponse])
async def list_leads(
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """List all leads with optional search and status filter"""
    query = db.query(Lead).filter(Lead.user_id == admin.id)

    if status:
        query = query.filter(Lead.status == status)

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Lead.name.ilike(search_term),
                Lead.email.ilike(search_term),
                Lead.company.ilike(search_term),
            )
        )

    return query.order_by(Lead.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/leads", response_model=LeadResponse, status_code=201)
async def create_lead(
    lead_in: LeadCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Create a new lead"""
    lead = Lead(
        user_id=admin.id,
        name=lead_in.name,
        email=lead_in.email,
        company=lead_in.company,
        status=lead_in.status,
        source=lead_in.source,
        notes=lead_in.notes,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@router.put("/leads/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    lead_in: LeadUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Update an existing lead"""
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.user_id == admin.id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    update_data = lead_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(lead, key, value)

    lead.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/leads/{lead_id}")
async def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Delete a lead"""
    lead = db.query(Lead).filter(Lead.id == lead_id, Lead.user_id == admin.id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    db.delete(lead)
    db.commit()
    return {"ok": True}


@router.post("/leads/import")
async def import_leads(
    leads: List[LeadCreate],
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Bulk import leads"""
    created = []
    for lead_in in leads:
        lead = Lead(
            user_id=admin.id,
            name=lead_in.name,
            email=lead_in.email,
            company=lead_in.company,
            status=lead_in.status,
            source=lead_in.source or "import",
            notes=lead_in.notes,
        )
        db.add(lead)
        created.append(lead)

    db.commit()
    return {"imported": len(created)}


@router.get("/stats")
async def lead_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """Pipeline stats: counts per stage"""
    base = db.query(Lead).filter(Lead.user_id == admin.id)
    total = base.count()

    stages = {}
    for s in ["new", "contacted", "qualified", "won", "lost"]:
        stages[s] = base.filter(Lead.status == s).count()

    return {"total": total, "stages": stages}


# --- Campaign endpoints ---

@router.get("/campaigns", response_model=List[CampaignResponse])
async def list_campaigns(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """List all campaigns"""
    return db.query(Campaign).filter(Campaign.user_id == admin.id).order_by(Campaign.created_at.desc()).all()


@router.post("/campaigns", response_model=CampaignResponse, status_code=201)
async def create_campaign(
    campaign_in: CampaignCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Create and 'send' a campaign.
    In a real implementation, this would send emails via Resend.
    For now it marks leads as contacted and records the campaign.
    """
    # Update lead statuses
    if campaign_in.recipient_ids:
        leads = db.query(Lead).filter(
            Lead.id.in_(campaign_in.recipient_ids),
            Lead.user_id == admin.id,
        ).all()
        for lead in leads:
            if lead.status == "new":
                lead.status = "contacted"
        recipient_count = len(leads)
    else:
        recipient_count = 0

    campaign = Campaign(
        user_id=admin.id,
        name=campaign_in.name,
        template_category=campaign_in.template_category,
        template_name=campaign_in.template_name,
        subject=campaign_in.subject,
        body=campaign_in.body,
        recipient_count=recipient_count,
        status="sent",
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign
