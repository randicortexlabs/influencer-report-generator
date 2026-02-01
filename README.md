# Influencer Report Generator

A professional influencer marketing campaign report generator built with Next.js.

## Features

✅ Generate professional campaign reports
✅ Instagram post data fetching via RapidAPI
✅ Lead capture with Google Sheets integration
✅ Responsive design
✅ Clean, professional aesthetic

## Prerequisites

- Node.js 18+ installed
- RapidAPI account with Instagram Scraper 2025-1 API
- Vercel account (for deployment)
- Domain: winfluencer.online

## Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create `.env.local` file:
```env
RAPIDAPI_KEY=d5b4bfaf00msh6ba4b0c0e49c39bp15b39cjsncb0aba43fdcc
RAPIDAPI_HOST=instagram-scraper-20251.p.rapidapi.com
GOOGLE_SHEETS_WEBHOOK_URL=
NEXT_PUBLIC_MOCK_MODE=false
```

3. **Run development server:**
```bash
npm run dev
```

Open http://localhost:3000/influencer-report-generator

## Google Sheets Integration

### Option 1: Using SheetDB (Easiest)

1. Go to https://sheetdb.io/
2. Sign up for free account
3. Create new API from Google Sheet
4. Copy the API URL
5. Add to `.env.local`:
```env
GOOGLE_SHEETS_WEBHOOK_URL=https://sheetdb.io/api/v1/YOUR_SHEET_ID
```

### Option 2: Using Google Apps Script

1. Create new Google Sheet with columns:
   - timestamp
   - fullName
   - email
   - phone
   - userType
   - conversionInterest
   - campaignName
   - totalInvestment

2. Go to Extensions → Apps Script

3. Paste this code:
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp,
    data.fullName,
    data.email,
    data.phone,
    data.userType,
    data.conversionInterest,
    data.campaignName,
    data.totalInvestment
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy → New deployment → Web app
5. Execute as: Me
6. Who has access: Anyone
7. Copy the web app URL
8. Add to `.env.local`

## Deployment to Vercel

### Step 1: Push to GitHub

1. Initialize git:
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create GitHub repository
3. Push code:
```bash
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables:
   - `RAPIDAPI_KEY`
   - `RAPIDAPI_HOST`
   - `GOOGLE_SHEETS_WEBHOOK_URL`
   - `NEXT_PUBLIC_MOCK_MODE`

6. Click "Deploy"

### Step 3: Connect Custom Domain

1. In Vercel project settings → Domains
2. Add domain: `winfluencer.online`
3. Add DNS records as shown by Vercel:
   - Type: A
   - Name: @
   - Value: 76.76.21.21
   
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

4. The app will be accessible at:
   - `https://winfluencer.online/influencer-report-generator`
   - `https://www.winfluencer.online/influencer-report-generator`

## Project Structure

```
/app
  /api
    /fetch-instagram-data
      route.ts          # Instagram API integration
    /capture-lead
      route.ts          # Lead capture endpoint
  page.tsx              # Main app component
  page.module.css       # Styles
  layout.tsx            # Root layout
  globals.css           # Global styles
next.config.js          # Next.js config with basePath
package.json
.env.local
```

## Troubleshooting

### CORS Errors
- Make sure you're running through `npm run dev`, not opening HTML directly
- Vercel deployment automatically handles CORS

### API Not Working
- Check `.env.local` has correct API key
- Verify RapidAPI subscription is active
- Check console for error messages

### Domain Not Working
- Verify DNS records are correct
- Wait 24-48 hours for DNS propagation
- Check Vercel dashboard for domain status

## Testing

### Test with Mock Data
Set in `.env.local`:
```env
NEXT_PUBLIC_MOCK_MODE=true
```

### Test with Real API
Set in `.env.local`:
```env
NEXT_PUBLIC_MOCK_MODE=false
```

Use real Instagram URLs like:
- `https://www.instagram.com/p/CnpPou9hWqq/`

## Support

For issues or questions, contact: your-email@winfluencer.com

## License

Proprietary - Winfluencer
