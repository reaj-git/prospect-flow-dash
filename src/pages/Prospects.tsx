import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Prospect {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  stage: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const stageColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  proposal: 'bg-purple-100 text-purple-800',
  closed: 'bg-gray-100 text-gray-800'
};

export default function Prospects() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProspects();
  }, []);

  const fetchProspects = async () => {
    try {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProspects(data || []);
    } catch (error) {
      console.error('Error fetching prospects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch prospects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProspects(prospects.filter(p => p.id !== id));
      toast({
        title: 'Success',
        description: 'Prospect deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete prospect',
        variant: 'destructive',
      });
    }
  };

  const filteredProspects = prospects.filter(prospect =>
    prospect.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prospect.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prospects</h1>
          <p className="text-muted-foreground">Manage your sales prospects and leads</p>
        </div>
        <Link to="/add-prospect">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Prospect
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Prospects</CardTitle>
          <CardDescription>
            {filteredProspects.length} prospects found
          </CardDescription>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prospects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProspects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell className="font-medium">
                    {prospect.full_name}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {prospect.email}
                      </div>
                      {prospect.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {prospect.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      {prospect.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={stageColors[prospect.stage as keyof typeof stageColors]}>
                      {prospect.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(prospect.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(prospect.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProspects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No prospects found. <Link to="/add-prospect" className="text-primary hover:underline">Add your first prospect</Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}