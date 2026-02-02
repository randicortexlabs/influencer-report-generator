'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface Post {
  url: string;
  influencer: string;
  followerCount: number;
  contentType: string;
  views: number;
  likes: number;
  comments: number;
  shares?: number; 
  postedDate: string;
  cost: number;
  engagementRate: string;
  cpm: string;
  cpe: string;
  totalEngagements: number;
}

interface ReportData {
  campaignName: string;
  posts: Post[];
  totals: {
    posts: number;
    influencers: number;
    totalCost: number;
    avgDaysActive: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalEngagements: number;
    avgCPM: string;
    avgEngagementRate: string;
    cpe: string;
  };
  generatedDate: string;
}

export default function Home() {
  const [campaignName, setCampaignName] = useState('');
  const [posts, setPosts] = useState([
    { url: '', cost: '' },
    { url: '', cost: '' }
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [showReport, setShowReport] = useState(false);
  
  // Lead form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userType, setUserType] = useState('');
  const [conversionInterest, setConversionInterest] = useState('');

  const addPost = () => {
    if (posts.length < 5) {
      setPosts([...posts, { url: '', cost: '' }]);
    }
  };

  const removePost = (index: number) => {
    if (posts.length > 2) {
      setPosts(posts.filter((_, i) => i !== index));
    }
  };

  const updatePost = (index: number, field: 'url' | 'cost', value: string) => {
    const newPosts = [...posts];
    newPosts[index][field] = value;
    setPosts(newPosts);
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignName.trim()) {
      alert('Please enter a campaign name');
      return;
    }
    
    const urls = posts.map(p => p.url).filter(u => u.trim());
    const costs = posts.map(p => parseFloat(p.cost)).filter(c => !isNaN(c));
    
    if (urls.length < 2) {
      alert('Please add at least 2 Instagram post URLs');
      return;
    }
    
    if (costs.length !== urls.length) {
      alert('Please enter costs for all posts');
      return;
    }
    
    setLoading(true);
    setLoadingText('Analyzing campaign performance...');
    
    try {
      const response = await fetch('/influencer-report-generator/api/fetch-instagram-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls, costs })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram data');
      }
      
      const { posts: fetchedPosts } = await response.json();
      
      // Calculate totals
      const totalViews = fetchedPosts.reduce((sum: number, p: Post) => sum + p.views, 0);
      const totalLikes = fetchedPosts.reduce((sum: number, p: Post) => sum + p.likes, 0);
      const totalComments = fetchedPosts.reduce((sum: number, p: Post) => sum + p.comments, 0);
      const totalCost = fetchedPosts.reduce((sum: number, p: Post) => sum + p.cost, 0);
      const totalEngagements = totalLikes + totalComments;
      
      const avgDaysActive = Math.floor(fetchedPosts.reduce((sum: number, p: Post) => {
        const days = Math.floor((Date.now() - new Date(p.postedDate).getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / fetchedPosts.length);
      
      const data: ReportData = {
        campaignName,
        posts: fetchedPosts,
        totals: {
          posts: fetchedPosts.length,
          influencers: new Set(fetchedPosts.map((p: Post) => p.influencer)).size,
          totalCost,
          avgDaysActive,
          totalViews,
          totalLikes,
          totalComments,
          totalEngagements,
          avgCPM: totalViews > 0 ? ((totalCost / totalViews) * 1000).toFixed(2) : '0.00',
          avgEngagementRate: (fetchedPosts.reduce((sum: number, p: Post) => sum + parseFloat(p.engagementRate), 0) / fetchedPosts.length).toFixed(2),
          cpe: totalEngagements > 0 ? (totalCost / totalEngagements).toFixed(2) : '0.00'
        },
        generatedDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
      
      setReportData(data);
      setLoading(false);
      setShowLeadModal(true);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating report. Please check your URLs and try again.');
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !userType || !conversionInterest) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch('/influencer-report-generator/api/capture-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          userType,
          conversionInterest,
          campaignName: reportData?.campaignName,
          totalInvestment: reportData?.totals.totalCost
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save lead');
      }
      
      setShowLeadModal(false);
      setShowReport(true);
      window.scrollTo(0, 0);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving your information. Please try again.');
    }
  };

  const handleDownloadPDF = async () => {
    // Simple approach: Use browser's print to PDF
    window.print();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <h2>{loadingText}</h2>
      </div>
    );
  }

 if (showReport && reportData) {
    return (
      <div className={styles.reportContainer}>
        <div className={styles.report} id="campaign-report">
          <div className={styles.reportHeader}>
            <h1>Campaign Performance Report</h1>
            <p className={styles.campaignName}>{reportData.campaignName}</p>
            <p className={styles.reportMeta}>
              {reportData.generatedDate} • {reportData.totals.posts} Posts • {reportData.totals.influencers} Influencers
            </p>
          </div>
          
          <div className={styles.reportContent}>
            <section>
              <h2>Campaign Summary</h2>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryLabel}>TOTAL POSTS</div>
                  <div className={styles.summaryValue}>{reportData.totals.posts}</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryLabel}>INFLUENCERS</div>
                  <div className={styles.summaryValue}>{reportData.totals.influencers}</div>
                </div>
                <div className={`${styles.summaryCard} ${styles.accent}`}>
                  <div className={styles.summaryLabel}>TOTAL INVESTMENT</div>
                  <div className={styles.summaryValue}>${reportData.totals.totalCost.toLocaleString()}</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryLabel}>AVG. DAYS ACTIVE</div>
                  <div className={styles.summaryValue}>{reportData.totals.avgDaysActive}</div>
                </div>
              </div>
            </section>
            
            <section>
              <h2>Total Campaign Reach</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{reportData.totals.totalViews.toLocaleString()}</div>
                  <div className={styles.statLabel}>TOTAL VIEWS</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{reportData.totals.totalLikes.toLocaleString()}</div>
                  <div className={styles.statLabel}>TOTAL LIKES</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>{reportData.totals.totalComments.toLocaleString()}</div>
                  <div className={styles.statLabel}>TOTAL COMMENTS</div>
                </div>
              </div>
            </section>

            <section>
              <h2>Engagement Performance</h2>
              <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{reportData.totals.totalEngagements.toLocaleString()}</div>
                  <div className={styles.metricLabel}>TOTAL ENGAGEMENTS</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{reportData.totals.avgEngagementRate}%</div>
                  <div className={styles.metricLabel}>AVG ENGAGEMENT RATE</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>${reportData.totals.avgCPM}</div>
                  <div className={styles.metricLabel}>AVG CPM</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>${reportData.totals.cpe}</div>
                  <div className={styles.metricLabel}>AVG COST PER ENGAGEMENT</div>
                </div>
              </div>
            </section>

            <section>
              <h2>Influencer Performance Breakdown</h2>
              {reportData.posts.map((post, index) => (
                <div key={index} className={styles.influencerCard}>
                  <div className={styles.influencerHeader}>
                    <div>
                      <h3>{post.influencer}</h3>
                      <span className={styles.platformBadge}>{post.contentType.toUpperCase()}</span>
                    </div>
                    <div className={styles.influencerCost}>
                      Investment: ${post.cost.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className={styles.influencerStats}>
                    <div className={styles.influencerStatItem}>
                      <div className={styles.influencerStatLabel}>Views</div>
                      <div className={styles.influencerStatValue}>{post.views.toLocaleString()}</div>
                    </div>
                    <div className={styles.influencerStatItem}>
                      <div className={styles.influencerStatLabel}>Likes</div>
                      <div className={styles.influencerStatValue}>
                        {post.likes === -1 ? 'Hidden' : post.likes.toLocaleString()}
                      </div>
                    </div>
                    <div className={styles.influencerStatItem}>
                      <div className={styles.influencerStatLabel}>Comments</div>
                      <div className={styles.influencerStatValue}>{post.comments.toLocaleString()}</div>
                    </div>
                    {post.shares && (
                      <div className={styles.influencerStatItem}>
                        <div className={styles.influencerStatLabel}>Shares</div>
                        <div className={styles.influencerStatValue}>{post.shares.toLocaleString()}</div>
                      </div>
                    )}
                  </div>

                  <div className={styles.influencerMetrics}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricItemLabel}>Engagement Rate:</span>
                      <span className={styles.metricItemValue}>{post.engagementRate}%</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricItemLabel}>CPM:</span>
                      <span className={styles.metricItemValue}>${post.cpm}</span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricItemLabel}>Cost per Engagement:</span>
                      <span className={styles.metricItemValue}>${post.cpe}</span>
                    </div>
                  </div>
                </div>
              ))}
            </section>
            
            <section className={styles.missingSection}>
              <h2>Critical Metrics Still Unknown</h2>
              <p>This campaign generated significant engagement, but engagement doesn't pay the bills.</p>
              <div className={styles.comparisonGrid}>
                <div className={styles.comparisonCard}>
                  <h3>CURRENT VIEW</h3>
                  <p>✓ {reportData.totals.totalViews.toLocaleString()} views</p>
                  <p>✓ {reportData.totals.totalLikes.toLocaleString()} likes</p>
                  <p>✓ {reportData.totals.avgEngagementRate}% engagement</p>
                  <p className={styles.unknown}>? Revenue: UNKNOWN</p>
                  <p className={styles.unknown}>? Conversions: UNKNOWN</p>
                  <p className={styles.unknown}>? ROI: UNKNOWN</p>
                </div>
                <div className={`${styles.comparisonCard} ${styles.withWinfluencer}`}>
                  <h3>WITH WINFLUENCER</h3>
                  <p>✓ {reportData.totals.totalViews.toLocaleString()} views</p>
                  <p>✓ {reportData.totals.totalLikes.toLocaleString()} likes</p>
                  <p>✓ {reportData.totals.avgEngagementRate}% engagement</p>
                  <p className={styles.known}>✓ Revenue: $18,450</p>
                  <p className={styles.known}>✓ Conversions: 127</p>
                  <p className={styles.known}>✓ ROI: 576%</p>
                </div>
              </div>
              <a href="https://winfluencer.online" className={styles.ctaButton}>
                START TRACKING CONVERSIONS
              </a>
            </section>
          </div>
          
          <div className={styles.reportFooter}>
            <p>Generated by Winfluencer's Campaign Analyzer</p>
            <p className={styles.brand}>WINFLUENCER.ONLINE</p>
          </div>
        </div>
        
        <div className={styles.actionButtons}>
          <button 
            onClick={handleDownloadPDF} 
            className={styles.downloadBtn}
          >
            📥 Download PDF Report
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.newReportBtn}
          >
            Generate New Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {showLeadModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Download Your Campaign Report</h2>
            <p>Get your free professional report and discover how to track actual conversions</p>
            
            <form onSubmit={handleLeadSubmit}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                  placeholder="John Smith"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Email Address *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="john@company.com"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>I am a: *</label>
                <div className={styles.radioGroup}>
                  {['Brand/Company', 'Influencer Marketing Agency', 'Creator/Influencer', 'Other'].map((type, i) => (
                    <label key={i} className={styles.radioOption}>
                      <input 
                        type="radio" 
                        name="userType" 
                        value={type.toLowerCase().replace(/[^a-z]/g, '')}
                        checked={userType === type.toLowerCase().replace(/[^a-z]/g, '')}
                        onChange={(e) => setUserType(e.target.value)}
                        required 
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Are you interested in tracking actual conversions and revenue? *</label>
                <div className={styles.radioGroup}>
                  {[
                    { label: 'Yes - I want to track ROI', value: 'yes' },
                    { label: 'Maybe - Tell me more', value: 'maybe' },
                    { label: 'No - Just engagement metrics', value: 'no' }
                  ].map((option, i) => (
                    <label key={i} className={styles.radioOption}>
                      <input 
                        type="radio" 
                        name="conversionInterest" 
                        value={option.value}
                        checked={conversionInterest === option.value}
                        onChange={(e) => setConversionInterest(e.target.value)}
                        required 
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button type="submit" className={styles.primaryBtn}>
                View Report
              </button>
              
              <p className={styles.privacyNotice}>
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </div>
      )}
      
      <div className={styles.hero}>
        <h1>Free Influencer Campaign Report Generator</h1>
        <p>Create professional reports in 60 seconds</p>
        <p className={styles.subtitle}>Instagram & TikTok • No signup required • Up to 5 posts</p>
      </div>
      
      <div className={styles.formContainer}>
        <form onSubmit={handleGenerateReport}>
          <div className={styles.formGroup}>
            <label>Campaign Name *</label>
            <input 
              type="text" 
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required 
              placeholder="Summer Product Launch"
              minLength={3}
            />
          </div>
          
          <div className={styles.postsContainer}>
            {posts.map((post, index) => (
              <div key={index} className={styles.postEntry}>
                <div className={styles.postHeader}>
                  <span className={styles.postNumber}>POST {index + 1}</span>
                  {posts.length > 2 && (
                    <button 
                      type="button" 
                      onClick={() => removePost(index)}
                      className={styles.removeBtn}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className={styles.formGroup}>
                  <label>Instagram or TikTok URL *</label>
                  <input 
                    type="url" 
                    value={post.url}
                    onChange={(e) => updatePost(index, 'url', e.target.value)}
                    required 
                    placeholder="https://www.instagram.com/p/... or https://www.tiktok.com/@user/video/..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Campaign Cost ($) *</label>
                  <input 
                    type="number" 
                    value={post.cost}
                    onChange={(e) => updatePost(index, 'cost', e.target.value)}
                    required 
                    placeholder="500"
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {posts.length < 5 && (
            <button 
              type="button" 
              onClick={addPost}
              className={styles.addPostBtn}
            >
              + Add Another Post
            </button>
          )}
          
          <button type="submit" className={styles.primaryBtn}>
            Generate Free Report
          </button>
        </form>
      </div>
    </div>
  );
}
