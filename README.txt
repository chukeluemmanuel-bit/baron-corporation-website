BARON CORPORATION WEBSITE - VERSION 19
PREMIUM FULL REDESIGN

CORE EXPERIENCE
- Completely redesigned premium navy/gold visual system using the new uploaded Baron mark.
- Responsive sticky header, mobile navigation, animated hero, live role search, role catalog and support center.
- 931 common U.S. job titles remain available through the built-in career catalog.
- Applicants may type a custom job title if their exact role is not listed.
- Career-interest model remains transparent: a job title does not claim a current vacancy exists.
- Application submissions still go directly to the existing Formspree endpoint and are also copied to Supabase when available.
- Application form now requires a phone number, supports a preferred call window, saves drafts locally, and generates an application reference.

NEW MANAGEMENT DASHBOARD
- Premium management dashboard with application counts and filters.
- Search applicants by name, email, phone or job title.
- Filter by status and state.
- Review full application details in a modal.
- Update status: Waiting for Review / Reviewed / Contacted / Closed.
- Export filtered applications as CSV.
- Professional applicant email composer with three templates.
- Copy styled email into Gmail, open Gmail with a prefilled message, or copy plain text.
- The default 'Application Received' template says the request was received and that management may contact the applicant by phone or email as soon as a suitable next step is available.

ADMIN LOGIN FIX
Frontend management access now recognizes BOTH:
- mgt.baroncorporation@gmail.com
- elbaron511@gmail.com

IMPORTANT: Supabase RLS policies also need to allow the second email. Run v19-admin-policy-patch.sql ONCE in Supabase SQL Editor. Without that patch, elbaron511@gmail.com may enter the admin page but Supabase can still block application data.

EMAIL NOTE
This build does not claim to send branded HTML mail directly from Gmail automatically because that would require a mail-provider/API connection. The admin panel provides a safe no-extra-cost workflow:
1. Open applicant -> Prepare Confirmation Email.
2. Tap Copy Styled Email.
3. Tap Open Gmail to Send.
4. Paste the styled email into Gmail and send.
If the browser does not support styled clipboard content, the panel automatically falls back to plain-text copy.

DEPLOYMENT
Upload/replace these files in the existing GitHub repository and commit to main. Cloudflare should deploy automatically using your existing build configuration.
