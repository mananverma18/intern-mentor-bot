import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Newspaper, Briefcase, GraduationCap, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'educational' | 'job';
  publishedAt: string;
  source: string;
}

export const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const fetchNews = async (category: string = 'all') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { category }
      });

      if (error) throw error;

      setNews(data.news);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch news. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeTab);
  }, [activeTab]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-3xl font-bold">Daily News</h2>
            <p className="text-muted-foreground">Latest educational and job opportunities</p>
          </div>
        </div>
        <Button
          onClick={() => fetchNews(activeTab)}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            All News
          </TabsTrigger>
          <TabsTrigger value="educational" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Educational
          </TabsTrigger>
          <TabsTrigger value="job" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Job Related
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : news.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No news available at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {news.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant={item.category === 'educational' ? 'secondary' : 'default'}>
                        {item.category === 'educational' ? (
                          <GraduationCap className="w-3 h-3 mr-1" />
                        ) : (
                          <Briefcase className="w-3 h-3 mr-1" />
                        )}
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(item.publishedAt)}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                    <CardDescription className="text-xs">{item.source}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {item.description}
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        Read More
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
