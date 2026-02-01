# 🚀 DEPLOYMENT GUIDE FOR RANDULA
## Deploy Influencer Report Generator to winfluencer.online

---

## ✅ WHAT I'VE BUILT FOR YOU:

1. ✅ Complete Next.js application
2. ✅ Instagram API integration (using your API key)
3. ✅ Lead capture with Google Sheets support
4. ✅ Professional premium design
5. ✅ Configured for `/influencer-report-generator` path
6. ✅ Ready to deploy!

---

## 📋 BEFORE YOU START - YOU NEED:

- [x] Vercel account (you have this)
- [x] GitHub account (to push code)
- [x] Your domain: winfluencer.online
- [ ] Google Sheet for leads (we'll set this up)

---

## STEP 1: SET UP GOOGLE SHEETS (5 minutes)

### Create the Sheet:

1. Go to https://sheets.google.com
2. Create new sheet called "Influencer Leads"
3. Add these column headers in Row 1:
   ```
   A: timestamp
   B: fullName
   C: email
   D: phone
   E: userType
   F: conversionInterest
   G: campaignName
   H: totalInvestment
   ```

### Create the Webhook:

1. In your sheet, go to: **Extensions** → **Apps Script**
2. Delete any default code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.timestamp,
      data.fullName,
      data.email,
      data.phone || 'N/A',
      data.userType,
      data.conversionInterest,
      data.campaignName,
      data.totalInvestment
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (disk icon)
5. Click **Deploy** → **New deployment**
6. Settings:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**
8. **IMPORTANT:** Copy the Web App URL (looks like: `https://script.google.com/macros/s/.../exec`)
9. Save this URL - you'll need it!

---

## STEP 2: DOWNLOAD THE CODE (2 minutes)

I've created all the files in `/home/claude/influencer-report-app/`

You need to download these files:

1. Open your terminal/command prompt
2. Navigate to where you want the project
3. Or I can create a ZIP file for you to download

**Do you want me to:**
- A) Create a ZIP file you can download?
- B) Give you commands to copy the files?

---

## STEP 3: PUSH TO GITHUB (5 minutes)

### If you don't have the code yet:

1. Create new folder on your computer: `influencer-report-generator`
2. Extract/copy all files there
3. Open terminal in that folder

### Push to GitHub:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Influencer Report Generator"

# Create new repo on GitHub (do this first at github.com)
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/influencer-report-generator.git

# Push
git push -u origin main
```

---

## STEP 4: DEPLOY TO VERCEL (10 minutes)

### A. Import Project:

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your repo: `influencer-report-generator`
5. Click **"Import"**

### B. Configure Build:

Vercel should auto-detect:
- **Framework Preset:** Next.js
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### C. Add Environment Variables:

Click **"Environment Variables"** and add:

1. `RAPIDAPI_KEY`
   - Value: `d5b4bfaf00msh6ba4b0c0e49c39bp15b39cjsncb0aba43fdcc`

2. `RAPIDAPI_HOST`
   - Value: `instagram-scraper-20251.p.rapidapi.com`

3. `GOOGLE_SHEETS_WEBHOOK_URL`
   - Value: [Paste the URL you got from Google Apps Script]

4. `NEXT_PUBLIC_MOCK_MODE`
   - Value: `false`

### D. Deploy:

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You'll get a URL like: `https://influencer-report-generator-xyz.vercel.app`

### E. Test It:

1. Visit: `https://YOUR_VERCEL_URL/influencer-report-generator`
2. Try generating a report
3. Check if lead goes to Google Sheet

---

## STEP 5: CONNECT CUSTOM DOMAIN (15 minutes)

### A. In Vercel:

1. Go to your project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter: `winfluencer.online`
4. Vercel will show you DNS records needed

### B. In Your Domain Registrar:

Go to where you registered `winfluencer.online` (GoDaddy, Namecheap, etc.)

Add these DNS records:

**For Root Domain:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`
- TTL: `3600`

**For WWW:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: `3600`

### C. Wait & Verify:

1. DNS can take 5 minutes to 48 hours (usually 10-30 minutes)
2. Vercel will automatically issue SSL certificate
3. Once ready, your app will be live at:
   - `https://winfluencer.online/influencer-report-generator`
   - `https://www.winfluencer.online/influencer-report-generator`

---

## STEP 6: TEST EVERYTHING (5 minutes)

### Test Checklist:

1. [ ] Visit your live URL
2. [ ] Enter campaign name
3. [ ] Add 2-3 Instagram post URLs (use real ones)
4. [ ] Enter costs
5. [ ] Click "Generate Report"
6. [ ] Wait for data to load
7. [ ] Fill out lead form
8. [ ] Check report displays
9. [ ] **IMPORTANT:** Check your Google Sheet - new row should appear!

### Test URLs:

Try these Instagram URLs:
- `https://www.instagram.com/p/CnpPou9hWqq/`
- `https://www.instagram.com/reel/C1234567890/` (any real reel)

---

## 🎉 YOU'RE DONE!

Your app is now live at:
```
https://winfluencer.online/influencer-report-generator
```

---

## TROUBLESHOOTING

### "API Error" when generating report:
- Check environment variables in Vercel
- Verify RapidAPI subscription is active
- Check Vercel logs for details

### Leads not saving to Google Sheet:
- Test webhook URL directly
- Check Apps Script permissions
- Verify webhook URL in Vercel env vars

### Domain not working:
- Wait longer (DNS can take time)
- Verify DNS records are correct
- Check Vercel domain status

### CSS/Styles broken:
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for errors

---

## WHAT HAPPENS NOW?

When someone uses your tool:
1. ✅ They generate a professional report
2. ✅ They fill out lead capture form
3. ✅ Lead automatically saves to your Google Sheet
4. ✅ You get their info (email, type, conversion interest)
5. ✅ You can follow up with hot leads!

---

## NEXT STEPS (OPTIONAL):

1. **Email Notifications:**
   - Set up Google Sheet notifications
   - Get email when new lead comes in

2. **Analytics:**
   - Add Vercel Analytics (free)
   - Track usage

3. **Improvements:**
   - Add more metrics
   - PDF download feature
   - Email automation

---

## NEED HELP?

If you get stuck, check:
1. Vercel logs (in your Vercel dashboard)
2. Browser console (F12)
3. Google Sheet Apps Script logs

---

## FILES STRUCTURE:

```
/influencer-report-app/
├── app/
│   ├── api/
│   │   ├── fetch-instagram-data/route.ts
│   │   └── capture-lead/route.ts
│   ├── page.tsx
│   ├── page.module.css
│   ├── layout.tsx
│   └── globals.css
├── package.json
├── next.config.js
├── tsconfig.json
├── .env.local (don't commit this!)
├── .gitignore
└── README.md
```

---

**READY TO DEPLOY?** 

Let me know which step you're on and if you need help! 🚀
