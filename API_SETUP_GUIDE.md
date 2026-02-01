# 📱 UPDATED API SETUP GUIDE

## APIs We're Using:

### ✅ Instagram Looter2
- **URL:** https://rapidapi.com/irrors-apis/api/instagram-looter2
- **Host:** `instagram-looter2.p.rapidapi.com`
- **Endpoint:** `/post?url={instagram_url}`
- **Free Tier:** Check RapidAPI for current limits

### ✅ TikTok Scraper7  
- **URL:** https://rapidapi.com/tikwm-tikwm-default/api/tiktok-scraper7
- **Host:** `tiktok-scraper7.p.rapidapi.com`
- **Endpoint:** `/?url={tiktok_url}`
- **Free Tier:** Check RapidAPI for current limits

---

## 🔑 GOOD NEWS: Same API Key for Both!

You only need **ONE API key** that works for both Instagram and TikTok!

**Your API Key:** `d5b4bfaf00msh6ba4b0c0e49c39bp15b39cjsncb0aba43fdcc`

---

## 📋 Setup Steps:

### Step 1: Subscribe to Instagram Looter2

1. Go to: https://rapidapi.com/irrors-apis/api/instagram-looter2
2. Click **"Subscribe to Test"**
3. Select **FREE plan**
4. Confirm subscription

### Step 2: Subscribe to TikTok Scraper7

1. Go to: https://rapidapi.com/tikwm-tikwm-default/api/tiktok-scraper7
2. Click **"Subscribe to Test"**  
3. Select **FREE plan**
4. Confirm subscription

### Step 3: Verify Your API Key

Your API key is already in the code:
```
d5b4bfaf00msh6ba4b0c0e49c39bp15b39cjsncb0aba43fdcc
```

This same key works for BOTH APIs! ✅

---

## 📊 What Data We Get:

### Instagram (via Instagram Looter2):
```json
{
  "status": true,
  "owner": {
    "username": "theleanseven",
    "edge_followed_by": {
      "count": 4075
    }
  },
  "edge_media_preview_like": {
    "count": -1  // Likes (Instagram hides counts)
  },
  "edge_media_to_comment": {
    "count": 5
  },
  "video_view_count": 447,
  "video_play_count": 1130,
  "product_type": "clips",
  "taken_at_timestamp": 1765654200
}
```

**What we extract:**
- ✅ Username
- ✅ Follower count
- ✅ Likes (if available)
- ✅ Comments count
- ✅ Views (for reels/videos)
- ✅ Content type (post/reel)
- ✅ Posted date

### TikTok (via TikTok Scraper7):
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "aweme_id": "v14044g50000d4b4evnog65t79jhu700",
    "play_count": 7457771,
    "digg_count": 517464,
    "comment_count": 2590,
    "share_count": 10465,
    "author": {
      "unique_id": "looooooooch",
      "nickname": "leah halton"
    },
    "create_time": 1763067789
  }
}
```

**What we extract:**
- ✅ Username
- ✅ Views (play_count)
- ✅ Likes (digg_count)
- ✅ Comments
- ✅ **Shares** (TikTok only!)
- ✅ Posted date

---

## 🎯 How It Works in Your App:

### User enters URLs:
```
Post 1: https://www.instagram.com/reel/DSNydxQErX-/
Post 2: https://www.tiktok.com/@looooooooch/video/7572318478087032072
```

### App detects platform and calls correct API:
```typescript
// Instagram URL → Instagram Looter2
GET https://instagram-looter2.p.rapidapi.com/post?url=https://www.instagram.com/reel/DSNydxQErX-/

// TikTok URL → TikTok Scraper7
GET https://tiktok-scraper7.p.rapidapi.com/?url=https://www.tiktok.com/@looooooooch/video/7572318478087032072
```

### Returns standardized data:
```javascript
{
  url: "...",
  influencer: "@theleanseven",
  followerCount: 4075,
  contentType: "reel", // or "post" or "tiktok"
  views: 1130,
  likes: 517464,
  comments: 2590,
  shares: 10465, // TikTok only
  cost: 500,
  engagementRate: "12.67",
  cpm: "0.44",
  cpe: "0.001"
}
```

---

## ⚠️ Important Notes:

### Instagram Likes:
Instagram now hides like counts on many posts. The API returns `-1` when likes are hidden.
- If `edge_media_preview_like.count === -1` → We show "Hidden"
- We can still get comments and views!

### TikTok Follower Count:
TikTok Scraper7 doesn't provide follower count in the video endpoint.
- `followerCount` will be `0` for TikTok posts
- We can still calculate CPM and cost per engagement!

### API Rate Limits:
- Check your RapidAPI dashboard for current limits
- Free tier usually: 100-500 requests/month
- Each Instagram post = 1 API call
- Each TikTok video = 1 API call

---

## 🧪 Testing:

### Test Instagram URL:
```
https://www.instagram.com/reel/DSNydxQErX-/
```

Expected response:
- Username: @theleanseven
- Followers: 4,075
- Views: 1,130
- Content type: reel

### Test TikTok URL:
```
https://www.tiktok.com/@looooooooch/video/7572318478087032072
```

Expected response:
- Username: @looooooooch
- Views: 7,457,771
- Likes: 517,464
- Comments: 2,590
- Shares: 10,465

---

## 🚀 Deployment Variables:

### Local (.env.local):
```env
RAPIDAPI_KEY=d5b4bfaf00msh6ba4b0c0e49c39bp15b39cjsncb0aba43fdcc
GOOGLE_SHEETS_WEBHOOK_URL=your_webhook_here
NEXT_PUBLIC_MOCK_MODE=false
```

### Vercel (Environment Variables):
```
RAPIDAPI_KEY = d5b4bfaf00msh6ba4b0c0e49c39bp15b39cjsncb0aba43fdcc
GOOGLE_SHEETS_WEBHOOK_URL = your_webhook_here
NEXT_PUBLIC_MOCK_MODE = false
```

That's it! Much simpler than before - just ONE API key! 🎉

---

## 🐛 Troubleshooting:

### "Failed to fetch Instagram data"
- Make sure you're subscribed to Instagram Looter2
- Check the URL is a valid Instagram post/reel URL
- Verify API key is correct
- Check RapidAPI dashboard for rate limits

### "Failed to fetch TikTok data"  
- Make sure you're subscribed to TikTok Scraper7
- Check the URL is a valid TikTok video URL
- Verify API key is correct
- Check RapidAPI dashboard for rate limits

### "API returned error status"
- The API request succeeded but returned an error
- Check if the post/video is public
- Try a different URL
- Check API response in browser console

---

## ✅ Ready to Deploy!

Your app now supports:
- ✅ Instagram Posts
- ✅ Instagram Reels  
- ✅ TikTok Videos
- ✅ Mixed campaigns
- ✅ Same API key for both!

Much cleaner and simpler! 🚀
