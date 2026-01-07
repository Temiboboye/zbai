# ZeroBounce AI

> **Comprehensive Email Verification & Deliverability Intelligence Platform**

A production-ready email verification platform featuring Office 365 autodiscover, SMTP verification, bulk processing, and a beautiful Positivus-inspired UI.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green)
![Python](https://img.shields.io/badge/Python-3.11+-blue)

---

## ✨ Features

### 🔍 **Comprehensive Verification**
- ✅ Syntax validation
- ✅ Domain & MX record checks
- ✅ SMTP handshake verification
- ✅ **Office 365 autodiscover** (from 365checker.py)
- ✅ Disposable email detection
- ✅ Role-based email detection
- ✅ Catch-all domain detection
- ✅ Spam risk assessment (0-100 safety score)

### 📦 **Bulk Processing**
- Process up to 100,000 emails per job
- Async job queue with Celery
- Real-time progress tracking
- Downloadable results (CSV/JSON)

### 🎨 **Beautiful UI (Positivus Theme)**
- Light, clean design with lime green accents
- Rounded cards (45px border radius)
- Space Grotesk typography
- Fully responsive
- Smooth animations

### 💳 **Credit-Based Pricing**
- $0.0003 per verification
- Tiered plans (Starter, Growth, Scale)
- Credit rollover (30-90 days)
- Auto-refill options

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/zerobounceai.git
cd zerobounceai

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
npm install
npm run dev
```

---

## 📁 Project Structure

```
zerobounceai/
├── backend/                    # FastAPI backend
│   ├── app/
│   │   ├── main.py            # Main application
│   │   ├── services/
│   │   │   └── email_verifier.py  # Verification logic
│   │   ├── models/
│   │   │   └── database.py    # Database models
│   │   └── core/
│   │       ├── config.py      # Configuration
│   │       └── celery_app.py  # Celery setup
│   └── requirements.txt
├── src/                        # Next.js frontend
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Positivus theme
│   │   ├── (dashboard)/       # Dashboard routes
│   │   └── api/               # API routes
│   └── components/
├── 365checker.py              # O365 autodiscover script
├── docker-compose.yml         # Full stack deployment
└── SETUP_GUIDE.md            # Detailed setup instructions
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, TypeScript, CSS Modules |
| **Backend** | FastAPI, Python 3.11+ |
| **Database** | PostgreSQL 15, SQLAlchemy |
| **Cache/Queue** | Redis 7, Celery |
| **Deployment** | Docker, Docker Compose |

---

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete installation and deployment guide
- **[Project Summary](./PROJECT_SUMMARY.md)** - Detailed project overview
- **[Theme Documentation](./THEME_UPDATE.md)** - Positivus theme implementation
- **[Backend README](./backend/README.md)** - Backend-specific documentation
- **[PRD](./email_verification_platform_product_requirements_document.md)** - Product requirements

---

## 🎯 Key Integrations

### Office 365 Autodiscover (from 365checker.py)

The platform integrates the Office 365 detection logic:

```python
# Check if email exists on O365
url = f'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{email}?Protocol=rest'
response = requests.get(url, headers=headers)

if response.status_code == 200:
    # Email exists on Office 365
    is_o365 = True
```

This provides accurate detection of Microsoft 365 email accounts without authentication.

---

## 🔌 API Usage

### Verify Single Email

```bash
curl -X POST http://localhost:8000/v1/verify \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
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
curl -X POST http://localhost:8000/v1/bulk \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"emails": ["user1@example.com", "user2@example.com"]}'
```

---

## 🎨 Positivus Theme

The UI features the distinctive Positivus design:

- **Colors**: Lime green (`#b9ff66`), black, dark gray, light gray
- **Typography**: Space Grotesk font family
- **Cards**: 45px border radius, 1px solid borders
- **Buttons**: 14px border radius, smooth hover effects
- **Layout**: Clean, spacious, with alternating card colors

### Example Components

```tsx
// Greenhead badge
<span className="greenhead">Featured</span>

// Primary button
<button className="btn btn-primary">Get Started</button>

// Card
<div className="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

---

## 📊 Performance

- **Single Email**: 1-3 seconds (includes SMTP verification)
- **Bulk Processing**: ~20-30 emails/second
- **Concurrency**: 10 workers (configurable)
- **Max Job Size**: 100,000 emails

---

## 🔐 Security

- ✅ API key authentication
- ✅ Rate limiting (60/min, 1000/hour)
- ✅ Input validation (Pydantic)
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ CORS configuration
- ✅ Environment variable management

---

## 🚀 Deployment

### Vercel (Frontend)

```bash
vercel --prod
```

### Railway/Render (Backend)

```bash
# Connect GitHub repository
# Set environment variables
# Deploy automatically on push
```

### Docker (Full Stack)

```bash
docker-compose up -d
```

---

## 🧪 Testing

### Backend

```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend

```bash
npm test -- --coverage
```

---

## 📈 Roadmap

- [ ] User authentication (NextAuth/Clerk)
- [ ] Payment integration (Stripe)
- [ ] Webhook support
- [ ] Email warmup tracking
- [ ] Deliverability analytics
- [ ] Machine learning spam detection
- [ ] White-label solution
- [ ] Mobile app

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Proprietary - All rights reserved

---

## 🙏 Acknowledgments

- **[365checker.py](./365checker.py)** - Office 365 detection by @notanotherlee
- **[Positivus](https://github.com/manulthanura/Positivus)** - Design inspiration
- **FastAPI** - Modern Python web framework
- **Next.js** - React framework by Vercel

---

## 📞 Support

- **Email**: support@zerobounce.ai
- **Documentation**: https://docs.zerobounce.ai
- **Issues**: https://github.com/zerobounce/zerobounceai/issues

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ for email deliverability excellence**

*Version 1.0.0 - January 2026*
