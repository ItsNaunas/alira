'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog } from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { getUserFriendlyError, errorMessages } from '@/lib/error-messages';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

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

  const loadTasks = useCallback(async (planId?: string) => {
    setIsLoadingTasks(true);
    try {
      const url = planId ? `/api/dashboard/tasks?planId=${planId}` : '/api/dashboard/tasks';
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load tasks');
      const json = await res.json();
      setTasks(json?.data?.tasks || json?.tasks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

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
      alert(getUserFriendlyError(error) || errorMessages.planDeleteFailed);
    } finally {
      setIsDeleting(false);
    }
  };

  // derive current plan id and recent activity hooks (must run every render order)
  const currentPlanId = plans[0]?.id;
  useEffect(() => {
    if (user) loadTasks(currentPlanId);
  }, [user, currentPlanId, loadTasks]);

  const recentActivity = useMemo(() => {
    const events: { label: string; date: string }[] = [];
    for (const p of plans) {
      events.push({ label: `Created: ${p.business_name || 'Plan'}` , date: p.created_at });
      if (p.generations && p.generations.length > 0) {
        for (const g of p.generations) {
          events.push({ label: `AI analysis for ${p.business_name || 'Plan'}`, date: g.created_at });
        }
      }
    }
    return events
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0,5);
  }, [plans]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" color="gold" />
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

  const filteredPlans = plans.filter(p =>
    (p.business_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // task actions
  const handleAddTask = async () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    try {
      const res = await fetch('/api/dashboard/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, planId: currentPlanId || undefined })
      });
      if (!res.ok) throw new Error('Failed to create task');
      const json = await res.json();
      const created = json?.data?.task || json?.task;
      setTasks(prev => [...prev, created]);
      setNewTaskTitle('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleTask = async (task: any) => {
    try {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
      const res = await fetch(`/api/dashboard/tasks/${task.id}` , {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      if (!res.ok) throw new Error('Failed to update task');
    } catch (e) {
      console.error(e);
      // reload on failure
      loadTasks(currentPlanId || undefined);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      const res = await fetch(`/api/dashboard/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
    } catch (e) {
      console.error(e);
      loadTasks(currentPlanId || undefined);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="border-b border-borderToken-subtle bg-bg-page/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 md:px-6 py-4 md:py-5">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-serif font-normal text-text-primary">
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
                className="text-text-tertiary hover:text-text-primary hover:bg-bg-muted"
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
          
          {/* Plans Toolbar */}
          <div className="bg-surface border border-borderToken-subtle rounded-lg px-4 md:px-6 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-serif text-text-primary">All Plans</h2>
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Search plans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-bg-muted border-borderToken-subtle text-text-primary placeholder:text-text-tertiary"
                />
                <Button
                  onClick={loadPlans}
                  variant="ghost"
                  size="icon"
                  className="text-text-tertiary hover:text-text-primary hover:bg-bg-muted flex-shrink-0"
                  disabled={isLoadingPlans}
                  aria-label={isLoadingPlans ? 'Refreshing plans...' : 'Refresh plans'}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingPlans ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Widgets: Quick Actions, Recent Activity, Versions, Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Quick Actions */}
            <Card className="bg-surface border-borderToken-subtle">
              <CardContent className="p-5 space-y-3">
                <h3 className="text-lg font-serif text-text-primary">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={handleNewPlan} className="bg-alira-gold text-alira-black hover:bg-alira-gold/90" aria-label="Create new plan">
                    <Plus className="w-4 h-4 mr-2" />New
                  </Button>
                  <Button onClick={() => currentPlanId && router.push(`/dashboard/${currentPlanId}/refine`)} variant="outline" className="border-borderToken-subtle text-text-primary hover:bg-bg-muted" aria-label="Refine latest plan" disabled={!currentPlanId}>
                    <RefreshCw className="w-4 h-4 mr-2" />Refine
                  </Button>
                  <Button onClick={() => currentPlanId && router.push(`/dashboard/${currentPlanId}`)} variant="outline" className="border-borderToken-subtle text-text-primary hover:bg-bg-muted" aria-label="View plan" disabled={!currentPlanId}>
                    <Eye className="w-4 h-4 mr-2" />View
                  </Button>
                  <Button onClick={() => currentPlanId && router.push(`/dashboard/${currentPlanId}`)} variant="outline" className="border-borderToken-subtle text-text-primary hover:bg-bg-muted" aria-label="Download PDF" disabled={!currentPlanId}>
                    <Download className="w-4 h-4 mr-2" />PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-surface border-borderToken-subtle">
              <CardContent className="p-5">
                <h3 className="text-lg font-serif text-text-primary mb-3">Recent Activity</h3>
                <div className="space-y-2 max-h-40 overflow-auto pr-1">
                  {recentActivity.length === 0 ? (
                    <div className="text-sm text-text-tertiary">No recent activity</div>
                  ) : recentActivity.map((evt, idx) => (
                    <div key={idx} className="text-sm text-text-secondary flex items-center justify-between gap-3">
                      <span className="truncate">{evt.label}</span>
                      <span className="text-xs text-text-tertiary whitespace-nowrap">{new Date(evt.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plan Versions (latest) */}
            <Card className="bg-surface border-borderToken-subtle">
              <CardContent className="p-5">
                <h3 className="text-lg font-serif text-text-primary mb-3">Plan Versions</h3>
                <div className="space-y-2 max-h-40 overflow-auto pr-1">
                  {currentPlan?.generations && currentPlan.generations.length > 0 ? (
                    currentPlan.generations.slice(0,5).map((g:any, idx:number) => (
                      <div key={g.id || idx} className="text-sm text-text-secondary flex items-center justify-between gap-3">
                        <span className="truncate">Version {idx + 1}</span>
                        <span className="text-xs text-text-tertiary whitespace-nowrap">{new Date(g.created_at).toLocaleDateString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-text-tertiary">No versions yet</div>
                  )}
                </div>
                {currentPlanId && (
                  <button className="text-xs text-text-tertiary hover:text-alira-gold mt-2" onClick={() => router.push(`/dashboard/${currentPlanId}`)}>Open plan →</button>
                )}
              </CardContent>
            </Card>

            {/* Checklist */}
            <Card className="bg-surface border-borderToken-subtle">
              <CardContent className="p-5">
                <h3 className="text-lg font-serif text-text-primary mb-3">Checklist</h3>
                <div className="flex gap-2 mb-3">
                  <Input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Add task..." className="bg-bg-muted border-borderToken-subtle text-text-primary placeholder:text-text-tertiary" />
                  <Button onClick={handleAddTask} className="bg-alira-gold text-alira-black hover:bg-alira-gold/90" aria-label="Add task">Add</Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-auto pr-1">
                  {isLoadingTasks ? (
                    <div className="text-sm text-text-tertiary">Loading...</div>
                  ) : tasks.length === 0 ? (
                    <div className="text-sm text-text-tertiary">No tasks yet</div>
                  ) : (
                    tasks.map((t) => (
                      <div key={t.id} className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 flex-1 min-w-0">
                          <Checkbox checked={!!t.completed} onCheckedChange={() => handleToggleTask(t)} aria-label={`Toggle ${t.title}`} />
                          <span className={`text-sm truncate ${t.completed ? 'line-through text-text-tertiary' : 'text-text-secondary'}`}>{t.title}</span>
                        </label>
                        <button onClick={() => handleDeleteTask(t.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {plans.length === 0 ? (
            /* Empty State */
            <Card className="bg-surface border-borderToken-subtle">
              <CardContent className="p-16 text-center">
                <div className="p-6 rounded-full bg-alira-gold/10 w-fit mx-auto mb-6">
                  <FileText className="w-16 h-16 text-alira-gold" />
                </div>
                <h3 className="text-2xl font-serif font-normal text-text-primary mb-3">
                  Tell us what you're building
                </h3>
                <p className="text-text-tertiary mb-8 max-w-md mx-auto">
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
              

              {/* Main Grid - Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Generated Plan Preview */}
                <Card 
                  className="bg-surface border-borderToken-subtle hover:border-accent transition-all cursor-pointer focus-within:ring-2 focus-within:ring-alira-gold focus-within:ring-offset-2 focus-within:ring-offset-bg-page" 
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
                    <h3 className="text-lg font-serif text-text-primary mb-4">Your Strategic Plan</h3>
                    <div className="space-y-4">
                      {currentPlan?.generations && currentPlan.generations.length > 0 ? (
                        <>
                          {/* Compact preview box with text excerpt */}
                          <div className="h-48 bg-bg-muted border border-accent rounded-lg p-4 overflow-hidden relative group">
                            <div className="space-y-2">
                              {/* Problem Statement Preview */}
                              {currentPlan.generations[0].content?.problem_statement && (
                                <div>
                                  <div className="text-xs font-medium text-alira-gold/80 mb-1">Problem Statement</div>
                                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                                    {currentPlan.generations[0].content.problem_statement}
                                  </p>
                                </div>
                              )}
                              {/* Objectives Preview */}
                              {currentPlan.generations[0].content?.objectives && (
                                <div>
                                  <div className="text-xs font-medium text-alira-gold/80 mb-1">Key Objectives</div>
                                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                                    {currentPlan.generations[0].content.objectives[0]}
                                  </p>
                                </div>
                              )}
                            </div>
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-page/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                              <div className="flex items-center gap-2 text-alira-gold text-sm font-medium">
                                <Eye className="w-4 h-4" />
                                Click to View Full Plan
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-borderToken-subtle text-text-primary hover:bg-bg-muted"
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
                          <div className="h-48 bg-bg-muted border border-borderToken-subtle rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                              <div className="text-xs text-text-tertiary">No plan generated yet</div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-borderToken-subtle text-text-tertiary"
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
                <Card className="bg-surface border-borderToken-subtle hover:border-accent transition-all">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-serif text-text-primary mb-4">Next Steps</h3>
                    {/* Compact next steps preview */}
                    <div className="h-48 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-borderToken-subtle scrollbar-track-transparent pr-2">
                      {currentPlan?.generations?.[0]?.content?.next_steps ? (
                        currentPlan.generations[0].content.next_steps.slice(0, 5).map((step: string, idx: number) => (
                          <div key={idx} className="flex gap-3">
                            <div className="text-sm font-medium text-alira-gold/70 flex-shrink-0 mt-0.5">{idx + 1}</div>
                            <div className="text-sm text-text-secondary leading-relaxed">
                              {step.length > 120 ? step.substring(0, 120) + '...' : step}
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="flex gap-3">
                            <div className="text-sm font-medium text-alira-gold/70 flex-shrink-0">1</div>
                            <div className="text-sm text-text-secondary leading-relaxed">
                              Complete your plan inputs
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="text-sm font-medium text-alira-gold/70 flex-shrink-0">2</div>
                            <div className="text-sm text-text-secondary leading-relaxed">
                              Review AI-generated insights
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <div className="text-sm font-medium text-alira-gold/70 flex-shrink-0">3</div>
                            <div className="text-sm text-text-secondary leading-relaxed">
                              Download your strategic plan
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    {currentPlan?.generations?.[0]?.content?.next_steps && currentPlan.generations[0].content.next_steps.length > 5 && (
                      <button 
                        className="text-xs text-text-tertiary hover:text-alira-gold transition-colors mt-3"
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
                <div className="space-y-3">
                  {filteredPlans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className="bg-surface border-borderToken-subtle hover:border-accent hover:shadow-lg hover:shadow-bg-page/20 transition-all cursor-pointer group hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-alira-gold focus-within:ring-offset-2 focus-within:ring-offset-bg-page"
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
                            <h3 className="text-base font-serif text-text-primary mb-1 truncate group-hover:text-alira-gold transition-colors">
                              {plan.business_name || 'Business Plan'}
                            </h3>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-xs text-text-tertiary">
                                {new Date(plan.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric' 
                                })}
                              </span>
                              {plan.current_challenges && (
                                <span className="px-2 py-0.5 rounded-full bg-alira-gold/10 border border-accent text-alira-gold text-xs">
                                  Challenge
                                </span>
                              )}
                              {plan.generations && plan.generations.length > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-alira-primary/10 border border-alira-primary/20 text-alira-primary text-xs">
                                  AI Analysis
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-borderToken-subtle text-text-primary hover:bg-bg-muted flex-shrink-0"
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
                              className="border-borderToken-subtle text-red-400 hover:bg-red-500/10 hover:border-red-500/30 flex-shrink-0"
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

