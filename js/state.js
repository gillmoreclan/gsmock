export const state = {
  screen: 'home',
  formMode: 'create',
  editingId: null,
  cloneId: null,
  scope: 'this-week',
  events: [],
  rsvps: new Map(),
  expanded: new Set(),
};

const ME = { initials: 'DM', color: '#2f7d5b', name: 'Dana M.', you: true };

let _nextId = 100;

export function seedData() {
  state.events = [
    {
      id: 1,
      title: 'Weekly Meeting — Maple Hall',
      date: '2026-05-27',
      time: '6:30 PM',
      location: 'Maple Community Hall, Room B',
      note: 'snack: open',
      type: 'our-meeting',
      link: '',
      cancelled: false,
      removed: false,
      attendees: [
        { initials: 'DM', color: '#2f7d5b', name: 'Dana M.', you: true },
        { initials: 'PS', color: '#3a6ea5', name: 'Priya S.' },
        { initials: 'RK', color: '#b5783a', name: 'Rachel K.' },
        { initials: 'TB', color: '#c2622e', name: 'The Bauers' },
        { initials: 'JL', color: '#4a8a8a', name: 'Jordan L.' },
        { initials: 'MN', color: '#8a5fae', name: 'Maya N.' },
        { initials: 'CO', color: '#6b7d3a', name: 'Chris O.' },
        { initials: 'SF', color: '#a8456b', name: 'The Floreses' },
      ],
    },
    {
      id: 2,
      title: 'Sunday Social Walk',
      date: '2026-05-25',
      time: '10:00 AM',
      location: 'Riverside Park, main entrance',
      note: 'bring kids',
      type: 'our-event',
      link: '',
      cancelled: false,
      removed: false,
      attendees: [
        { initials: 'PS', color: '#3a6ea5', name: 'Priya S.' },
        { initials: 'JL', color: '#4a8a8a', name: 'Jordan L.' },
        { initials: 'CO', color: '#6b7d3a', name: 'Chris O.' },
        { initials: 'TB', color: '#c2622e', name: 'The Bauers' },
      ],
    },
    {
      id: 3,
      title: 'Council: Summer Preview Night',
      date: '2026-05-29',
      time: '7:00 PM',
      location: 'Council Chambers, 2nd floor',
      note: '',
      type: 'org-event',
      link: '',
      cancelled: false,
      removed: false,
      attendees: [
        { initials: 'RK', color: '#b5783a', name: 'Rachel K.' },
        { initials: 'MN', color: '#8a5fae', name: 'Maya N.' },
        { initials: 'SF', color: '#a8456b', name: 'The Floreses' },
      ],
    },
    {
      id: 4,
      title: 'Parent Planning Session',
      date: '2026-06-03',
      time: '7:00 PM',
      location: 'Virtual — Zoom',
      note: '',
      type: 'our-meeting',
      link: '',
      cancelled: false,
      removed: false,
      attendees: [
        { initials: 'DM', color: '#2f7d5b', name: 'Dana M.', you: true },
        { initials: 'RK', color: '#b5783a', name: 'Rachel K.' },
        { initials: 'CO', color: '#6b7d3a', name: 'Chris O.' },
      ],
    },
    {
      id: 5,
      title: 'Outdoor Adventure: Beekeeping Visit',
      date: '2026-06-07',
      time: '10:00 AM',
      location: 'Oakland Commons, Southfield',
      note: 'sign-up on council site ↗',
      type: 'org-event',
      link: '',
      cancelled: false,
      removed: false,
      attendees: [
        { initials: 'PS', color: '#3a6ea5', name: 'Priya S.' },
        { initials: 'TB', color: '#c2622e', name: 'The Bauers' },
        { initials: 'JL', color: '#4a8a8a', name: 'Jordan L.' },
      ],
    },
    {
      id: 6,
      title: 'Spring Park Cleanup',
      date: '2026-06-14',
      time: '2:00 PM',
      location: 'Riverside Park, main entrance',
      note: 'bring gloves',
      type: 'our-event',
      link: '',
      cancelled: false,
      removed: false,
      attendees: [
        { initials: 'DM', color: '#2f7d5b', name: 'Dana M.', you: true },
        { initials: 'JL', color: '#4a8a8a', name: 'Jordan L.' },
        { initials: 'CO', color: '#6b7d3a', name: 'Chris O.' },
        { initials: 'RK', color: '#b5783a', name: 'Rachel K.' },
        { initials: 'PS', color: '#3a6ea5', name: 'Priya S.' },
        { initials: 'TB', color: '#c2622e', name: 'The Bauers' },
        { initials: 'MN', color: '#8a5fae', name: 'Maya N.' },
        { initials: 'SF', color: '#a8456b', name: 'The Floreses' },
        { initials: 'JW', color: '#5a7a8a', name: 'Jamie W.' },
        { initials: 'BT', color: '#7a5a9a', name: 'The Brennans' },
        { initials: 'AK', color: '#8a6a4a', name: 'Alex K.' },
        { initials: 'OM', color: '#6a8a4a', name: 'The Millers' },
      ],
    },
    {
      id: 7,
      title: 'Community Service Day',
      date: '2026-06-20',
      time: '9:00 AM',
      location: 'City Hall Plaza',
      note: '',
      type: 'org-event',
      link: '',
      cancelled: false,
      removed: false,
      attendees: [
        { initials: 'PS', color: '#3a6ea5', name: 'Priya S.' },
        { initials: 'MN', color: '#8a5fae', name: 'Maya N.' },
      ],
    },
  ];

  // user is pre-RSVP'd to events 1, 4, 6 (they appear in attendees)
  state.rsvps.set(1, true);
  state.rsvps.set(4, true);
  state.rsvps.set(6, true);
}

