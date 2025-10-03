import { ChatInterface } from "@/components/ChatInterface";
import { NewsSection } from "@/components/NewsSection";
import { ResourcesSection } from "@/components/ResourcesSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, MessageSquare, Newspaper, BookOpen } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[var(--gradient-hero)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-[hsl(220,100%,60%)] bg-clip-text text-transparent">
              NextStep AI
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered career guidance platform with daily educational updates
          </p>
        </header>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-6">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Mentor
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              Daily Updates
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <div className="h-[calc(100vh-320px)] min-h-[500px]">
              <ChatInterface />
            </div>
          </TabsContent>
          
          <TabsContent value="news">
            <NewsSection />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesSection />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by AI • Your NextStep to Success</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
