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

    // Mock news from Indian government and reliable sources
    // In production, integrate with actual APIs from these sources
    const mockNews = [
      {
        id: '1',
        title: 'Ministry of Education Launches New Scholarship Scheme for Engineering Students',
        description: 'The Central Government announces ₹5000 crore scholarship program for meritorious students in technical education, covering tuition and living expenses.',
        url: 'https://mhrd.gov.in',
        category: 'educational',
        publishedAt: new Date().toISOString(),
        source: 'Ministry of Education'
      },
      {
        id: '2',
        title: 'National Career Service Portal Lists 50,000+ New Job Openings',
        description: 'NCS Portal updates database with opportunities across government and private sectors, including PSUs and startups. Special focus on fresh graduates.',
        url: 'https://ncs.gov.in',
        category: 'job',
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: 'NCS Portal'
      },
      {
        id: '3',
        title: 'AICTE Approves 200+ New Technical Courses for 2025-26',
        description: 'All India Council for Technical Education approves new industry-aligned courses in AI, Data Science, Cybersecurity, and Green Technologies.',
        url: 'https://aicte-india.org',
        category: 'educational',
        publishedAt: new Date(Date.now() - 7200000).toISOString(),
        source: 'AICTE'
      },
      {
        id: '4',
        title: 'PM Internship Scheme: 1 Lakh Opportunities in Top Companies',
        description: 'MyGov announces expansion of PM Internship Scheme with leading Indian companies offering stipends up to ₹50,000/month for students.',
        url: 'https://mygov.in',
        category: 'job',
        publishedAt: new Date(Date.now() - 10800000).toISOString(),
        source: 'MyGov India'
      },
      {
        id: '5',
        title: 'Skill India Mission Launches Free Certification Programs',
        description: 'Government initiative offers free online certification in 100+ skills including coding, digital marketing, and entrepreneurship.',
        url: 'https://skillindia.gov.in',
        category: 'educational',
        publishedAt: new Date(Date.now() - 14400000).toISOString(),
        source: 'Skill India'
      },
      {
        id: '6',
        title: 'Public Sector Undertakings Announce Campus Recruitment Drive',
        description: 'PSUs including ONGC, BHEL, and NTPC to recruit 10,000+ engineers through campus placements across India.',
        url: 'https://pib.gov.in',
        category: 'job',
        publishedAt: new Date(Date.now() - 18000000).toISOString(),
        source: 'PIB India'
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
