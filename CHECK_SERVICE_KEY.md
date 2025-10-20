# ✅ Quick Check: Service Role Key in Vercel

Since you already have the `pdfs` bucket and made it public, the issue is the **service role key**.

## Step 1: Get Your Service Role Key from Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon) in the left sidebar
4. Click **API**
5. Scroll down to **"Project API keys"**
6. Find the **`service_role`** key (it's the SECOND one, not the anon key!)
7. Copy it (it starts with `eyJhbGc...` and is very long, ~500+ characters)

**Important:** 
- ❌ Don't copy the `anon` / `public` key
- ✅ Copy the `service_role` key

## Step 2: Check if It's in Vercel

1. Go to https://vercel.com
2. Select your project (Alira)
3. Go to **Settings** → **Environment Variables**
4. Search for: `SUPABASE_SERVICE_ROLE_KEY`

### If It's Missing:
Click **"Add New"** and enter:
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Your service_role key from Step 1
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

### If It Exists:
1. Click the eye icon to reveal it
2. Check if it matches the key from Supabase
3. If different, click **"Edit"** and update it
4. Make sure it's enabled for all 3 environments

## Step 3: Redeploy

**This is CRITICAL!** Environment variables only take effect after redeployment.

1. Go to **Deployments** tab in Vercel
2. Find your latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Click **"Redeploy"** again to confirm
6. Wait 2-3 minutes

## Step 4: Test

After redeployment completes:

1. Go to your live site
2. Login
3. Go to a plan
4. Click **"Download PDF"**
5. ✅ Should work now!

## Troubleshooting

### Still Getting 404?

Check your Vercel deployment logs:
1. Vercel → Deployments → Click on latest deployment
2. Click **"Functions"** tab
3. Look for `/api/plan/generate-pdf`
4. Check the logs

You should see one of these:

**If service key is missing:**
```
⚠️  SUPABASE_SERVICE_ROLE_KEY not set - skipping storage upload
```

**If bucket exists and key is correct:**
```
✅ PDF uploaded successfully
```

**If still 404:**
```
❌ Storage bucket "pdfs" not found
```
This means the key isn't being read - redeploy again.

## Quick Verification Commands

You can also check locally if you have the key set:

1. Check your local `.env.local` file:
```bash
cat .env.local | grep SUPABASE_SERVICE_ROLE_KEY
```

2. If missing locally, add it:
```bash
# .env.local
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Test locally:
```bash
npm run dev
# Go to http://localhost:3000 and test PDF generation
```

## Expected Result

After setting the service key and redeploying:

✅ PDF uploads to your `pdfs` bucket in Supabase  
✅ Returns a permanent URL  
✅ Dashboard saves the PDF URL  
✅ No more 404 errors  

---

**The bucket is ready - we just need to connect it with the service key!** 🔑

