# 🚀 Quick Fix: PDF Storage "Bucket not found" Error

## Problem
```
"statusCode":"404","error":"Bucket not found","message":"Bucket not found"
```

## Solution (3 Minutes)

### 1️⃣ Create Storage Bucket in Supabase

**Go to:** https://supabase.com/dashboard/project/YOUR-PROJECT/storage

1. Click **"New bucket"**
2. Settings:
   - **Name:** `pdfs`
   - **Public:** ✅ YES
   - Click **"Create"**

### 2️⃣ Set Service Role Key in Vercel

**Go to:** https://vercel.com → Your Project → Settings → Environment Variables

**Add this variable:**

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (very long) | Supabase → Settings → API → **service_role** key |

**Important:**
- ✅ Check **Production**
- ✅ Check **Preview**  
- ✅ Check **Development**
- Click **"Save"**

### 3️⃣ Redeploy

**Go to:** Vercel → Deployments

1. Click **"..."** on latest deployment
2. Click **"Redeploy"**
3. Wait 2-3 minutes

### 4️⃣ Test

1. Login to your app
2. Go to dashboard
3. Click "Download PDF"
4. ✅ Should work!

---

## 🔍 Still Not Working?

### Check 1: Bucket Name
- Must be exactly: `pdfs` (lowercase, plural)

### Check 2: Service Role Key
- Go to Supabase → Settings → API
- Copy the **service_role** key (bottom one)
- NOT the anon key!
- Should be ~500+ characters long

### Check 3: Environment Variable
- Go to Vercel → Settings → Environment Variables
- Verify `SUPABASE_SERVICE_ROLE_KEY` exists
- Should be in all 3 environments

### Check 4: Redeployed?
- Must redeploy after adding env var
- Old deployments won't have it!

---

## 💡 Good News

Even if storage doesn't work, **PDFs still download!** 

The app has a fallback:
- Generates PDF successfully
- Returns as base64
- Browser downloads it
- Just won't save to storage

So your users can still get PDFs while you fix storage!

---

## 📖 Full Instructions

See `SUPABASE_STORAGE_SETUP.md` for detailed setup including RLS policies.

---

## ✅ Quick Checklist

- [ ] Created `pdfs` bucket in Supabase
- [ ] Set bucket to Public
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` to Vercel
- [ ] Variable in all 3 environments
- [ ] Redeployed after adding variable
- [ ] Tested PDF download

---

**Time Required:** 3-5 minutes  
**Difficulty:** Easy  
**Impact:** PDFs will save to storage + get permanent URLs

