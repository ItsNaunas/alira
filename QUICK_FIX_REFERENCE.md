# Quick Fix Reference - Auth & Build Issues

## 🔥 The Problem

1. **Build Failing**: Import errors with `GradientBars` component
2. **Email Links to Localhost**: Confirmation emails point to `localhost:3000`

## ✅ The Fix (Already Done in Code)

1. ✅ Fixed 4 import statements (about, contact, services, what-you-get pages)
2. ✅ Created auth callback route: `app/auth/callback/route.ts`
3. ✅ Updated environment variable template

## ⚡ What You Need to Do (3 Minutes)

### 1️⃣ Vercel: Add Environment Variable
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://your-vercel-app.vercel.app
```

### 2️⃣ Supabase: Add Redirect URLs
Go to **Authentication** → **URL Configuration**, add:
```
https://your-domain.com/auth/callback
https://*.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### 3️⃣ Deploy
```bash
git add .
git commit -m "Fix auth callback and build errors"
git push origin main
```

## 🎯 Expected Result

✅ Build succeeds  
✅ Email links point to production  
✅ Users can confirm email and login  
✅ Dashboard accessible after auth  

---

**Full guide:** See `PRODUCTION_AUTH_SETUP_GUIDE.md`  
**Audit report:** See `AUTH_CALLBACK_AUDIT.md`

