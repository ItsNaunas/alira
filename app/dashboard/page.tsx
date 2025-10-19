'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, auth } from '@/lib/supabase-client';
import { FileText, Download, Plus, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/DashboardLayout';

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
  generations?: {
    id: string;
    type: string;
    content: any;
    created_at: string;
  }[];
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
        .select(`
          *,
          generations (
            id,
            type,
            content,
            created_at
          )
        `)
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
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alira-gold"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Dashboard Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-3xl font-serif font-normal text-alira-white mb-1">
                Dashboard
              </h1>
              <p className="text-sm text-alira-white/60 font-light">
                Welcome back, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleNewPlan}
                className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Plan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 border-alira-gold/20 hover:border-alira-gold/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-alira-white/60 font-light mb-1">Total Plans</p>
                    <p className="text-4xl font-serif font-normal text-alira-white">{plans.length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-alira-gold/20">
                    <FileText className="w-7 h-7 text-alira-gold" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-alira-white/60 font-light mb-1">Completed</p>
                    <p className="text-4xl font-serif font-normal text-alira-white">
                      {plans.filter(p => p.pdf_url).length}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/20">
                    <Download className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-alira-white/60 font-light mb-1">In Progress</p>
                    <p className="text-4xl font-serif font-normal text-alira-white">
                      {plans.filter(p => !p.pdf_url).length}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/20">
                    <RefreshCw className="w-7 h-7 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plans List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-serif font-normal text-alira-white mb-1">
                  Your Business Plans
                </h2>
                <p className="text-sm text-alira-white/60">
                  View and manage your strategic plans
                </p>
              </div>
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
              <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10">
                <CardContent className="p-16 text-center">
                  <div className="p-6 rounded-full bg-alira-gold/10 w-fit mx-auto mb-6">
                    <FileText className="w-16 h-16 text-alira-gold" />
                  </div>
                  <h3 className="text-2xl font-serif font-normal text-alira-white mb-3">
                    No plans yet
                  </h3>
                  <p className="text-alira-white/60 mb-8 max-w-md mx-auto">
                    Start by creating your first business plan and unlock strategic insights for your business
                  </p>
                  <Button 
                    onClick={handleNewPlan} 
                    className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {plans.map((plan) => (
                  <Card key={plan.id} className="bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-alira-gold/30 hover:shadow-lg hover:shadow-alira-gold/5 transition-all group">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          {/* Header */}
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-alira-gold/10 mt-1">
                              <FileText className="w-5 h-5 text-alira-gold" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-serif font-normal text-alira-white mb-2 group-hover:text-alira-gold transition-colors">
                                {plan.business_name?.substring(0, 80) || 'Business Plan'}
                                {plan.business_name && plan.business_name.length > 80 ? '...' : ''}
                              </h3>
                              <p className="text-sm text-alira-white/50">
                                Created {new Date(plan.created_at).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          {/* Challenge */}
                          {plan.current_challenges && (
                            <div className="pl-14">
                              <p className="text-sm text-alira-white/70 leading-relaxed">
                                <span className="text-alira-gold font-medium">Challenge: </span>
                                {plan.current_challenges.substring(0, 120)}
                                {plan.current_challenges.length > 120 ? '...' : ''}
                              </p>
                            </div>
                          )}
                          
                          {/* AI Analysis */}
                          {plan.generations && plan.generations.length > 0 && plan.generations[0].content?.problem_statement && (
                            <div className="pl-14">
                              <p className="text-xs text-alira-white/50 leading-relaxed">
                                <span className="text-alira-gold font-medium">AI Analysis: </span>
                                {plan.generations[0].content.problem_statement.substring(0, 160)}
                                {plan.generations[0].content.problem_statement.length > 160 ? '...' : ''}
                              </p>
                            </div>
                          )}
                          
                          {/* Tags */}
                          {plan.service_interest && plan.service_interest.length > 0 && (
                            <div className="pl-14 flex flex-wrap gap-2">
                              {plan.service_interest.slice(0, 4).map((service: string) => (
                                <span
                                  key={service}
                                  className="px-3 py-1 rounded-full bg-alira-gold/10 border border-alira-gold/20 text-alira-gold text-xs font-light"
                                >
                                  {service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                              ))}
                              {plan.service_interest.length > 4 && (
                                <span className="px-3 py-1 rounded-full bg-white/5 text-alira-white/50 text-xs">
                                  +{plan.service_interest.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-row lg:flex-col gap-2 lg:ml-6 lg:min-w-[140px]">
                          {plan.generations && plan.generations.length > 0 ? (
                            <Button
                              onClick={() => {
                                // Show the AI-generated content in a modal or new page
                                if (!plan.generations || plan.generations.length === 0) return;
                                const content = plan.generations[0].content;
                                const contentText = `
Business Plan Analysis:

Problem Statement:
${content.problem_statement || 'Not available'}

Objectives:
${content.objectives?.join('\n• ') || 'Not available'}

Proposed Solution:
${content.proposed_solution?.map((s: any) => `${s.pillar}: ${s.actions?.join(', ')}`).join('\n') || 'Not available'}

Expected Outcomes:
${content.expected_outcomes?.join('\n• ') || 'Not available'}

Next Steps:
${content.next_steps?.join('\n• ') || 'Not available'}
                                `;
                                alert(contentText);
                              }}
                              className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black font-medium w-full lg:w-auto"
                              size="sm"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Plan
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                              className="border-white/20 text-alira-white/50 w-full lg:w-auto"
                            >
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </Button>
                          )}
                          
                          {plan.pdf_url && (
                            <Button
                              onClick={() => window.open(plan.pdf_url!, '_blank')}
                              variant="outline"
                              size="sm"
                              className="border-alira-gold/30 text-alira-gold hover:bg-alira-gold/10 hover:border-alira-gold/50 w-full lg:w-auto"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
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
    </DashboardLayout>
  );
}

