'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, auth } from '@/lib/supabase-client';
import { FileText, Download, Plus, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BusinessPlan {
  id: string;
  created_at: string;
  business_name: string;
  current_challenges?: string;
  immediate_goals?: string;
  service_interest?: string[];
  form_data?: any;
  pdf_url?: string | null;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const checkUser = useCallback(async () => {
    const { user, error } = await auth.getUser();
    if (error || !user) {
      router.push('/');
      return;
    }
    setUser(user);
    setLoading(false);
  }, [router]);

  const loadPlans = useCallback(async () => {
    setIsLoadingPlans(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('dashboards')
        .select('*')
        .eq('status', 'complete')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
    loadPlans();
  }, [checkUser, loadPlans]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  const handleNewPlan = () => {
    router.push('/#start-chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alira-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-normal text-alira-white">
                ALIRA<span className="text-alira-gold">.</span>
              </h1>
              <p className="text-sm text-alira-white/60 font-light">
                Welcome back, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleNewPlan}
                variant="alira"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Plan
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center gap-2 border-white/20 text-alira-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-alira-gold/10">
                    <FileText className="w-6 h-6 text-alira-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-alira-white/60 font-light">Total Plans</p>
                    <p className="text-3xl font-serif font-normal text-alira-white">{plans.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <Download className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-alira-white/60 font-light">Ready to Download</p>
                    <p className="text-3xl font-serif font-normal text-alira-white">
                      {plans.filter(p => p.pdf_url).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <RefreshCw className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-alira-white/60 font-light">In Progress</p>
                    <p className="text-3xl font-serif font-normal text-alira-white">
                      {plans.filter(p => !p.pdf_url).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-normal text-alira-white">
                Your Business Plans
              </h2>
              <Button
                onClick={loadPlans}
                variant="outline"
                size="sm"
                className="border-white/20 text-alira-white hover:bg-white/10"
                disabled={isLoadingPlans}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingPlans ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {plans.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-alira-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-normal text-alira-white mb-2">
                    No plans yet
                  </h3>
                  <p className="text-alira-white/60 mb-6">
                    Start by creating your first business plan
                  </p>
                  <Button onClick={handleNewPlan} variant="alira">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {plans.map((plan) => (
                  <Card key={plan.id} className="bg-white/5 border-white/10 hover:border-alira-gold/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                          <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-5 h-5 text-alira-gold" />
                            <h3 className="text-lg font-serif font-normal text-alira-white">
                              {plan.business_name?.substring(0, 60) || 'Business Plan'}
                              {plan.business_name?.length > 60 ? '...' : ''}
                            </h3>
                          </div>
                          <p className="text-sm text-alira-white/60 mb-4">
                            Created {new Date(plan.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                          
                          {plan.current_challenges && (
                            <div className="text-sm text-alira-white/70 mb-3">
                              <strong className="text-alira-gold">Challenge:</strong> {plan.current_challenges.substring(0, 100)}...
                            </div>
                          )}
                          
                          {plan.service_interest && plan.service_interest.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {plan.service_interest.map((service: string) => (
                                <span
                                  key={service}
                                  className="px-3 py-1 rounded-full bg-alira-gold/10 text-alira-gold text-xs font-light"
                                >
                                  {service.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-6">
                          {plan.pdf_url ? (
                            <Button
                              onClick={() => window.open(plan.pdf_url!, '_blank')}
                              variant="alira"
                              size="sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="border-white/20 text-alira-white/50"
                            >
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

