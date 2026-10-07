-- BARON CORPORATION V19 ADMIN POLICY PATCH
-- Run this once in Supabase SQL Editor so BOTH authorized management emails
-- can read/update applications and manage jobs.

-- Applications policies
DROP POLICY IF EXISTS "Management can read applications" ON public.applications;
CREATE POLICY "Management can read applications" ON public.applications
FOR SELECT TO authenticated
USING (lower(coalesce(auth.jwt() ->> 'email','')) IN (
  'mgt.baroncorporation@gmail.com',
  'elbaron511@gmail.com'
));

DROP POLICY IF EXISTS "Management can update applications" ON public.applications;
CREATE POLICY "Management can update applications" ON public.applications
FOR UPDATE TO authenticated
USING (lower(coalesce(auth.jwt() ->> 'email','')) IN (
  'mgt.baroncorporation@gmail.com',
  'elbaron511@gmail.com'
))
WITH CHECK (lower(coalesce(auth.jwt() ->> 'email','')) IN (
  'mgt.baroncorporation@gmail.com',
  'elbaron511@gmail.com'
));

-- Jobs policies retained for compatibility / future use
DROP POLICY IF EXISTS "Management can insert jobs" ON public.jobs;
CREATE POLICY "Management can insert jobs" ON public.jobs
FOR INSERT TO authenticated
WITH CHECK (lower(coalesce(auth.jwt() ->> 'email','')) IN (
  'mgt.baroncorporation@gmail.com',
  'elbaron511@gmail.com'
));

DROP POLICY IF EXISTS "Management can update jobs" ON public.jobs;
CREATE POLICY "Management can update jobs" ON public.jobs
FOR UPDATE TO authenticated
USING (lower(coalesce(auth.jwt() ->> 'email','')) IN (
  'mgt.baroncorporation@gmail.com',
  'elbaron511@gmail.com'
))
WITH CHECK (lower(coalesce(auth.jwt() ->> 'email','')) IN (
  'mgt.baroncorporation@gmail.com',
  'elbaron511@gmail.com'
));

DROP POLICY IF EXISTS "Management can delete jobs" ON public.jobs;
CREATE POLICY "Management can delete jobs" ON public.jobs
FOR DELETE TO authenticated
USING (lower(coalesce(auth.jwt() ->> 'email','')) IN (
  'mgt.baroncorporation@gmail.com',
  'elbaron511@gmail.com'
));

-- Update public jobs SELECT policy so admins can also see inactive jobs if used later.
DROP POLICY IF EXISTS "Public can read active jobs" ON public.jobs;
CREATE POLICY "Public can read active jobs" ON public.jobs
FOR SELECT TO anon, authenticated
USING (
  is_active = true OR lower(coalesce(auth.jwt() ->> 'email','')) IN (
    'mgt.baroncorporation@gmail.com',
    'elbaron511@gmail.com'
  )
);
