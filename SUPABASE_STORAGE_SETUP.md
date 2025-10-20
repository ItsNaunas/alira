# 📦 Supabase Storage Setup for PDF Storage

## Problem

Getting error: `"statusCode":"404","error":"Bucket not found","message":"Bucket not found"}`

This means the Supabase Storage bucket is either:
1. Not created
2. Not named correctly
3. Not accessible with the service role key
4. Service role key not set in Vercel

---

## ✅ Solution: Step-by-Step Setup

### **Step 1: Create the Storage Bucket in Supabase**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/YOUR-PROJECT-ID
2. Click on **Storage** in the left sidebar
3. Click **"New bucket"** button
4. Configure the bucket:

```
Bucket name: pdfs
Public bucket: ☑️ Yes (checked) - so users can download PDFs
File size limit: 50 MB (default)
Allowed MIME types: application/pdf
```

5. Click **"Create bucket"**

### **Step 2: Configure Bucket Policies**

After creating the bucket, you need to set up access policies:

1. Click on the `pdfs` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**

#### Policy 1: Allow authenticated users to upload
```sql
CREATE POLICY "Allow authenticated users to upload PDFs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdfs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2: Allow public read access
```sql
CREATE POLICY "Allow public read access to PDFs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pdfs');
```

#### Policy 3: Allow service role full access (IMPORTANT!)
```sql
CREATE POLICY "Service role has full access"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'pdfs');
```

---

### **Step 3: Verify Environment Variables in Vercel**

Your Vercel project needs these environment variables:

#### Go to Vercel Dashboard
1. Go to https://vercel.com
2. Select your project
3. Go to **Settings** → **Environment Variables**

#### Required Variables

| Variable | Value | Where to Find |
|----------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase → Settings → API → anon/public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` | Supabase → Settings → API → **service_role** (⚠️ SECRET!) |
| `OPENAI_API_KEY` | `sk-proj-...` | OpenAI Dashboard |

#### ⚠️ CRITICAL: Service Role Key

The **`SUPABASE_SERVICE_ROLE_KEY`** is REQUIRED for storage operations!

**Where to find it:**
1. Go to Supabase Dashboard
2. Click **Settings** (gear icon)
3. Click **API**
4. Scroll down to **Project API keys**
5. Copy the **`service_role`** key (NOT the anon key!)

**Add to Vercel:**
1. In Vercel → Settings → Environment Variables
2. Add new variable:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Your service_role key (starts with `eyJhbGc...`)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
3. Click **Save**

---

### **Step 4: Redeploy**

After adding the environment variable:

1. Go to Vercel Dashboard → Deployments
2. Click **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete (~2-3 minutes)

---

## 🧪 Testing the Fix

### Test 1: Check Storage Bucket
```bash
# In Supabase Dashboard → Storage
# You should see: pdfs (bucket)
```

### Test 2: Check Vercel Environment Variables
```bash
# In Vercel → Settings → Environment Variables
# Verify SUPABASE_SERVICE_ROLE_KEY is set
```

### Test 3: Generate PDF
1. Log in to your app
2. Go to a plan in your dashboard
3. Click **"Download PDF"**
4. ✅ Should download successfully

---

## 📊 Expected Behavior

### Before Fix:
```json
{
  "statusCode": "404",
  "error": "Bucket not found",
  "message": "Bucket not found"
}
```

### After Fix (Option 1: Storage Upload Success):
- PDF uploads to Supabase Storage
- Returns public URL
- Dashboard updates with PDF URL
- User can access PDF anytime

### After Fix (Option 2: Storage Unavailable - Graceful Fallback):
- PDF generation still works
- Returns base64 PDF data
- Browser downloads PDF directly
- No storage, but feature works!

---

## 🔧 Troubleshooting

### Issue 1: Still getting 404 after creating bucket

**Check:**
- Is the bucket named exactly `pdfs` (lowercase)?
- Is the bucket public?
- Is `SUPABASE_SERVICE_ROLE_KEY` set in Vercel?
- Have you redeployed after setting the env var?

### Issue 2: "Service role key not configured"

**Fix:**
1. Go to Supabase → Settings → API
2. Copy the **service_role** key (not anon key!)
3. Add to Vercel as `SUPABASE_SERVICE_ROLE_KEY`
4. Redeploy

### Issue 3: PDF downloads but no URL saved

**This is OK!** The code has a fallback:
- If storage fails, it returns base64 PDF
- User can still download
- Not ideal, but functional

**To fix permanently:**
- Follow steps 1-4 above
- Make sure service role key is correct

### Issue 4: "403 Forbidden" error

**Check RLS Policies:**
1. Supabase → Storage → pdfs bucket → Policies
2. Make sure you have the service role policy (Step 2 above)
3. If missing, add it

---

## 🎯 Quick Fix (If You Don't Want Storage)

If you just want PDFs to work without storage:

The current code already has a fallback! PDFs will:
- Generate successfully
- Return as base64
- Download directly in browser
- Work perfectly fine!

**Storage is optional** - it just provides:
- Permanent URLs
- Ability to re-download without regenerating
- Lower bandwidth on subsequent downloads

---

## 📚 Additional Resources

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage Security with RLS](https://supabase.com/docs/guides/storage/security/access-control)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## ✅ Checklist

Before asking for help, verify:

- [ ] Bucket `pdfs` exists in Supabase Storage
- [ ] Bucket is set to **Public**
- [ ] RLS policies are configured (especially service role policy)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel
- [ ] Variable is set for **all environments** (Production, Preview, Development)
- [ ] Redeployed after setting environment variable
- [ ] Using the **service_role** key, not the anon key
- [ ] Key starts with `eyJhbGc...` and is very long (~500+ characters)

---

**Need help?** The app logs now show detailed error messages. Check your Vercel logs after clicking "Generate PDF" to see exactly what's failing.

