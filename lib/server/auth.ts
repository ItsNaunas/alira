/**
 * Server-Side Authentication Utilities
 * 
 * This module provides:
 * - User authentication verification
 * - Resource ownership validation
 * - Purchase requirement checks
 * - Type-safe user extraction from requests
 * 
 * SECURITY: These functions should ONLY be used in API routes (server-side)
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { errors } from './errors';

/**
 * User object returned from authentication
 */
export interface AuthUser {
  id: string;
  email: string;
  [key: string]: any;
}

/**
 * Create a Supabase client for server-side operations with service role
 * 
 * SECURITY: Service role key is only used server-side and never exposed to clients
 */
export function getServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration');
  }

  const { createClient } = require('@supabase/supabase-js');
  return createClient(supabaseUrl, supabaseServiceKey);
}

/**
 * Create a Supabase client for server-side operations with user context
 */
export async function getServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => {
          return cookieStore.getAll();
        },
        setAll: async (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Extract user from request (returns null if not authenticated)
 */
export async function getUser(req?: NextRequest): Promise<AuthUser | null> {
  try {
    const supabase = await getServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      ...user,
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

/**
 * Require authentication - throws 401 if user is not authenticated
 * 
 * Usage:
 * ```typescript
 * const user = await requireUser();
 * // User is guaranteed to be authenticated here
 * ```
 */
export async function requireUser(req?: NextRequest): Promise<AuthUser> {
  const user = await getUser(req);
  
  if (!user) {
    throw errors.unauthorized('You must be logged in to access this resource');
  }
  
  return user;
}

/**
 * Require resource ownership - throws 403 if user doesn't own the resource
 * 
 * Usage:
 * ```typescript
 * const user = await requireUser();
 * await requireOwnership(user.id, dashboard.user_id);
 * ```
 */
export function requireOwnership(
  userId: string,
  resourceUserId: string,
  resourceName = 'resource'
): void {
  if (userId !== resourceUserId) {
    throw errors.forbidden(`You do not have permission to access this ${resourceName}`);
  }
}

/**
 * Check if user has made a purchase
 */
export async function hasPurchased(userId: string): Promise<boolean> {
  const supabase = getServiceClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('has_purchased')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking purchase status:', error);
    return false;
  }

  return data?.has_purchased || false;
}

/**
 * Require purchase - throws 402 if user hasn't purchased
 * 
 * Usage:
 * ```typescript
 * const user = await requireUser();
 * await requirePurchase(user.id);
 * ```
 * 
 * Note: Can be bypassed in development with NEXT_PUBLIC_DEV_MODE=true
 */
export async function requirePurchase(userId: string): Promise<void> {
  // Allow bypass in development mode
  if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
    return;
  }

  const purchased = await hasPurchased(userId);
  
  if (!purchased) {
    throw errors.paymentRequired(
      'You must purchase access to use this feature'
    );
  }
}

/**
 * Verify resource exists and user owns it
 * 
 * Generic helper for checking ownership of any resource
 */
export async function verifyOwnership<T extends { user_id: string }>(
  table: string,
  resourceId: string,
  userId: string,
  resourceName = 'resource'
): Promise<T> {
  const supabase = getServiceClient();
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', resourceId)
    .single();

  if (error || !data) {
    throw errors.notFound(resourceName);
  }

  requireOwnership(userId, data.user_id, resourceName);
  
  return data as T;
}

