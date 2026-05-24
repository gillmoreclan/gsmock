# Real Build Plan

_Written after stage-two prototype. Start a new session, read this file, then invoke the writing-plans skill to generate the implementation plan for whichever milestone is next._

---

## What the real build is

A multi-user web app replacing the single-user prototype. Multiple parents in a group share a live view of events, see each other's RSVPs in real time, and manage the group roster. The prototype validated the interaction model; this is the production version of it.

**Backend:** Firebase (Firestore for data, Firebase Auth for login)  
**Auth model:** Passwordless magic-link email (no passwords, no app store install)  
**Real-time:** Firestore listeners push updates to all connected clients instantly  
**Hosting:** Firebase Hosting (or GitHub Pages — decide at deployment time)

---

## Strategy: local-first with a swappable data adapter

Rather than wiring Firebase in from day one, the data layer is built as a simple adapter interface. A mock adapter stores everything in memory (reset on refresh, same as the prototype). A Firebase adapter talks to Firestore. You swap adapters with a one-line change when ready to go live.

This means:
- All feature development happens locally, no Firebase account required until Milestone 8
- The mock adapter is fast and inspectable — easy to test edge cases
- The Firebase adapter is written once, against a stable interface

---

## Tech stack

- **Vite** — local dev server with hot reload, zero-config, easy Firebase SDK integration
- **Vanilla JS (ES modules)** — same as the prototype, no framework required
- **Firebase JS SDK v10** (modular) — installed as an npm package via Vite
- **CSS** — extending the prototype's stylesheet

_If state management gets unwieldy mid-build, Vue 3 is a natural upgrade path — its reactivity model maps cleanly to Firestore listeners. Decide at that point._

---

## Firestore data model

```
groups/{groupId}
  name: string
  createdAt: timestamp
  inviteCode: string          ← short code for joining

groups/{groupId}/members/{userId}
  name: string
  email: string
  color: string               ← avatar color, assigned on join
  initials: string
  role: 'admin' | 'member'
  joinedAt: timestamp

groups/{groupId}/events/{eventId}
  title: string
  date: string                ← YYYY-MM-DD
  time: string
  location: string
  note: string
  link: string
  type: 'our-meeting' | 'our-event' | 'org-event'
  cancelled: boolean
  createdBy: userId
  createdAt: timestamp

groups/{groupId}/events/{eventId}/rsvps/{userId}
  attending: boolean
  updatedAt: timestamp
```

---

## Milestones

---

### M1 — Project setup & local dev environment
**Goal:** A Vite project running locally, Firebase SDK installed but not yet connected.

Key tasks:
- Install Node.js if not present (walkthrough)
- `npm create vite@latest` — scaffold a vanilla JS project
- `npm install firebase` — SDK installed, not configured yet
- Port prototype HTML/CSS/JS into the Vite project structure
- Confirm `npm run dev` shows the prototype running at localhost

Deliverable: prototype running locally via Vite hot-reload dev server.

---

### M2 — App shell & navigation
**Goal:** Clean screen architecture adapted for the real build.

Key tasks:
- Define all screens: Home, Event Detail, Create/Edit, Login, Waiting (magic link sent), Group Setup (first run)
- Router handles all transitions (extending prototype nav.js)
- Bottom nav updated (if Manage screen is added back for admins)
- Skeleton/loading state components

Deliverable: all screens reachable via navigation, content placeholder until data layer lands.

---

### M3 — Mock data adapter
**Goal:** All data operations go through an adapter interface backed by in-memory state.

Key tasks:
- Define the adapter interface: `getEvents()`, `addEvent()`, `updateEvent()`, `cancelEvent()`, `removeEvent()`, `toggleRsvp()`, `getMembers()`, `getCurrentUser()`, etc.
- Implement `MockAdapter` using in-memory JS objects matching the Firestore schema exactly
- Seed with realistic fake data (multi-user: several members with RSVPs)
- Wire all screens to use the adapter

Deliverable: full app working locally against mock data, no Firebase needed.

---

### M4 — Auth flow (mocked)
**Goal:** Login UI and session model, fully mocked — no real email sent.

Key tasks:
- Login screen: email input + "Send magic link" button
- Waiting screen: "Check your email" with resend option
- Mock: clicking the button immediately "authenticates" as a hardcoded user (skips real email)
- Session object: `{ userId, name, email, color, initials }` stored in module state
- Logged-out guard: unauthenticated users see login screen
- First-run flow: after first login, prompt to create or join a group

