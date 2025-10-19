'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, createClient } from '@/lib/supabase-client';
import ConversationalForm from '@/components/ConversationalForm';

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
          primary_goal: formData.immediate_goals,
          biggest_challenge: formData.current_challenges,
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
        
        // Check if it's a migration issue
        if (error.message.includes('column') || error.message.includes('current_challenges') || error.code === '42703') {
          alert('⚠️ Database Setup Required!\n\nThe database needs to be updated. Please:\n\n1. Go to Supabase Dashboard (app.supabase.com)\n2. Open SQL Editor\n3. Run the migration from:\n   db/migrations/003_integrate_existing_schema.sql\n\nThis will add the necessary columns to your existing tables.');
          throw new Error('Migration required');
        }
        
        alert(`Database Error: ${error.message}\n\nPlease check the console for details.`);
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
          formId: data.id,
          formData: formData
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
            <h1 className="text-2xl font-serif font-normal text-alira-white">
              ALIRA<span className="text-alira-gold">.</span>
            </h1>
            <button
              onClick={async () => {
                await auth.signOut();
                router.push('/');
              }}
              className="text-sm text-alira-white/60 hover:text-alira-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Conversational Form */}
      <main className="container mx-auto px-6 py-8">
        <ConversationalForm
          userId={user.id}
          initialData={initialIdea ? { business_idea: initialIdea } : undefined}
          onComplete={handleFormComplete}
        />
      </main>
    </div>
  );
}

export default function FormChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-alira-gold"></div>
      </div>
    }>
      <FormChatContent />
    </Suspense>
  );
}
