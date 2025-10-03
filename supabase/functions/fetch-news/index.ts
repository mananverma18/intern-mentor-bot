import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// RSS Feed URLs from Government of India sources
const RSS_FEEDS = {
  pib: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3',
};

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  publishedAt: string;
  source: string;
}

// Parse RSS XML feed
async function parseRSSFeed(url: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch RSS from ${url}: ${response.status}`);
      return [];
    }
    
    const xmlText = await response.text();
    const items: NewsItem[] = [];
    
    // Simple XML parsing for RSS items
    const itemMatches = xmlText.matchAll(/<item>([\s\S]*?)<\/item>/g);
    
    for (const match of itemMatches) {
      const itemContent = match[1];
      
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
      const descMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
      const pubDateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);
      
      if (titleMatch && linkMatch) {
        const title = titleMatch[1].trim();
        const description = descMatch ? descMatch[1].trim().substring(0, 200) : '';
        const url = linkMatch[1].trim();
        const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();
        
        // Categorize based on keywords
        const titleLower = title.toLowerCase();
        let category = 'educational';
        if (titleLower.includes('job') || titleLower.includes('recruitment') || 
            titleLower.includes('employment') || titleLower.includes('internship') ||
            titleLower.includes('hiring') || titleLower.includes('vacancy')) {
          category = 'job';
        }
        
        items.push({
          id: url.split('/').pop() || Math.random().toString(),
          title,
          description,
          url,
          category,
          publishedAt: pubDate,
          source: 'PIB India'
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error(`Error parsing RSS feed from ${url}:`, error);
    return [];
  }
}

// Get cached news or fetch fresh if needed
async function getCachedOrFreshNews(supabaseUrl: string, supabaseKey: string): Promise<NewsItem[]> {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Check for cached news (using a simple KV-like approach with a single row)
    const { data: cached, error: cacheError } = await supabase
      .from('news_cache')
      .select('*')
      .single();
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // If cache exists and is less than 24 hours old, return it
    if (!cacheError && cached && new Date(cached.updated_at) > oneDayAgo) {
      console.log('Returning cached news');
      return cached.news_data as NewsItem[];
    }
    
    console.log('Fetching fresh news from RSS feeds...');
    
    // Fetch fresh news from RSS feeds
    const pibNews = await parseRSSFeed(RSS_FEEDS.pib);
    
    // Combine and sort by date
    const allNews = [...pibNews]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 20); // Keep top 20 most recent
    
    // Update cache
    if (cached) {
      await supabase
        .from('news_cache')
        .update({ 
          news_data: allNews, 
          updated_at: now.toISOString() 
        })
        .eq('id', cached.id);
    } else {
      await supabase
        .from('news_cache')
        .insert({ 
          news_data: allNews, 
          updated_at: now.toISOString() 
        });
    }
    
    return allNews;
  } catch (error) {
    console.error('Error with cache:', error);
    // Fallback to direct RSS fetch
    return await parseRSSFeed(RSS_FEEDS.pib);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    console.log('Fetching news for category:', category);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    let news: NewsItem[] = [];
    
    if (supabaseUrl && supabaseKey) {
      news = await getCachedOrFreshNews(supabaseUrl, supabaseKey);
    } else {
      console.warn('Supabase not configured, fetching directly from RSS');
      news = await parseRSSFeed(RSS_FEEDS.pib);
    }

    // Filter by category if specified
    const filteredNews = category && category !== 'all' 
      ? news.filter(item => item.category === category)
      : news;

    return new Response(
      JSON.stringify({ news: filteredNews }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});