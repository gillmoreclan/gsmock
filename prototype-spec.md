# Interactive Prototype Spec — Stage Two

**Purpose:** Test whether the *flow* of the tool feels good to move through. Nothing more.

**This is NOT the real build.** No backend, no auth, no real data, no persistence. Hardcoded fake data that resets on every page refresh is correct and intended. Do not add a database, login, or browser storage. If a feature would require any of those, it is out of scope for this prototype.

**Hosting target:** static site, deployable to GitHub Pages (same as the stage-one mockup). Plain front-end only.

---

## What this prototype is for

Parents reacting to the static mockup showed *pull* toward one thing specifically: seeing everything at a glance — "see everything at once," "what's coming up." That is the hero. The prototype must make opening the app and instantly grasping the shape of the week (and what's ahead) feel effortless and a little satisfying. Posting and responding matter, but the glance is the star. Build accordingly.

## Single-user reality (important framing)

This prototype is for *one person clicking through to feel the flow*, not for multiple parents to use together. There is no shared state and there should be no pretense of it. Because no other user can see what "you" did, persistence has no value — a posted event surviving a refresh would be a hollow illusion, not a real test. Reset-on-refresh is the honest and correct behavior.

---

## Screens & flows to build

### 1. The glance (home) — the hero screen
- Lands directly here. No login screen, no splash.
- A list of upcoming events, **"this week" shown by default**.
- A single unified control to change which slice of events is in view: expand the horizon (e.g. "this week" → "next 30 days") and filter (e.g. "our events," "org events"). Treat horizon and filter as one mechanism, not separate features.
- Each event card shows: date/time, a type tag (our meeting / our event / from the council), title, location, optional short note, a **count** of who's coming ("8 coming"), and an **"I'm coming" toggle**.
- **Count is the at-a-glance signal.** Names are NOT shown by default — they live one tap behind the count (see flow 3).

### 2. "I'm coming" toggle
- Tapping toggles the current user's state on that event: not-coming → coming (button fills, count increments, your avatar joins) and back.
- Purely visual/in-memory. Resets on refresh.

### 3. See who's coming (progressive disclosure)
- Tapping the count (or a clear affordance on the card) expands to reveal the **names** of who's coming — the positive roster only.
- Never show who *hasn't* responded.
- Collapses back cleanly.

### 4. Create an event
- Reachable from a clear "+" affordance.
- Fields: **title (required)**, **date (required)**, optional link, optional screenshot/image, optional freeform note.
- On submit, the new event appears in the list (in-memory; gone on refresh).
- Keep the form light — this should feel like barely more effort than posting a screenshot.
- Include the two creation conveniences as visible affordances (they can be lightly faked):
  - **Multi-date:** tap several dates, get one event per date.
  - **Clone:** start a new event pre-filled from an existing one (carry title/link/note; do NOT carry date, responses, or screenshot).

### 5. Edit / cancel / remove (lightweight)
- From an event you "own" (in this single-user prototype, treat all events as ownable so the flows are reachable):
  - **Edit** fields. A **date change clears the coming-list** (show this behavior — it's a deliberate design point). Other edits leave it intact.
  - **Cancel:** event stays visible but clearly marked cancelled.
  - **Remove:** event disappears.

### 6. Manage view (stub)
- A simple screen showing a **plain list of members** (names + fake emails) with add/remove affordances.
- No real auth behind it. This is just to feel the shape of the manager experience. Keep it minimal.

---

## Explicitly OUT of scope (do not build)
- Any login, auth, magic link, or email/SMS sending.
- Any real or persistent storage (no backend, no localStorage/sessionStorage).
- Any notifications, reminders, or push.
- Shared/multi-user state of any kind.
- Real per-event shareable links (a visible "copy link" button is fine as a non-functional affordance if it helps the flow feel complete).
- Role/capability claiming ("I have snack," "I can drive") — phase two, not this.

## Design direction
- Calm, friendly, conventional, mobile-first. It should feel like a trustworthy phone app, not a design showcase.
- Reuse the visual language of the stage-one mockup where sensible (green accent, clean cards, count-with-avatars, type tags).
- All data fake and generic. No real names, no real troop name, nothing that reads as a specific branded organization.

## Success test
After clicking through: does opening the app and seeing the week feel effortless and a little satisfying? Is posting obvious? Is "see who's coming" a natural tap? If yes, the flow is validated and the next step is the real Firebase build. If a flow feels clumsy, that's the cheap-to-fix finding this stage exists to surface.
