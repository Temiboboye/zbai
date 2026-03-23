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


# --- Service Onboarding (Public — post-payment) ---

class ServiceOnboardingRequest(BaseModel):
    fullName: str
    email: EmailStr
    companyName: str
    companyWebsite: str
    productDescription: str
    targetTitles: str
    targetIndustries: str
    targetCompanySize: Optional[str] = None
    targetGeography: Optional[str] = None
    existingCustomers: Optional[str] = None
    competitors: Optional[str] = None
    valueProposition: Optional[str] = None
    additionalNotes: Optional[str] = None
    sessionId: Optional[str] = None
    service: str = "yc_lead_gen"


@router.post("/service-onboarding")
async def service_onboarding(
    data: ServiceOnboardingRequest,
    db: Session = Depends(get_db),
):
    """Public endpoint for post-payment onboarding form. No auth required."""
    import json
    import logging
    logger = logging.getLogger(__name__)

    try:
        # Save as a lead  
        lead = Lead(
            user_id=1,  # Admin user
            name=data.fullName,
            email=data.email,
            company=data.companyName,
            status="qualified",
            source="yc_lead_gen_purchase",
            notes=json.dumps({
                "company_website": data.companyWebsite,
                "product_description": data.productDescription,
                "target_titles": data.targetTitles,
                "target_industries": data.targetIndustries,
                "target_company_size": data.targetCompanySize,
                "target_geography": data.targetGeography,
                "existing_customers": data.existingCustomers,
                "competitors": data.competitors,
                "value_proposition": data.valueProposition,
                "additional_notes": data.additionalNotes,
                "stripe_session_id": data.sessionId,
                "service": data.service,
                "submitted_at": datetime.utcnow().isoformat(),
            }),
        )
        db.add(lead)
        db.commit()
        db.refresh(lead)

        # Send notification email to admin
        try:
            from app.services.email_service import email_service
            import requests

            admin_html = f"""<div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
<h2 style="color: #27c93f;">🎉 New YC Lead Gen Purchase!</h2>
<table style="width: 100%; border-collapse: collapse;">
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.fullName}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.email}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.companyName}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Website</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.companyWebsite}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Product</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.productDescription}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Target Titles</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.targetTitles}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Target Industries</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.targetIndustries}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company Size</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.targetCompanySize or 'Not specified'}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Geography</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.targetGeography or 'Not specified'}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Existing Customers</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.existingCustomers or 'Not specified'}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Competitors</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.competitors or 'Not specified'}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Value Prop</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.valueProposition or 'Not specified'}</td></tr>
<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Notes</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{data.additionalNotes or 'None'}</td></tr>
</table>
<p style="margin-top: 1rem; color: #666;">Stripe Session: {data.sessionId or 'N/A'}</p>
</div>"""

            requests.post(
                email_service.api_url,
                headers={"Authorization": f"Bearer {email_service.api_key}", "Content-Type": "application/json"},
                json={
                    "from": email_service.from_email,
                    "to": ["temitayoboboye@gmail.com"],
                    "subject": f"🎉 New YC Lead Gen Purchase: {data.companyName} ({data.fullName})",
                    "html": admin_html,
                }
            )
        except Exception as email_err:
            logger.error(f"Failed to send admin notification: {email_err}")

        return {"ok": True, "lead_id": lead.id}

    except Exception as e:
        logger.error(f"Service onboarding error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

