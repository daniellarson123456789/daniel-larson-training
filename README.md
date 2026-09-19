# Daniel Larson Training

Permanent marketing / SEO website for Daniel Larson Training.

## Architecture

- Astro static site
- GitHub is the source of truth
- Vercel deploys from `main`
- Thinkific remains the authenticated course, checkout, and student-account platform
- `portal.daniellarsontraining.com` remains the Thinkific portal
- `www.daniellarsontraining.com` will move to Vercel only after the replacement site is complete

## Current build status

Step 1 foundation:
- global layout
- desktop + mobile navigation
- footer
- shared design tokens / CSS
- shared components
- centralized product/course/site data
- SEO + structured-data framework
- Course Portal shell
- page routes / placeholders
- custom 404
- preview deployments default to `noindex,nofollow`

## Indexing safety

The site defaults to `noindex,nofollow`.

At launch, add this Vercel environment variable:

`PUBLIC_SITE_ENV=production`

That switches the shared layout to index/follow.

## Commands

```sh
npm run dev
npm run build
npm run preview
```

## Page routes

- `/` — Sales Licensing
- `/broker-licensing/`
- `/post-licensing/`
- `/14ce/`
- `/exam-prep/`
- `/about/`
- `/course-portal/`
