BARON CORPORATION WEBSITE - VERSION 17
CAREER-INTEREST MARKETPLACE REDESIGN

WHAT CHANGED
- Homepage now centers on choosing/searching job titles rather than published vacancies.
- Built-in catalog contains 900+ common U.S. job titles across major job families.
- Users can also type any job title even when it is not in the catalog.
- Live autocomplete suggests matching titles while the user types.
- Full job-title dropdown is available on the homepage.
- Preferred U.S. state can be selected.
- Selecting a title opens the application form directly.
- Applications end at: Waiting for Review.
- All later hiring communication is intended to continue through email.
- No resume is requested in the initial application.
- Management dashboard lists applications and includes an Email Applicant action.

IMPORTANT TRANSPARENCY
- The job-title catalog represents career interests/job types.
- A catalog title does NOT claim a current vacancy exists.
- Baron Corporation may review the applicant and source a matching opportunity afterward.
- Submission does not guarantee a vacancy, interview, or employment.

SUPABASE
Before V17 applications can submit, run v17-database-migration.sql once.
This makes applications.job_id optional because V17 no longer requires a pre-created vacancy record.

EMAIL NOTIFICATIONS
Applications are stored in Supabase and visible in management.html.
Automatic 'new application' notification emails to management still require an outbound email service or server-side email integration.
The dashboard already provides an Email Applicant button for follow-up.
