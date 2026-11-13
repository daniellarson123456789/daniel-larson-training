// Inline email signup for guide articles. Reuses the same Kit form (4f0e3b889f)
// as the licensing checklist page and the same build-time switch as
// src/components/ChecklistSignup.astro: unless PUBLIC_KIT_SIGNUP_ENABLED is "true",
// no signup markup or third-party script is added to the article HTML.
const enabled = import.meta.env.PUBLIC_KIT_SIGNUP_ENABLED === "true";

export type SignupVariant = "licensing" | "renewal";

const copy: Record<SignupVariant, { eyebrow: string; title: string; intro: string }> = {
  licensing: {
    eyebrow: "Free Florida licensing checklist",
    title: "Get the checklist by email.",
    intro: "Every licensing step on one printable page: application, fingerprints, course certificate, and exam day. Enter your email to get a confirmation with a link to the checklist.",
  },
  renewal: {
    eyebrow: "Florida licensing checklist and renewal tips",
    title: "Keep your next step in your inbox.",
    intro: "Enter your email to get a confirmation with a link to Daniel’s Florida licensing checklist. Choose your licensing stage on the form so any follow-up tips fit where you are.",
  },
};

export function renderGuideSignup(variant: SignupVariant = "licensing") {
  const c = copy[variant];
  return `<aside class="guide-signup" id="email-signup" aria-label="Email signup">
    <div class="signup-copy">
      <p class="eyebrow">${c.eyebrow}</p>
      <p class="signup-title">${c.title}</p>
      <p>${c.intro} Follow-up tips are optional: tick the permission box if you want them, and unsubscribe anytime.</p>
      <p class="signup-details">Read our <a href="/email-signup-privacy/">email signup privacy notice</a>, or <a href="/licensing-checklist/">use the checklist without signing up</a>.</p>
    </div>
    <div class="signup-form">
      <script async data-uid="4f0e3b889f" src="https://daniel-larson-training.kit.com/4f0e3b889f/index.js"></script>
      <p class="form-help">Form not showing? <a href="https://daniel-larson-training.kit.com/4f0e3b889f">Open the email signup form</a>.</p>
    </div>
  </aside>`;
}

const sourcesSection = /<section[^>]*class="sources"/;

/** Places one signup block just before the article's references section. */
export function addGuideSignup(markup: string, variant: SignupVariant = "licensing") {
  if (!enabled) return markup;
  const match = markup.match(sourcesSection);
  if (!match || match.index === undefined) throw new Error("Missing guide sources section for email signup placement");
  return markup.slice(0, match.index) + renderGuideSignup(variant) + "\n  " + markup.slice(match.index);
}
