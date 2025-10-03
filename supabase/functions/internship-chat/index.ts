import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message || typeof message !== "string") {
      console.error("Invalid message format");
      return new Response(
        JSON.stringify({ error: "Message is required and must be a string" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing message:", message);

    // Check if user is asking for internship recommendations
    const internshipKeywords = ['recommend internship', 'suggest internship', 'find internship', 'internship recommendation', 'which internship', 'what internship should'];
    const isInternshipRecommendation = internshipKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );

    if (isInternshipRecommendation) {
      console.log("Detected internship recommendation request, redirecting...");
      return new Response(
        JSON.stringify({ 
          response: "For personalized internship recommendations based on your skills and preferences, please use our dedicated Internship Recommender module. It will provide tailored suggestions matching your profile with available opportunities. I'm here to help with general career guidance, interview prep, skill development, and other student life questions!" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are NextStep AI, a comprehensive career guidance assistant for students. Your role is to:

1. Career Guidance: Provide general career advice, industry insights, and career path exploration (but redirect specific internship recommendations to the Internship Recommender module)
2. Interview Prep: Help with resume building, interview preparation, and professional networking strategies
3. Academic Support: Assist with college academics, course selection, study strategies, and exam preparation
4. Project Ideas: Suggest innovative project ideas across various domains (tech, research, social impact, etc.)
5. Skill Development: Guide on learning paths, certifications, technical skills, and soft skills development
6. Placement Prep: Offer tips for campus placements, aptitude tests, and company-specific preparation
7. Student Life: Provide advice on time management, stress management, work-life balance, and student well-being
8. Resources: Recommend government schemes, scholarships, online courses, and skill development platforms

IMPORTANT: If users specifically ask for "internship recommendations" or want you to "suggest internships", redirect them to use the Internship Recommender module instead.

Be supportive, practical, and actionable. Keep responses concise (2-4 sentences). Tailor advice to the Indian education system and job market when relevant.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service requires credits. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error("No response from AI");
      return new Response(
        JSON.stringify({ error: "No response generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("AI response generated successfully");

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in internship-chat function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
