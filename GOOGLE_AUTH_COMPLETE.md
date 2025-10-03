# Google OAuth Authentication - Complete Setup

## ✅ What's Implemented

### Frontend (React)
- **Clean Google-only login page** - No email/password forms
- **Single "Sign in with Google" button** - Simple and secure
- **Automatic user creation** - First-time Google users are auto-registered
- **Session management** - JWT tokens stored in sessionStorage
- **Profile display** - Shows Google profile picture and name

### Backend (FastAPI)
- **Google token verification** - Validates tokens with 10-second clock skew tolerance
- **User management** - Links Google accounts to database users
- **JWT authentication** - Secure access/refresh tokens
- **Nullable passwords** - Database supports passwordless Google users

### Security (AWS Secrets Manager)
- **JWT Secret**: 86-character cryptographic secret stored in AWS
- **Google OAuth credentials**: Client ID & Secret stored in AWS
- **No secrets in code**: All sensitive data in AWS Secrets Manager
- **Production ready**: Backend auto-loads secrets from AWS

## 🔒 Security Features

✅ Secrets stored in AWS Secrets Manager (encrypted at rest)
✅ No credentials in .env files (all commented out)
✅ Strong cryptographic JWT secret (86 characters)
✅ IAM access control for secrets
✅ CloudTrail audit logging
✅ Google token validation with clock skew tolerance
✅ Email-based unique users (no duplicates)

## 🚀 How to Use

### Development
1. Start backend: `cd backend_jwt && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8088`
2. Start frontend: `cd frontend_1 && npm run dev -- --port 3000`
3. Visit: http://localhost:3000/auth
4. Click "Sign in with Google"

### Production
1. Set `ENV=production` in production environment
2. Backend automatically loads secrets from AWS Secrets Manager
3. No `.env` file needed in production (AWS credentials via IAM role)

## 📋 Configuration

### Google Cloud Console
- **Authorized JavaScript origins**: http://localhost:3000, http://127.0.0.1:3000
- **Authorized redirect URIs**: Not needed (using credential flow)

### AWS Secrets Manager
- **menudealmoco/jwt-secret**: JWT signing secret
- **menudealmoco/google-oauth**: `{"client_id":"...","client_secret":"..."}`
- **Region**: eu-west-1

### Environment Variables (.env)
```bash
ENV=development
AWS_REGION=eu-west-1
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
DATABASE_URL=sqlite:///./menudealmoco.db

# Secrets loaded from AWS (not from env vars)
```

## 🔧 Backend Endpoints

### Still Available (but not exposed in UI)
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/signup` - Email/password signup

These endpoints remain functional but are not accessible via the UI.
The database still supports password-based users.

### Active Endpoints
- `POST /api/auth/google` - Google OAuth login/signup
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user info
- `PUT /api/auth/update-display-name` - Update display name

## 📝 Database Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,              -- NULLABLE for Google users
  google_id TEXT UNIQUE,           -- Google user ID
  display_name TEXT,
  is_reviewer INTEGER DEFAULT 0,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 User Flow

1. User visits `/auth`
2. Clicks "Sign in with Google"
3. Google consent screen appears
4. User approves
5. Frontend receives JWT token from Google
6. Frontend sends token to backend `/api/auth/google`
7. Backend verifies token with Google
8. Backend creates/updates user in database
9. Backend returns JWT access & refresh tokens
10. Frontend stores tokens and redirects to `/profile`

## 🐛 Troubleshooting

### "Origin not allowed" error
- Add `http://localhost:3000` to Authorized JavaScript origins in Google Cloud Console

### "Token used too early" error
- ✅ Fixed with 10-second clock skew tolerance

### "Password hash cannot be null" error
- ✅ Fixed with database migration

### Backend can't load secrets
- Check AWS credentials: `aws sts get-caller-identity`
- Verify secrets exist: `aws secretsmanager list-secrets --region eu-west-1`
- Check IAM permissions for `secretsmanager:GetSecretValue`

## 📊 Cost

- AWS Secrets Manager: $0.80/month (2 secrets)
- Google OAuth: Free
- Everything else: Free (within AWS/GCP free tiers)

## ✨ Benefits Over Email/Password

✅ **No password management** - Users don't need to remember passwords
✅ **2FA by default** - Google accounts often have 2FA enabled
✅ **Faster signup** - One-click registration
✅ **No password resets** - No "forgot password" flow needed
✅ **Google's security** - Leverage Google's security infrastructure
✅ **Profile data** - Get name and profile picture automatically

## 🔄 Future Enhancements (Optional)

- Add Microsoft/Apple/Facebook OAuth
- Implement automatic secret rotation (AWS Lambda)
- Add rate limiting per user (not just per IP)
- Implement session refresh on page load
- Add email verification flow (if needed)

---

**Status**: ✅ Production Ready
**Last Updated**: 2025-10-03
