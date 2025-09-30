import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category } = await req.json();
    console.log('Fetching news for category:', category);

    const searchQueries = {
      educational: 'latest education news university students learning',
      job: 'latest job opportunities internships career hiring',
      all: 'latest education job internship opportunities'
    };

    const query = searchQueries[category as keyof typeof searchQueries] || searchQueries.all;
    
    // Use a news search API or web scraping
    // For now, returning mock data structure that you would populate with real API
    const mockNews = [
      {
        id: '1',
        title: 'Top Tech Companies Announce New Internship Programs for 2025',
        description: 'Major tech firms including Google, Microsoft, and Amazon have opened applications for summer 2025 internships with enhanced benefits.',
        url: 'https://example.com/news/1',
        category: 'job',
        publishedAt: new Date().toISOString(),
        source: 'Tech Career News'
      },
      {
        id: '2',
        title: 'New Online Certification Programs Launched for Data Science',
        description: 'Leading universities introduce affordable data science certifications with industry partnerships.',
        url: 'https://example.com/news/2',
        category: 'educational',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'Education Today'
      },
      {
        id: '3',
        title: 'Remote Work Opportunities Surge in Software Development',
        description: 'Analysis shows 70% increase in remote software development positions across industries.',
        url: 'https://example.com/news/3',
        category: 'job',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: 'Career Insights'
      },
      {
        id: '4',
        title: 'AI and Machine Learning Skills Most In-Demand for 2025',
        description: 'Industry report reveals AI expertise tops employer requirements for new graduates.',
        url: 'https://example.com/news/4',
        category: 'educational',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: 'Skills Report'
      }
    ];

    // Filter by category if specified
    const filteredNews = category && category !== 'all' 
      ? mockNews.filter(item => item.category === category)
      : mockNews;

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
