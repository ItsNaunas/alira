'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, createClient } from '@/lib/supabase-client';
import { Spinner } from '@/components/ui/spinner';
import SegmentedConversationForm from '@/components/SegmentedConversationForm';

function FormChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialIdea, setInitialIdea] = useState('');

  const checkAuth = useCallback(async () => {
    const { user, error } = await auth.getUser();
    
    if (error || !user) {
      // Not authenticated, redirect to homepage
      router.push('/');
      return;
    }
    
    setUser(user);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    checkAuth();
    
    // Get the initial idea from URL
    const idea = searchParams.get('idea');
    if (idea) {
      setInitialIdea(idea);
    }
  }, [checkAuth, searchParams]);

  const handleFormComplete = async (formData: any) => {
    console.log('=== FORM COMPLETION STARTED ===');
    console.log('Form data:', formData);
    console.log('User:', user);
    
    try {
      // Save the form data to database
      const supabase = createClient();
      
      console.log('Attempting to save to database...');
      const { data, error } = await supabase
        .from('dashboards')
        .insert({
          user_id: user.id,
          business_name: formData.business_idea?.substring(0, 100) || 'Untitled Business',
          current_challenges: formData.current_challenges,
          immediate_goals: formData.immediate_goals,
          service_interest: formData.service_interest || [],
          current_tools: formData.current_tools,
          form_data: formData,
          status: 'complete'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        console.error('❌ Error details:', JSON.stringify(error, null, 2));
        
        // Check if it's specifically a missing column error
        if (error.code === '42703' && error.message && error.message.includes('current_challenges')) {
          alert('⚠️ Database Setup Required!\n\nThe database needs to be updated. Please:\n\n1. Go to Supabase Dashboard (app.supabase.com)\n2. Open SQL Editor\n3. Run the migration from:\n   db/migrations/003_integrate_existing_schema_clean.sql\n\nThis will add the necessary columns to your existing tables.');
          throw new Error('Migration required');
        }
        
        // Show the actual error for debugging
        alert(`Database Error: ${error.message || 'Unknown error'}\n\nError Code: ${error.code || 'No code'}\n\nPlease check the console for details.`);
        throw error;
      }

      console.log('✅ Saved to database:', data);

      // Generate the business plan (call AI API)
      console.log('Attempting to generate business plan...');
      const generateResponse = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: {
            ...formData,
            dashboardId: data.id,
            userId: user.id
          }
        }),
      });

      if (!generateResponse.ok) {
        const errorText = await generateResponse.text();
        console.error('❌ Generate plan error:', errorText);
        throw new Error(`Failed to generate plan: ${generateResponse.statusText}`);
      }

      console.log('✅ Business plan generated');
      console.log('Redirecting to dashboard...');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ Error completing form:', error);
      
      // Show user-friendly error
      if (error instanceof Error && error.message === 'Migration required') {
        // Already showed detailed alert above
        return;
      }
      
      alert('⚠️ Error Creating Plan\n\nThere was an error saving your plan. Please:\n\n1. Check the browser console (F12) for details\n2. Make sure database migration is complete\n3. Try again or contact support\n\nError: ' + (error instanceof Error ? error.message : 'Unknown error'));
      
      // Re-throw so the form component knows there was an error
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page">
        <Spinner size="lg" color="gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Header */}
      <header className="border-b border-borderToken-subtle bg-bg-page/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-normal text-text-primary">
              ALIRA<span className="text-alira-gold">.</span>
            </h1>
            <button
              onClick={async () => {
                await auth.signOut();
                router.push('/');
              }}
              className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Segmented AI Conversation Form */}
      <main>
        <SegmentedConversationForm
          initialData={initialIdea ? { business_idea: initialIdea } : undefined}
          onComplete={handleFormComplete}
          useAuthenticatedFlow={true}
          userId={user?.id}
        />
      </main>
    </div>
  );
}

export default function FormChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg-page">
        <Spinner size="lg" color="gold" />
      </div>
    }>
      <FormChatContent />
    </Suspense>
  );
}
