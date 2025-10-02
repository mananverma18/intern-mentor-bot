import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, GraduationCap, Briefcase, Award, Building2 } from 'lucide-react';

const resources = [
  {
    title: 'National Career Service (NCS)',
    description: 'Government job portal with career counseling and job search',
    url: 'https://ncs.gov.in',
    icon: Briefcase,
    category: 'Jobs & Internships'
  },
  {
    title: 'AICTE Portal',
    description: 'Technical education programs, approvals, and student resources',
    url: 'https://aicte-india.org',
    icon: GraduationCap,
    category: 'Education'
  },
  {
    title: 'Skill India',
    description: 'Free skill development courses and certification programs',
    url: 'https://skillindia.gov.in',
    icon: Award,
    category: 'Skill Development'
  },
  {
    title: 'MyGov Opportunities',
    description: 'Government schemes, internships, and student programs',
    url: 'https://mygov.in',
    icon: Building2,
    category: 'Government Schemes'
  },
  {
    title: 'Ministry of Education',
    description: 'Latest education policies, scholarships, and announcements',
    url: 'https://mhrd.gov.in',
    icon: GraduationCap,
    category: 'Education'
  },
  {
    title: 'PM Internship Scheme',
    description: 'Internship opportunities in top Indian companies',
    url: 'https://pminternship.mca.gov.in',
    icon: Briefcase,
    category: 'Internships'
  }
];

export const ResourcesSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Helpful Resources</h2>
        <p className="text-muted-foreground">
          Official portals and platforms for education, jobs, and skill development
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Icon className="w-8 h-8 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {resource.category}
                  </span>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" asChild className="w-full">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Visit Portal
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};