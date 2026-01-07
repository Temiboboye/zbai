# ZeroBounce AI Backend

Comprehensive email verification backend built with FastAPI, integrating Office 365 autodiscover and advanced validation techniques.

## Features

- **Real-time Email Verification**: Comprehensive validation including syntax, domain, MX, SMTP
- **Office 365 Detection**: Uses autodiscover API to detect O365 emails
- **Bulk Processing**: Async job queue for processing large email lists
- **Disposable Email Detection**: Identifies temporary/throwaway email addresses
- **Role-Based Detection**: Flags generic role-based emails (admin@, info@, etc.)
- **Catch-All Detection**: Identifies domains that accept all emails
- **Spam Risk Assessment**: Multi-factor risk scoring
- **API Key Management**: Secure authentication and credit tracking

## Installation

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://user:password@localhost/zerobounce
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
ENVIRONMENT=development
```

### 4. Run Database Migrations

```bash
alembic upgrade head
```

### 5. Start the Server

```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Verify Single Email
```bash
POST /v1/verify
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "email": "user@example.com",
  "syntax": "valid",
  "domain": "valid",
  "mx": "found",
  "smtp": "responsive",
  "catch_all": false,
  "disposable": false,
  "role_based": false,
  "is_o365": true,
  "spam_risk": "low",
  "final_status": "valid_safe",
  "safety_score": 95,
  "credits_used": 1,
  "timestamp": "2026-01-03T12:00:00Z"
}
```

### Bulk Verification
```bash
POST /v1/bulk
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "emails": ["user1@example.com", "user2@example.com"]
}
```

**Response:**
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "total_emails": 2,
  "processed": 0,
  "created_at": "2026-01-03T12:00:00Z"
}
```

### Check Bulk Job Status
```bash
GET /v1/bulk/{job_id}
Authorization: Bearer YOUR_API_KEY
```

### Get Bulk Job Results
```bash
GET /v1/bulk/{job_id}/results
Authorization: Bearer YOUR_API_KEY
```

### Get Credits Balance
```bash
GET /v1/credits
Authorization: Bearer YOUR_API_KEY
```

## Architecture

### Email Verification Flow

1. **Syntax Validation**: Uses `email-validator` library
2. **Domain Validation**: DNS lookup to verify domain exists
3. **MX Record Check**: Queries MX records for mail servers
4. **Office 365 Detection**: Autodiscover API check (based on 365checker.py)
5. **SMTP Verification**: Async SMTP handshake to verify mailbox
6. **Catch-All Detection**: Tests random email to detect catch-all domains
7. **Disposable Detection**: Checks against known disposable domains
8. **Role-Based Detection**: Identifies generic role accounts
9. **Risk Scoring**: Calculates safety score (0-100)
10. **Final Classification**: Returns comprehensive results

### Database Schema

- **Users**: User accounts and authentication
- **APIKeys**: API key management and tracking
- **Verifications**: Individual verification results
- **BulkJobs**: Bulk processing job tracking
- **Transactions**: Credit purchases and billing
- **DisposableDomains**: Known disposable email providers
- **SpamTraps**: Known spam trap addresses

## Integration with 365checker.py

The backend integrates the Office 365 autodiscover logic from `365checker.py`:

```python
# Check if domain uses O365
url = f'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{email}?Protocol=rest'
response = requests.get(url, headers=headers)

if response.status_code == 200:
    # Email exists on O365
    is_o365 = True
```

## Performance

- **Single Email**: ~1-3 seconds (includes SMTP verification)
- **Bulk Processing**: Async processing with configurable workers
- **Rate Limiting**: Configurable per API key
- **Caching**: Domain-level caching for O365 detection

## Security

- API key authentication
- Rate limiting
- Input validation
- SQL injection prevention (SQLAlchemy ORM)
- CORS configuration

## Monitoring

- Health check endpoint
- Request logging
- Error tracking
- Performance metrics

## Deployment

### Docker

```bash
docker build -t zerobounce-backend .
docker run -p 8000:8000 zerobounce-backend
```

### Docker Compose

```bash
docker-compose up -d
```

## Testing

```bash
# Run tests
pytest

# With coverage
pytest --cov=app tests/
```

## License

Proprietary - All rights reserved
