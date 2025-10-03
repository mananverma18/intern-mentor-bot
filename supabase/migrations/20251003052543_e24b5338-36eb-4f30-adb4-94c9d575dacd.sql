-- Create table for caching news data with daily refresh
CREATE TABLE IF NOT EXISTS public.news_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on updated_at for efficient cache checking
CREATE INDEX IF NOT EXISTS idx_news_cache_updated_at ON public.news_cache(updated_at);

-- RLS policies (public read access since news is public information)
ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News cache is publicly readable"
ON public.news_cache
FOR SELECT
USING (true);

-- Only edge functions can update the cache (via service role)
CREATE POLICY "Service role can manage news cache"
ON public.news_cache
FOR ALL
USING (true)
WITH CHECK (true);