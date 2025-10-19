'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, auth } from '@/lib/supabase-client';
import { 
  FileText, 
  Download, 
  Plus, 
  RefreshCw, 
  MoreVertical,
  Lightbulb,
  Target,
  AlertCircle,
  Eye,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  // Get the most recent plan for the main grid
  const currentPlan = plans[0];
  const totalPlans = plans.length;
  const inProgress = plans.filter(p => !p.pdf_url).length;
  const completed = plans.filter(p => p.pdf_url).length;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-normal text-alira-white">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                onClick={handleNewPlan}
                className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black font-medium px-4 md:px-6 text-sm md:text-base"
              >
                New Plan
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-alira-white/60 hover:text-alira-white hover:bg-white/5"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 md:px-6 py-6 md:py-8 w-full pb-32">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          
          {/* Top Summary Strip */}
          <div className="bg-white/[0.02] border border-white/10 rounded-lg px-4 md:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center divide-x divide-white/10">
                <div className="pr-4 md:pr-8">
                  <div className="text-2xl md:text-3xl font-serif text-alira-white mb-0.5">{totalPlans}</div>
                  <div className="text-xs text-alira-white/50 font-light whitespace-nowrap">Total Plans</div>
                </div>
                <div className="px-4 md:px-8">
                  <div className="text-2xl md:text-3xl font-serif text-alira-white mb-0.5">{inProgress}</div>
                  <div className="text-xs text-alira-white/50 font-light whitespace-nowrap">In Progress</div>
                </div>
                <div className="pl-4 md:pl-8">
                  <div className="text-2xl md:text-3xl font-serif text-alira-white mb-0.5">{completed}</div>
                  <div className="text-xs text-alira-white/50 font-light whitespace-nowrap">Completed</div>
                </div>
              </div>
              <Button
                onClick={loadPlans}
                variant="ghost"
                size="icon"
                className="text-alira-white/40 hover:text-alira-white hover:bg-white/5 flex-shrink-0"
                disabled={isLoadingPlans}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingPlans ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {plans.length === 0 ? (
            /* Empty State */
            <Card className="bg-white/[0.02] border-white/10">
              <CardContent className="p-16 text-center">
                <div className="p-6 rounded-full bg-alira-gold/10 w-fit mx-auto mb-6">
                  <FileText className="w-16 h-16 text-alira-gold" />
                </div>
                <h3 className="text-2xl font-serif font-normal text-alira-white mb-3">
                  Tell us what you're building
                </h3>
                <p className="text-alira-white/60 mb-8 max-w-md mx-auto">
                  Create your first plan to get started
                </p>
                <Button 
                  onClick={handleNewPlan} 
                  className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black font-medium"
                >
                  New Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Main Grid - Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Your Current Inputs */}
                <Card className="bg-white/[0.02] border-white/10 hover:border-white/20 transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-serif text-alira-white mb-4">Your Current Inputs</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-alira-white/40 mb-1">Name</div>
                        <div className="text-sm text-alira-white/90">
                          {currentPlan?.business_name || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-alira-white/40 mb-1">Latest Challenge</div>
                        <div className="text-sm text-alira-white/90 leading-relaxed">
                          {currentPlan?.current_challenges 
                            ? currentPlan.current_challenges.substring(0, 100) + (currentPlan.current_challenges.length > 100 ? '...' : '')
                            : 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-alira-white/40 mb-1">90-Day Goal</div>
                        <div className="text-sm text-alira-white/90">
                          {currentPlan?.immediate_goals || 'Not provided'}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5">
                        <div className="text-xs text-alira-white/30">Step 1 of 1</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Summary */}
                <Card className="bg-white/[0.02] border-white/10 hover:border-white/20 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-serif text-alira-white">AI Summary</h3>
                      {currentPlan?.generations && currentPlan.generations.length > 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                          Ready
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                          In Progress
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Lightbulb className="w-4 h-4 text-alira-gold/70 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-alira-white/80 leading-relaxed">
                          {currentPlan?.generations?.[0]?.content?.problem_statement 
                            ? currentPlan.generations[0].content.problem_statement.substring(0, 80) + '...'
                            : 'Analyzing your business context'}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Target className="w-4 h-4 text-alira-gold/70 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-alira-white/80 leading-relaxed">
                          {currentPlan?.generations?.[0]?.content?.objectives?.[0]
                            ? currentPlan.generations[0].content.objectives[0].substring(0, 80) + (currentPlan.generations[0].content.objectives[0].length > 80 ? '...' : '')
                            : 'Identifying key objectives'}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <AlertCircle className="w-4 h-4 text-alira-gold/70 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-alira-white/80 leading-relaxed">
                          Review generated insights carefully
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Grid - Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Generated Plan Preview */}
                <Card className="bg-white/[0.02] border-white/10 hover:border-white/20 transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-serif text-alira-white mb-4">Generated Plan Preview</h3>
                    <div className="space-y-4">
                      {currentPlan?.pdf_url ? (
                        <>
                          <div className="aspect-[8.5/11] bg-white/5 border border-alira-gold/30 rounded-lg flex items-center justify-center">
                            <FileText className="w-16 h-16 text-alira-gold/40" />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-white/20 text-alira-white hover:bg-white/5"
                            onClick={() => window.open(currentPlan.pdf_url!, '_blank')}
                          >
                            Preview Plan
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="aspect-[8.5/11] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <RefreshCw className="w-12 h-12 text-alira-white/20 animate-spin mx-auto mb-3" />
                              <div className="text-xs text-alira-white/40">Generating...</div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-white/20 text-alira-white/50"
                            disabled
                          >
                            Preview Plan
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <Card className="bg-white/[0.02] border-white/10 hover:border-white/20 transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-serif text-alira-white mb-4">Next Steps</h3>
                    <div className="space-y-3 mb-4">
                      {currentPlan?.generations?.[0]?.content?.next_steps ? (
                        currentPlan.generations[0].content.next_steps.slice(0, 3).map((step: string, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            <div className="text-sm font-medium text-alira-gold/70 flex-shrink-0">{idx + 1}</div>
                            <div className="text-sm text-alira-white/80 leading-relaxed">
                              {step.substring(0, 100)}{step.length > 100 ? '...' : ''}
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex gap-3">
                            <div className="text-sm font-medium text-alira-gold/70 flex-shrink-0">1</div>
                            <div className="text-sm text-alira-white/80 leading-relaxed">
                              Complete your plan inputs
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="text-sm font-medium text-alira-gold/70 flex-shrink-0">2</div>
                            <div className="text-sm text-alira-white/80 leading-relaxed">
                              Review AI-generated insights
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="text-sm font-medium text-alira-gold/70 flex-shrink-0">3</div>
                            <div className="text-sm text-alira-white/80 leading-relaxed">
                              Download your strategic plan
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <button className="text-xs text-alira-white/40 hover:text-alira-gold transition-colors">
                      Show more
                    </button>
                  </CardContent>
                </Card>
              </div>

              {/* Plans List */}
              <div className="space-y-4 pt-8">
                <h2 className="text-xl font-serif text-alira-white">All Plans</h2>
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className="bg-white/[0.02] border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all cursor-pointer group hover:-translate-y-0.5"
                      onClick={() => router.push(`/dashboard/${plan.id}`)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-serif text-alira-white mb-1 truncate group-hover:text-alira-gold transition-colors">
                              {plan.business_name || 'Business Plan'}
                            </h3>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs text-alira-white/40">
                                {new Date(plan.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric' 
                                })}
                              </span>
                              {plan.current_challenges && (
                                <span className="px-2 py-0.5 rounded-full bg-alira-gold/10 border border-alira-gold/20 text-alira-gold text-xs">
                                  Challenge
                                </span>
                              )}
                              {plan.generations && plan.generations.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs">
                                  AI Analysis
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-alira-white hover:bg-white/5 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/${plan.id}`);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Sticky Action Bar */}
      {plans.length > 0 && currentPlan && (
        <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-20">
          {currentPlan.pdf_url ? (
            <Button
              onClick={() => window.open(currentPlan.pdf_url!, '_blank')}
              className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black font-medium px-6 md:px-8 py-4 md:py-6 text-sm md:text-base shadow-2xl shadow-alira-gold/20"
              size="lg"
            >
              <Download className="w-4 md:w-5 h-4 md:h-5 mr-2" />
              Download PDF
            </Button>
          ) : (
            <Button
              className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black font-medium px-6 md:px-8 py-4 md:py-6 text-sm md:text-base shadow-2xl shadow-alira-gold/20"
              size="lg"
              disabled
            >
              <RefreshCw className="w-4 md:w-5 h-4 md:h-5 mr-2 animate-spin" />
              Generate Plan
            </Button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

