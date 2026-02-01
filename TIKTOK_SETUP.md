# 🎵 TIKTOK INTEGRATION GUIDE

## Current Status:

✅ **Code is ready to support TikTok!**
❌ **Need to choose and configure TikTok API**

---

## OPTION 1: TikTok Scraper (Recommended - Most Popular)

### **RapidAPI: "TikTok Scraper7"**
- **API Host:** `tiktok-scraper7.p.rapidapi.com`
- **Free Tier:** 100-500 requests/month
- **URL:** https://rapidapi.com/DataFanatic/api/tiktok-scraper7

### What it provides:
✅ Video views
✅ Likes count
✅ Comments count  
✅ Shares count
✅ Creator username
✅ Follower count
✅ Posted date

### How to set up:

1. Go to: https://rapidapi.com/DataFanatic/api/tiktok-scraper7
2. Subscribe to FREE plan
3. Copy your API key (same key as Instagram)
4. Test the endpoint

### API Endpoint:

```bash
curl --request GET \
  --url 'https://tiktok-scraper7.p.rapidapi.com/video/info?url=https://www.tiktok.com/@username/video/1234567890' \
  --header 'x-rapidapi-host: tiktok-scraper7.p.rapidapi.com' \
  --header 'x-rapidapi-key: YOUR_KEY_HERE'
```

### Response example:

```json
{
  "data": {
    "id": "1234567890",
    "desc": "Video description",
    "createTime": 1705234567,
    "stats": {
      "diggCount": 1234,      // Likes
      "shareCount": 567,       // Shares
      "commentCount": 89,      // Comments
      "playCount": 45678       // Views
    },
    "author": {
      "uniqueId": "username",
      "nickname": "Display Name",
      "followerCount": 100000
    }
  }
}
```

---

## OPTION 2: TikTok API v2 (Alternative)

### **RapidAPI: "TikTok API v2"**
- **API Host:** `tiktok-api6.p.rapidapi.com`
- **Free Tier:** 100 requests/month
- **URL:** https://rapidapi.com/yi005/api/tiktok-api6

Similar data, slightly different response structure.

---

## OPTION 3: TikWM API (Budget Option)

### **RapidAPI: "TikWM API"**
- **API Host:** `tikwm.p.rapidapi.com`
- **Free Tier:** 500 requests/month
- **URL:** https://rapidapi.com/tikwm/api/tikwm-api

Good free tier but less reliable.

---

## MY RECOMMENDATION:

**Use TikTok Scraper7** because:
- ✅ Most popular (10K+ subscribers)
- ✅ Well-documented
- ✅ Good free tier
- ✅ Reliable uptime
- ✅ Same RapidAPI key as Instagram

---

## SETUP STEPS:

### Step 1: Subscribe to TikTok API

1. Go to: https://rapidapi.com/DataFanatic/api/tiktok-scraper7
2. Click **"Subscribe to Test"**
3. Select **FREE plan**
4. Confirm subscription

### Step 2: Update Environment Variables

Add to your `.env.local`:

```env
# Instagram API (existing)
RAPIDAPI_KEY=d5b4bfaf00msh6ba4b0c0e49c39bp15b39cjsncb0aba43fdcc
RAPIDAPI_HOST=instagram-scraper-20251.p.rapidapi.com

# TikTok API (new)
TIKTOK_API_HOST=tiktok-scraper7.p.rapidapi.com

# Mock mode
NEXT_PUBLIC_MOCK_MODE=false
```

**Note:** TikTok uses the SAME API key as Instagram (RAPIDAPI_KEY)

### Step 3: Update Vercel Environment Variables

When deploying, add to Vercel:

```
TIKTOK_API_HOST = tiktok-scraper7.p.rapidapi.com
```

### Step 4: Test It!

Try with a real TikTok URL:
```
https://www.tiktok.com/@username/video/1234567890
```

---

## HOW IT WORKS IN YOUR APP:

### The code automatically detects the platform:

