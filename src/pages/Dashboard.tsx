import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, Target, Plus, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Prospect {
  id: string;
  full_name: string;
  email: string;
  company: string;
  stage: 'new' | 'in_talks' | 'closed';
  created_at: string;
}

interface PipelineStats {
  new: number;
  in_talks: number;
  closed: number;
}

const Dashboard = () => {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [stats, setStats] = useState<PipelineStats>({ new: 0, in_talks: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProspects();
    }
  }, [user]);

  const fetchProspects = async () => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as Prospect[];
      setProspects(typedData);
      
      // Calculate stats
      const statsData = typedData.reduce((acc, prospect) => {
        acc[prospect.stage]++;
        return acc;
      }, { new: 0, in_talks: 0, closed: 0 });
      
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching prospects:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalProspects = prospects.length;
  const conversionRate = totalProspects > 0 ? ((stats.closed / totalProspects) * 100).toFixed(1) : '0';

  const chartData = [
    { name: 'New', value: stats.new, color: 'hsl(var(--pipeline-new))' },
    { name: 'In Talks', value: stats.in_talks, color: 'hsl(var(--pipeline-talks))' },
    { name: 'Closed', value: stats.closed, color: 'hsl(var(--pipeline-closed))' },
  ];

  const barChartData = chartData.map(item => ({
    stage: item.name,
    count: item.value,
  }));

  const recentProspects = prospects.slice(0, 5);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new': return 'bg-pipeline-new text-white';
      case 'in_talks': return 'bg-pipeline-talks text-white';
      case 'closed': return 'bg-pipeline-closed text-white';
      default: return 'bg-muted';
    }
  };

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'new': return 'New';
      case 'in_talks': return 'In Talks';
      case 'closed': return 'Closed';
      default: return stage;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your prospect pipeline overview.
          </p>
        </div>
        <Button asChild className="bg-gradient-primary hover:opacity-90 text-primary-foreground border-0">
          <Link to="/add-prospect">
            <Plus className="mr-2 h-4 w-4" />
            Add Prospect
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProspects}</div>
            <p className="text-xs text-muted-foreground">
              Active in pipeline
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              New to Closed ratio
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new + stats.in_talks}</div>
            <p className="text-xs text-muted-foreground">
              Active prospects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Deals</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closed}</div>
            <p className="text-xs text-muted-foreground">
              Successfully closed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
            <CardDescription>Distribution of prospects across stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [value, 'Prospects']}
                  labelFormatter={(label) => `Stage: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-md">
          <CardHeader>
            <CardTitle>Stage Breakdown</CardTitle>
            <CardDescription>Number of prospects per stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Prospects */}
      <Card className="bg-gradient-card border-0 shadow-md">
        <CardHeader>
          <CardTitle>Recent Prospects</CardTitle>
          <CardDescription>Latest prospects added to your pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProspects.length > 0 ? (
            <div className="space-y-4">
              {recentProspects.map((prospect) => (
                <div key={prospect.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="space-y-1">
                    <p className="font-medium">{prospect.full_name}</p>
                    <p className="text-sm text-muted-foreground">{prospect.email}</p>
                    {prospect.company && (
                      <p className="text-sm text-muted-foreground">{prospect.company}</p>
                    )}
                  </div>
                  <Badge className={getStageColor(prospect.stage)}>
                    {getStageLabel(prospect.stage)}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No prospects yet</h3>
              <p className="mt-2 text-muted-foreground">
                Get started by adding your first prospect to the pipeline.
              </p>
              <Button asChild className="mt-4 bg-gradient-primary hover:opacity-90 text-primary-foreground border-0">
                <Link to="/add-prospect">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Prospect
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;