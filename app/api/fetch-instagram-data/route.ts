import { NextRequest, NextResponse } from 'next/server';

// Detect platform from URL
function detectPlatform(url: string): 'instagram' | 'tiktok' | 'unknown' {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const { urls, costs } = await request.json();
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'Invalid URLs provided' },
        { status: 400 }
      );
    }

    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
    const INSTAGRAM_API_HOST = 'instagram-looter2.p.rapidapi.com';
    const TIKTOK_API_HOST = 'tiktok-scraper7.p.rapidapi.com';
    const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

    // Mock data for testing
    if (MOCK_MODE) {
      const posts = urls.map((url: string, index: number) => {
        const views = Math.floor(Math.random() * 80000) + 20000;
        const likes = Math.floor(Math.random() * 4000) + 1000;
        const comments = Math.floor(Math.random() * 300) + 50;
        const followers = Math.floor(Math.random() * 150000) + 50000;
        const cost = costs[index];
        const platform = detectPlatform(url);
        
        return {
          url,
          influencer: `@influencer_${index + 1}`,
          followerCount: followers,
          contentType: platform === 'tiktok' ? 'tiktok' : ['reel', 'post'][Math.floor(Math.random() * 2)],
          views,
          likes,
          comments,
          shares: platform === 'tiktok' ? Math.floor(Math.random() * 500) : undefined,
          postedDate: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
          cost,
          engagementRate: ((likes + comments) / followers * 100).toFixed(2),
          cpm: ((cost / views) * 1000).toFixed(2),
          cpe: (cost / (likes + comments)).toFixed(2),
          totalEngagements: likes + comments
        };
      });
      
      return NextResponse.json({ posts });
    }

    // Real API calls
    const posts = [];
    
    for (let i = 0; i < urls.length; i++) {
      try {
        const url = urls[i];
        const cost = costs[i];
        const platform = detectPlatform(url);
        
        if (platform === 'unknown') {
          console.error(`Unsupported platform for URL: ${url}`);
          continue;
        }
        
        let postData;
        
        if (platform === 'instagram') {
          postData = await fetchInstagramData(url, cost, RAPIDAPI_KEY, INSTAGRAM_API_HOST);
        } else if (platform === 'tiktok') {
          postData = await fetchTikTokData(url, cost, RAPIDAPI_KEY, TIKTOK_API_HOST);
        }
        
        if (postData) {
          posts.push(postData);
        }
        
      } catch (error) {
        console.error(`Error fetching data for URL ${urls[i]}:`, error);
      }
    }
    
    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch data for all posts' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ posts });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Instagram Looter2 API fetching function
async function fetchInstagramData(url: string, cost: number, apiKey: string, apiHost: string) {
  console.log(`Fetching Instagram data for URL: ${url}`);
  
  // Instagram Looter2 API endpoint
  const response = await fetch(
    `https://${apiHost}/post?url=${encodeURIComponent(url)}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': apiHost,
        'x-rapidapi-key': apiKey
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Instagram fetch failed: ${response.status}`);
  }
  
  const result = await response.json();
  
  // Check if request was successful
  if (!result.status) {
    throw new Error('Instagram API returned error status');
  }
  
  const data = result;
  
  // Extract owner information
  const owner = data.owner || {};
  const influencerName = owner.username || 'Unknown';
  const followerCount = owner.edge_followed_by?.count || 0;
  
  // Extract engagement metrics
  const likesCount = data.edge_media_preview_like?.count || 0;
  const commentsCount = data.edge_media_to_comment?.count || 0;
  
  // Extract views (for videos/reels)
  const viewsCount = data.video_view_count || data.video_play_count || 0;
  
  // Determine content type
  let contentType = 'post';
  if (data.is_video || data.product_type === 'clips') {
    contentType = 'reel';
  }
  
  // Get posted date
  const postedDate = data.taken_at_timestamp 
    ? new Date(data.taken_at_timestamp * 1000).toISOString()
    : new Date().toISOString();
  
  const engagements = likesCount + commentsCount;
  
  return {
    url,
    influencer: '@' + influencerName,
    followerCount,
    contentType,
    views: viewsCount,
    likes: likesCount,
    comments: commentsCount,
    postedDate,
    cost,
    engagementRate: followerCount > 0 ? ((engagements / followerCount) * 100).toFixed(2) : '0.00',
    cpm: viewsCount > 0 ? ((cost / viewsCount) * 1000).toFixed(2) : '0.00',
    cpe: engagements > 0 ? (cost / engagements).toFixed(2) : '0.00',
    totalEngagements: engagements
  };
}

// TikTok Scraper7 API fetching function
async function fetchTikTokData(url: string, cost: number, apiKey: string, apiHost: string) {
  console.log(`Fetching TikTok data for URL: ${url}`);
  
  // TikTok Scraper7 API endpoint
  const response = await fetch(
    `https://${apiHost}/?url=${encodeURIComponent(url)}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': apiHost,
        'x-rapidapi-key': apiKey
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`TikTok fetch failed: ${response.status}`);
  }
  
  const result = await response.json();
  
  // Check if request was successful
  if (result.code !== 0) {
    throw new Error(`TikTok API error: ${result.msg || 'Unknown error'}`);
  }
  
  const data = result.data;
  
  // Extract metrics
  const likesCount = data.digg_count || 0;
  const commentsCount = data.comment_count || 0;
  const sharesCount = data.share_count || 0;
  const viewsCount = data.play_count || 0;
  
  // Extract author information
  const author = data.author || {};
  const influencerName = author.unique_id || author.nickname || 'Unknown';
  const followerCount = 0; // TikTok Scraper7 doesn't provide follower count in video endpoint
  
  // Get posted date
  const postedDate = data.create_time 
    ? new Date(data.create_time * 1000).toISOString()
    : new Date().toISOString();
  
  // TikTok counts shares as engagement too
  const engagements = likesCount + commentsCount + sharesCount;
  
  return {
    url,
    influencer: '@' + influencerName,
    followerCount,
    contentType: 'tiktok',
    views: viewsCount,
    likes: likesCount,
    comments: commentsCount,
    shares: sharesCount,
    postedDate,
    cost,
    engagementRate: followerCount > 0 ? ((engagements / followerCount) * 100).toFixed(2) : '0.00',
    cpm: viewsCount > 0 ? ((cost / viewsCount) * 1000).toFixed(2) : '0.00',
    cpe: engagements > 0 ? (cost / engagements).toFixed(2) : '0.00',
    totalEngagements: engagements
  };
}