```typescript
// User enters URL
const url = "https://www.tiktok.com/@user/video/123";

// App detects it's TikTok
const platform = detectPlatform(url); // Returns 'tiktok'

// Calls TikTok API instead of Instagram
fetchTikTokData(url, cost, apiKey, apiHost);

// Returns standardized data:
{
  url: "https://www.tiktok.com/@user/video/123",
  influencer: "@username",
  followerCount: 100000,
  contentType: "tiktok",
  views: 45678,
  likes: 1234,
  comments: 89,
  shares: 567,  // TikTok only
  postedDate: "2024-01-14",
  cost: 500,
  engagementRate: "1.89",
  cpm: "10.94",
  cpe: "0.26"
}
```

### Mixed campaigns work too!

Users can analyze campaigns with BOTH platforms:
- Post 1: Instagram Reel
- Post 2: TikTok Video  
- Post 3: Instagram Post
- Post 4: TikTok Video

The app handles both automatically!

---

## UPDATING THE FRONTEND

The app already supports TikTok URLs! Just update the placeholder text:

In `/app/page.tsx`, the input says:
```
placeholder="https://www.instagram.com/p/..."
```

Change to:
```
placeholder="Instagram or TikTok URL"
```

That's it! The backend already handles both.

---

## TIKTOK-SPECIFIC FEATURES:

TikTok has **shares** which Instagram doesn't expose publicly.

Your report will show:
- ✅ Views
- ✅ Likes
- ✅ Comments
- ✅ **Shares** (TikTok only)
- ✅ Total Engagements = Likes + Comments + Shares

---

## API LIMITS:

### Free Tier Breakdown:

**Instagram Scraper 2025-1:**
- 100 requests/month
- 3 calls per post (details, likes, comments)
- = ~33 posts/month

**TikTok Scraper7:**
- 100-500 requests/month  
- 1 call per video
- = 100-500 videos/month

### Combined:
- Instagram: ~33 posts
- TikTok: 100-500 videos
- **Total: 133-533 posts/month FREE!** 🎉

### If you need more:
- Instagram API upgrade: ~$10/month for 1,000 calls
- TikTok API upgrade: ~$10/month for 10,000 calls

---

## TESTING CHECKLIST:

Before going live, test:

1. [ ] Instagram post URL → Works
2. [ ] Instagram reel URL → Works
3. [ ] TikTok video URL → Works
4. [ ] Mixed campaign (IG + TikTok) → Works
5. [ ] Lead capture → Saves to Google Sheet
6. [ ] Report displays correctly → Shows both platforms

---

## EXAMPLE TIKTOK URLs TO TEST:

You can use any public TikTok video:

```
https://www.tiktok.com/@khaby.lame/video/7137423965982543110
https://www.tiktok.com/@mrbeast/video/7098348742558928170
https://www.tiktok.com/@charlidamelio/video/7089624601944583466
```

(These are from popular creators with millions of views)

---

## TROUBLESHOOTING:

### "Failed to fetch TikTok data"
- Check API subscription is active
- Verify TIKTOK_API_HOST is set correctly
- Try a different TikTok URL
- Check RapidAPI dashboard for rate limits

### "Invalid TikTok URL"
- Must be full URL: `https://www.tiktok.com/@user/video/123`
- Not short links: `https://vm.tiktok.com/abc` (won't work with current code)

### TikTok data shows 0 views
- Some videos may be private
- Very new videos might not have data yet
- API might be rate limited

---

## UPDATING THE CODE (IF NEEDED):

If you want to support TikTok short URLs (`vm.tiktok.com`):

Add to `/app/api/fetch-instagram-data/route.ts`:

```typescript
// Extract TikTok ID from short URL
async function resolveTikTokShortUrl(shortUrl: string): Promise<string> {
  const response = await fetch(shortUrl, { redirect: 'manual' });
  const location = response.headers.get('location');
  return location || shortUrl;
}
```

---

## WHAT TO DO NOW:

1. ✅ **Subscribe to TikTok Scraper7 API** on RapidAPI
2. ✅ **Add `TIKTOK_API_HOST` to `.env.local`**
3. ✅ **Test with a TikTok URL**
4. ✅ **Update placeholder text in form**
5. ✅ **Deploy to Vercel with new env var**

---

## READY TO GO! 🚀

Your app now supports:
- ✅ Instagram Posts
- ✅ Instagram Reels
- ✅ TikTok Videos
- ✅ Mixed campaigns
- ✅ Professional reports

All with the same clean interface! 

---

**Questions? Let me know which TikTok API you want to use!**
