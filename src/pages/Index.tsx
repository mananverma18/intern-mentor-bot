import { ChatInterface } from "@/components/ChatInterface";
import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-[var(--gradient-hero)] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-[hsl(220,100%,60%)] bg-clip-text text-transparent">
              InternMatch AI
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your intelligent career advisor powered by AI. Get personalized internship recommendations,
            skill guidance, and expert career advice.
          </p>
        </header>

        {/* Chat Interface */}
        <div className="h-[calc(100vh-240px)] min-h-[500px]">
          <ChatInterface />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>Powered by AI • Always here to help you succeed</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