Deliverable: full login → home flow working locally with a fake session.

---

### M5 — Events (full CRUD against mock store)
**Goal:** All event operations from the prototype, plus type selection and org-event distinction.

Key tasks:
- Create event (title, date, time, location, note, link, type selector)
- Edit event (date change clears RSVP list — same behavior as prototype)
- Cancel / uncancel
- Remove
- Clone (pre-fill from existing)
- Multi-date affordance (create one event per selected date)
- New: **type selector** in the form (our meeting / our event / org event)
- Events appear sorted chronologically; scope filter works as in prototype

Deliverable: full event lifecycle working end-to-end against mock data.

---

### M6 — RSVPs and who's coming
**Goal:** Multi-user-aware RSVP state, displayed correctly for any logged-in user.

Key tasks:
- "I'm coming" toggle updates the current user's RSVP in the mock store
- Count and avatar row reflect all RSVPs across all (mocked) users
- Expand/collapse names list
- Avatar color and initials come from member profile
- Edge cases: user joins after RSVPs exist, user removes RSVP, event cancelled

Deliverable: RSVP toggle and who's-coming expansion working with multi-user mock data.

---

### M7 — Group & member management
**Goal:** Group creation, invite link, and a real member management screen.

Key tasks:
- First-run: create group (name) or join via invite code
- Invite code display + copy-to-clipboard
- Manage screen: member list with name, email, role indicator
- Admin can remove members
- Leave group option

Deliverable: group setup and member management working against mock store.

---

### M8 — Firebase setup (walkthrough)
**Goal:** A real Firebase project configured and credentials in hand — no code changes yet.

Steps (will be walked through together):
1. Create a Firebase project at console.firebase.google.com
2. Enable Firestore (production mode, start locked)
3. Enable Authentication → Email/passwordless (Email link sign-in)
4. Register a web app → copy the `firebaseConfig` object
5. Set Firestore security rules (members can read/write their group only)
6. Add authorized domain for magic links (localhost + production URL)
7. Create `.env.local` with Firebase config values (keep out of git)

Deliverable: Firebase project live, credentials ready, Firestore and Auth enabled.

---

### M9 — Firebase adapter swap-in
**Goal:** Replace `MockAdapter` with `FirebaseAdapter` — one config change, everything works.

Key tasks:
- Implement `FirebaseAdapter` using the same interface as `MockAdapter`
- Auth: `signInWithEmailLink`, `sendSignInLinkToEmail`, `onAuthStateChanged`
- Firestore: `addDoc`, `updateDoc`, `deleteDoc`, `getDoc`, `getDocs`
- Test each operation against real Firestore (events, RSVPs, members)
- Error handling: network failures, permission denied, invalid invite code

Deliverable: app running against real Firebase with real persistence and real auth emails.

---

### M10 — Real-time updates
**Goal:** All connected clients see changes instantly without refreshing.

Key tasks:
- Replace one-time Firestore reads with `onSnapshot` listeners
- Events list updates live when anyone adds/edits/cancels
- RSVP count and names update live when anyone toggles
- Unsubscribe listeners on screen exit to avoid memory leaks
- Handle the "loading" → "data" transition gracefully

Deliverable: open the app on two devices, RSVP on one, see the count update on the other instantly.

---

### M11 — Polish & error handling
**Goal:** App feels solid and handles the real world.

Key tasks:
- Loading skeletons for events list (not a spinner — layout-matching placeholders)
- Empty states (no events this week, no members yet)
- Offline detection: show a banner, disable write operations
- Auth errors: expired link, wrong device, resend flow
- Form validation with friendly inline messages
- Confirm dialog for destructive actions (remove event, leave group)

Deliverable: no unhandled states, no silent failures, no blank screens.

---

### M12 — Deployment
**Goal:** App live at a real URL, ready to share.

Key tasks:
- `npm install -g firebase-tools` + `firebase login`
- `firebase init hosting` — point to Vite build output
- `npm run build` + `firebase deploy`
- Add production domain to Firebase Auth authorized domains
- Test magic link flow end-to-end on production URL
- Share URL with the group for first real use

Deliverable: live app, real users, real data.

---

## Starting a new session

Tell Claude: _"Read docs/real-build-plan.md, then let's start on Milestone N."_

Claude will read this file, load context, and invoke the writing-plans skill to produce a detailed implementation plan for that milestone before touching any code.
