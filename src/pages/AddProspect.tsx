import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProspectForm {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  stage: string;
  notes: string;
}

const stages = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'closed', label: 'Closed' }
];

export default function AddProspect() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProspectForm>({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    stage: 'new',
    notes: ''
  });

  const handleInputChange = (field: keyof ProspectForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Name and email are required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('prospects')
        .insert([{
          ...formData,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Prospect added successfully',
      });

      navigate('/prospects');
    } catch (error) {
      console.error('Error adding prospect:', error);
      toast({
        title: 'Error',
        description: 'Failed to add prospect. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/prospects')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prospects
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New Prospect</h1>
        <p className="text-muted-foreground">Create a new prospect entry in your CRM</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Prospect Information</CardTitle>
          <CardDescription>
            Fill in the details for your new prospect
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => handleInputChange('stage', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes about this prospect"
                rows={4}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Prospect'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/prospects')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}