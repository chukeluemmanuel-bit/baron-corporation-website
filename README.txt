BARON CORPORATION WEBSITE - VERSION 16
JOB MARKETPLACE REDESIGN

PURPOSE
- Replaces the engineering-services presentation with a U.S. job marketplace.
- Main public flow: Search job -> View details -> Apply -> Waiting for Review.
- After submission, all further communication continues through email.
- Résumés are NOT requested in the first website application.

WHAT V16 INCLUDES
- Searchable homepage with live autocomplete as the user types.
- State filter and job-type filtering.
- Jobs page, job detail page, application page, and confirmation page.
- Confirmation language: Waiting for Review / next steps by email.
- No SSN, banking, card, password, or payment fields.
- Private management page to publish/hide/delete job listings and review applications.
- "Email applicant" action for continuing the process by email.
- Existing Supabase project URL + browser-safe publishable key.
- Old engineering service URLs redirect to the jobs marketplace.

IMPORTANT: ONE DATABASE STEP IS REQUIRED
Before applications and job listings can work, open Supabase > SQL Editor and run:
  supabase-job-marketplace.sql
This creates the jobs and applications tables and Row Level Security policies.

MANAGEMENT ACCESS
- Management page: /management.html
- Only a signed-in Supabase user whose email is exactly:
  mgt.baroncorporation@gmail.com
  can manage jobs or read applications.
- If that email does not yet have a Supabase Auth account, create/confirm it using create-account.html or Supabase Authentication > Users.

DEPLOYMENT
- Upload/replace these V16 files in the GitHub repo already connected to Cloudflare:
  chukeluemmanuel-bit/baron-corporation-website
- Commit directly to main.
- Cloudflare should build automatically using the deployment configuration already set up.

ABOUT "ALL JOBS IN THE USA"
V16 searches jobs that are actually published in your Baron Jobs database.
It deliberately does NOT fabricate or claim to contain every U.S. opening.
To automatically import nationwide listings from other employers, a legitimate jobs-data provider/API must be connected later.

APPLICATION FLOW
1. Visitor searches a job.
2. Visitor opens the job detail page.
3. Visitor submits the application.
4. Website shows "Waiting for Review."
5. Management reviews the application in /management.html.
6. Any further request, including a résumé request, happens by email.