export function getFilteredEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return state.events.filter(evt => {
    if (evt.removed) return false;

    const [y, m, d] = evt.date.split('-').map(Number);
    const evtDate = new Date(y, m - 1, d);

    switch (state.scope) {
      case 'this-week': {
        const end = new Date(today);
        end.setDate(today.getDate() + 6);
        return evtDate >= today && evtDate <= end;
      }
      case 'next-30': {
        const end = new Date(today);
        end.setDate(today.getDate() + 30);
        return evtDate >= today && evtDate <= end;
      }
      case 'our-events':
        return evtDate >= today && (evt.type === 'our-meeting' || evt.type === 'our-event');
      case 'org-events':
        return evtDate >= today && evt.type === 'org-event';
      default:
        return true;
    }
  });
}

export function toggleRsvp(id) {
  const evt = state.events.find(e => e.id === id);
  if (!evt || evt.cancelled) return;

  const isIn = state.rsvps.get(id) || false;
  if (isIn) {
    state.rsvps.set(id, false);
    evt.attendees = evt.attendees.filter(a => !a.you);
  } else {
    state.rsvps.set(id, true);
    if (!evt.attendees.find(a => a.you)) {
      evt.attendees.unshift({ ...ME });
    }
  }
}

export function toggleExpanded(id) {
  if (state.expanded.has(id)) {
    state.expanded.delete(id);
  } else {
    state.expanded.add(id);
  }
}

export function setScope(scope) {
  state.scope = scope;
}

export function addEvent(data) {
  const evt = {
    ...data,
    id: _nextId++,
    type: 'our-event',
    cancelled: false,
    removed: false,
    attendees: [{ ...ME }],
  };
  state.events.push(evt);
  state.events.sort((a, b) => a.date.localeCompare(b.date));
  state.rsvps.set(evt.id, true);
}

export function updateEvent(id, data) {
  const evt = state.events.find(e => e.id === id);
  if (!evt) return;
  const dateChanged = data.date && data.date !== evt.date;
  Object.assign(evt, data);
  if (dateChanged) {
    evt.attendees = state.rsvps.get(id) ? [{ ...ME }] : [];
  }
  state.events.sort((a, b) => a.date.localeCompare(b.date));
}

export function cancelEvent(id) {
  const evt = state.events.find(e => e.id === id);
  if (evt) evt.cancelled = !evt.cancelled;
}

export function removeEvent(id) {
  const evt = state.events.find(e => e.id === id);
  if (evt) evt.removed = true;
  state.expanded.delete(id);
}

export function getEvent(id) {
  return state.events.find(e => e.id === id);
}
