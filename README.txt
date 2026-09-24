BARON CORPORATION WEBSITE - VERSION 2

Company profile used:
- Official name: Baron Corporation
- Private engineering company
- Based in Los Angeles, California
- Takes engineering/project jobs and manages them through completion
- Hires workers and builds project teams
- Management email: mgt.baroncorporation@gmail.com

Included sections:
- Corporate home / hero
- About Baron Corporation
- Engineering capabilities
- Project delivery
- Safety / quality / execution standard
- Careers & workforce
- Contact form
- Mobile-responsive navigation
- Scroll animations

Still needed before public launch:
- Official street/office address (if you want it public)
- Business phone number
- Exact engineering specialties / types of jobs accepted
- Real project photos and case studies
- Logo, if you already have one
- Legal privacy/terms text
- Hosting/domain connection


V4 updates:
- Added supplied Baron Corporation logo to website header
- Added management phone: +1 562-567-8173
- No street/office address is displayed
- Public service base remains Los Angeles, California

V7 CAREERS UPDATE
- Full online employment application form added.
- Resume/CV upload is intentionally excluded.
- Applicants are instructed to email resumes/CVs to mgt.baroncorporation@gmail.com.
- Management email is also listed for career questions and follow-up.
- No sensitive financial or identity-number fields are requested.
- The preview form does not transmit data until a live form backend is connected.
- The prior preview visibility bug was fixed: website content is visible even if JavaScript is blocked.

V8 PROJECTS UPDATE
- Added a dedicated Projects / Project Capabilities page (projects.html).
- Homepage Projects navigation now opens the dedicated page.
- Reframed project content as capabilities, not completed client case studies.
- Added Civil & Structural, Mechanical, Electrical, Facility Engineering,
  Construction Support, Welding & Fabrication, Industrial Equipment,
  and Project Management capability sections.
- Added typical scope examples and compliance caveats where appropriate.
- Added a future-case-study placeholder for real approved completed projects.
- No client names, contract values, project dates, certifications, awards,
  or performance outcomes were invented.

V9 VISUAL REDESIGN
- Complete visual redesign in white, black, gold, and deep blue.
- New premium hero, navigation, topbar, service bento, project presentation, careers layout, quote section, and footer.
- Projects page redesigned to match.
- Content and company information preserved.
- Applicant application flow preserved.

V13 SERVICES UPDATE
- Added a dedicated Services overview page.
- Added 10 detailed service pages.
- Updated homepage service cards to open the detailed service pages.
- Preserved V12/V11 visual direction and mobile layout.
- Added scope examples, environments, delivery approach, and careful compliance notes.
- No certifications, licenses, project outcomes, client names, or regulated approvals were invented.

V14 ACCOUNT / PORTAL UPDATE
- Replaced JavaScript-dependent mobile hamburger navigation with a CSS-only menu.
- Added Sign In and Create Account links to desktop and mobile navigation.
- Added sign-in.html.
- Added create-account.html with Client and Applicant account types.
- Added client-portal.html preview dashboard.
- Added applicant-portal.html preview dashboard.
- No real passwords or account data are stored in this preview.
- Real authentication requires backend/database deployment.
- Résumés remain email-only for applicants.

V15 LIVE AUTHENTICATION UPDATE
- Connected Create Account and Sign In pages to Supabase Auth.
- Supabase project URL: https://qonmwwjaefzcpdymjkyo.supabase.co
- Uses the project's browser-safe publishable key. No secret/service-role key is included.
- Client and Applicant account types are stored as signup metadata.
- Email/password signup is live.
- Email confirmation redirects to https://baroncorporation.space/sign-in.html?verified=1.
- Sign-in routes users to the appropriate Client or Applicant portal.
- Portal pages require an authenticated session and redirect signed-out visitors to Sign In.
- Portal pages display the signed-in user's name and email and include working Sign Out actions.
- Signed-in navigation changes from Sign In/Create Account to Portal/Sign Out.
- Password UI requires at least 8 characters with lowercase, uppercase, and a digit.
- Public career application and project inquiry forms are NOT yet stored in Supabase; they remain preview-only until database tables, RLS policies, and anti-spam handling are configured.
- Before testing email confirmation, verify Supabase Authentication > URL Configuration has Site URL set to https://baroncorporation.space and the configured redirect URLs include the sign-in/client/applicant pages.
