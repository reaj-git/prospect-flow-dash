import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, BarChart3, Users, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary-glow/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Prospect Flow CRM</h1>
              <p className="text-sm text-muted-foreground">Pipeline Management Made Simple</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Transform Your{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Sales Pipeline
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A powerful yet simple CRM designed to help you track prospects through every stage of your sales process. 
            From initial contact to closing deals, manage it all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0 px-8 py-6 text-lg"
            >
              Start Managing Prospects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our CRM provides all the essential tools to manage your prospects effectively and close more deals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-pipeline-new/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-pipeline-new" />
              </div>
              <CardTitle>Pipeline Management</CardTitle>
              <CardDescription>
                Track prospects through three clear stages: New, In Talks, and Closed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pipeline-new rounded-full mr-3"></div>
                  Visual pipeline overview
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pipeline-new rounded-full mr-3"></div>
                  Drag & drop stage updates
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pipeline-new rounded-full mr-3"></div>
                  Progress tracking
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-pipeline-talks/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-pipeline-talks" />
              </div>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Get insights into your sales performance with detailed metrics and charts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pipeline-talks rounded-full mr-3"></div>
                  Conversion rate tracking
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pipeline-talks rounded-full mr-3"></div>
                  Visual charts & graphs
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pipeline-talks rounded-full mr-3"></div>
                  Performance insights
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-pipeline-closed/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-pipeline-closed" />
              </div>
              <CardTitle>Contact Management</CardTitle>
              <CardDescription>
                Store and organize all your prospect information in one secure place.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pipeline-closed rounded-full mr-3"></div>
                  Complete contact profiles
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pipeline-closed rounded-full mr-3"></div>
                  Company associations
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-pipeline-closed rounded-full mr-3"></div>
                  Notes & history
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-primary border-0 text-primary-foreground overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary-glow/20"></div>
          <CardContent className="relative p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Close More Deals?</h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of sales professionals who use Prospect Flow CRM to manage their pipeline 
              and increase their conversion rates.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-background text-foreground hover:bg-background/90 px-8 py-6 text-lg"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Prospect Flow CRM</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with modern technology for modern sales teams.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
