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
  ChevronDown,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog } from '@/components/ui/alert-dialog';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<BusinessPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = (e: React.MouseEvent, plan: BusinessPlan) => {
    e.stopPropagation();
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/plan/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: planToDelete.id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete plan');
      }

      // Remove plan from local state
      setPlans(plans.filter(p => p.id !== planToDelete.id));
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan. Please try again.');
    } finally {
      setIsDeleting(false);
    }
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
  // Plans are considered "in progress" if they have no generations yet
  const inProgress = plans.filter(p => !p.generations || p.generations.length === 0).length;
  // Plans are "completed" if they have generated content
  const completed = plans.filter(p => p.generations && p.generations.length > 0).length;

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
                aria-label="More options for dashboard"
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
                aria-label={isLoadingPlans ? "Refreshing plans..." : "Refresh plans"}
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
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" aria-hidden="true" />
                          Ready
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs inline-flex items-center gap-1">
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
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
                <Card 
                  className="bg-white/[0.02] border-white/10 hover:border-white/20 transition-all cursor-pointer focus-within:ring-2 focus-within:ring-alira-gold focus-within:ring-offset-2 focus-within:ring-offset-black" 
                  onClick={() => currentPlan?.generations && currentPlan.generations.length > 0 && router.push(`/dashboard/${currentPlan.id}`)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && currentPlan?.generations && currentPlan.generations.length > 0) {
                      e.preventDefault();
                      router.push(`/dashboard/${currentPlan.id}`);
                    }
                  }}
                  tabIndex={currentPlan?.generations && currentPlan.generations.length > 0 ? 0 : -1}
                  role="button"
                  aria-label={currentPlan?.generations && currentPlan.generations.length > 0 ? `View strategic plan for ${currentPlan.business_name || 'your business'}` : 'Plan not yet available'}
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-serif text-alira-white mb-4">Your Strategic Plan</h3>
                    <div className="space-y-4">
                      {currentPlan?.generations && currentPlan.generations.length > 0 ? (
                        <>
                          {/* Compact preview box with text excerpt */}
                          <div className="h-48 bg-white/5 border border-alira-gold/30 rounded-lg p-4 overflow-hidden relative group">
                            <div className="space-y-2">
                              {/* Problem Statement Preview */}
                              {currentPlan.generations[0].content?.problem_statement && (
                                <div>
                                  <div className="text-xs font-medium text-alira-gold/80 mb-1">Problem Statement</div>
                                  <p className="text-xs text-alira-white/70 leading-relaxed line-clamp-2">
                                    {currentPlan.generations[0].content.problem_statement}
                                  </p>
                                </div>
                              )}
                              {/* Objectives Preview */}
                              {currentPlan.generations[0].content?.objectives && (
                                <div>
                                  <div className="text-xs font-medium text-alira-gold/80 mb-1">Key Objectives</div>
                                  <p className="text-xs text-alira-white/70 leading-relaxed line-clamp-3">
                                    {currentPlan.generations[0].content.objectives[0]}
                                  </p>
                                </div>
                              )}
                            </div>
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                              <div className="flex items-center gap-2 text-alira-gold text-sm font-medium">
                                <Eye className="w-4 h-4" />
                                Click to View Full Plan
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-white/20 text-alira-white hover:bg-white/5"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/dashboard/${currentPlan.id}`);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Plan
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="h-48 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <FileText className="w-12 h-12 text-alira-white/20 mx-auto mb-3" />
                              <div className="text-xs text-alira-white/40">No plan generated yet</div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-white/20 text-alira-white/50"
                            disabled
                          >
                            View Plan
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
                    {/* Compact next steps preview */}
                    <div className="h-48 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
                      {currentPlan?.generations?.[0]?.content?.next_steps ? (
                        currentPlan.generations[0].content.next_steps.slice(0, 5).map((step: string, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            <div className="text-sm font-medium text-alira-gold/70 flex-shrink-0 mt-0.5">{idx + 1}</div>
                            <div className="text-sm text-alira-white/80 leading-relaxed">
                              {step.length > 120 ? step.substring(0, 120) + '...' : step}
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
                    {currentPlan?.generations?.[0]?.content?.next_steps && currentPlan.generations[0].content.next_steps.length > 5 && (
                      <button 
                        className="text-xs text-alira-white/40 hover:text-alira-gold transition-colors mt-3"
                        onClick={() => router.push(`/dashboard/${currentPlan.id}`)}
                      >
                        View all {currentPlan.generations[0].content.next_steps.length} steps →
                      </button>
                    )}
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
                      className="bg-white/[0.02] border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-black/20 transition-all cursor-pointer group hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-alira-gold focus-within:ring-offset-2 focus-within:ring-offset-black"
                      onClick={() => router.push(`/dashboard/${plan.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          router.push(`/dashboard/${plan.id}`);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View plan: ${plan.business_name || 'Business Plan'}, created ${new Date(plan.created_at).toLocaleDateString()}`}
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
                          <div className="flex items-center gap-2">
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
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 flex-shrink-0"
                              onClick={(e) => handleDeleteClick(e, plan)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
      {plans.length > 0 && currentPlan && currentPlan.generations && currentPlan.generations.length > 0 && (
        <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-20">
          <Button
            onClick={() => router.push(`/dashboard/${currentPlan.id}`)}
            className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black font-medium px-6 md:px-8 py-4 md:py-6 text-sm md:text-base shadow-2xl shadow-alira-gold/20"
            size="lg"
          >
            <Eye className="w-4 md:w-5 h-4 md:h-5 mr-2" />
            View Your Plan
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Plan?"
        description={`Are you sure you want to delete "${planToDelete?.business_name || 'this plan'}"? This action cannot be undone and will permanently delete all plan data, versions, and chat history.`}
        cancelText="Cancel"
        actionText="Delete Plan"
        onAction={handleDeleteConfirm}
        variant="destructive"
        loading={isDeleting}
      />
    </DashboardLayout>
  );
}

