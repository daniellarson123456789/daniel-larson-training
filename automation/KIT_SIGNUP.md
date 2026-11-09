# Checklist email signup integration

Capture-only website integration. Nothing in this checkout activates Kit sequences or sends an email by itself. Daniel authorized the website signup release on November 8, 2026. The launch switch stays disabled by default locally; the production build enables it explicitly.

- Page: `/licensing-checklist/`
- Component: `src/components/ChecklistSignup.astro`
- Kit form ID: `10159264`
- UID: `4f0e3b889f`
- Native embed: `https://daniel-larson-training.kit.com/4f0e3b889f/index.js`
- Hosted fallback: `https://daniel-larson-training.kit.com/4f0e3b889f`
- Signup notice: `/email-signup-privacy/`

The component renders only when the build environment contains exactly `PUBLIC_KIT_SIGNUP_ENABLED=true`. When absent or false, the section, Kit script and hosted signup link are omitted from generated HTML. The full checklist remains available and printable. This website switch does not disable the separately hosted Kit form.

The native Kit embed owns submission, errors and confirmation. The website does not intercept submissions, claim success, auto-confirm an address or apply a marketing tag. First name and stage are optional. The email permission checkbox is optional and unchecked by default, with tag ID `25568034`. Only confirmed subscribers who also have that tag may enter nurture. Public brokerage, DBPR and association lists stay outside Kit.

Capture can launch independently of offer emails. Sender-domain authentication is complete. The hosted form has accepted a controlled signup, delivered an authenticated confirmation, confirmed the subscriber and opened the live checklist; native unsubscribe was also tested. Recommendations are off. Those results do not establish website-embedded submission or permission to send offer emails.

For confirmation-only capture, publish the narrow signup notice with the form, then verify the enabled production embed, unchecked optional consent, notice/fallback links and checklist access without signup. This website release leaves automation `2214851`, all six sequences and their draft email states unchanged. Purchase/reply synchronization, complete nurture routing, final offer-email copy review and per-video UTM storage are not prerequisites for this capture-only step. The native form owns confirmation; enabling the website flag does not activate nurture.

Before enabling offer emails, finish Daniel's review of the applicable variants and test confirmed-plus-consented eligibility, native exclusions, stage routing/reentry, and purchase/reply/opt-out/bounce suppression. Repeat signup currently retains old stage tags; configured conflict exclusions do not establish latest-stage routing. Do not treat capture or a successful confirmation test as approval for later marketing.

The component does not implement or verify per-video UTM persistence; add that measurement before claiming attributed conversions. Five previously authorized test messages have been used, so this guide grants no additional test-send permission. The notice is specific to this signup; it makes no promises about cookies, data sales, retention or site-wide legal compliance.

Production capture uses `PUBLIC_KIT_SIGNUP_ENABLED=true` in the Vercel production environment and a fresh build. Publish the school `/licensing-checklist/` URL as the signup destination so visitors can read the notice and resource together. To disable again, unset the variable or set it to `false`, then rebuild and deploy that version. Merely changing an environment value cannot alter HTML already deployed by this static site.

For a local check without publishing:

```powershell
$env:PUBLIC_KIT_SIGNUP_ENABLED = 'true'
node node_modules/astro/bin/astro.mjs build
Remove-Item Env:PUBLIC_KIT_SIGNUP_ENABLED
```

An enabled local build contains a real Kit form; do not submit it without authorization for the controlled test. A build itself does not load the external script or contact subscribers. Restore a disabled build before preparing any deployment package unless launch has been approved.
