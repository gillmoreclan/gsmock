import { state, getFilteredEvents, toggleRsvp, toggleExpanded, setScope, cancelEvent, removeEvent } from './state.js';
import { navigate } from './nav.js';

const SCOPE_LABELS = {
  'this-week': 'This week',
  'next-30':   'Next 30 days',
  'our-events': 'Our events',
  'org-events': 'Org events',
};

const TYPE_META = {
  'our-meeting': { label: 'OUR MEETING', cls: 'ours' },
  'our-event':   { label: 'OUR EVENT',   cls: 'ours' },
  'org-event':   { label: 'FROM THE COUNCIL', cls: 'org' },
};

function fmtDate(dateStr, time) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()];
  return `${day} · ${mon} ${d}${time ? ' · ' + time : ''}`;
}

function avatarsHtml(attendees) {
  const show = attendees.slice(0, 3);
  const over = attendees.length - 3;
  return `<div class="avatars">
    ${show.map(a => `<span style="background:${a.color}">${a.initials}</span>`).join('')}
    ${over > 0 ? `<span class="avatar-ov">+${over}</span>` : ''}
  </div>`;
}

function cardHtml(evt) {
  const isIn = state.rsvps.get(evt.id) || false;
  const isExp = state.expanded.has(evt.id);
  const { label, cls } = TYPE_META[evt.type] || { label: '', cls: '' };

  const metaParts = [evt.location, evt.note].filter(Boolean);
  const metaHtml = metaParts.join(' <span class="dot">·</span> ');

  return `
    <div class="event${evt.cancelled ? ' cancelled' : ''}" data-id="${evt.id}">
      <div class="card-top">
        <span class="when">${fmtDate(evt.date, evt.time)}</span>
        <div class="card-right">
          ${evt.cancelled
            ? '<span class="cancelled-badge">CANCELLED</span>'
            : `<span class="tag ${cls}">${label}</span>`}
          <div class="menu-wrap">
            <button class="menu-btn" data-action="toggle-menu" data-id="${evt.id}" aria-label="More options">···</button>
            <div class="card-menu" data-menu="${evt.id}">
              <button data-action="edit"   data-id="${evt.id}">Edit</button>
              <button data-action="clone"  data-id="${evt.id}">Clone</button>
              <button data-action="cancel" data-id="${evt.id}">${evt.cancelled ? 'Uncancel' : 'Cancel event'}</button>
              <button data-action="remove" data-id="${evt.id}" class="danger">Remove</button>
            </div>
          </div>
        </div>
      </div>

      <h2>${evt.title}</h2>
      ${metaHtml ? `<div class="meta">${metaHtml}</div>` : '<div class="meta" style="margin-bottom:14px"></div>'}

      <div class="coming">
        <button class="who-btn" data-action="toggle-expanded" data-id="${evt.id}">
          ${avatarsHtml(evt.attendees)}
          <span class="count"><b>${evt.attendees.length}</b> coming</span>
        </button>
        ${!evt.cancelled ? `
          <button class="btn-im${isIn ? ' on' : ''}" data-action="toggle-rsvp" data-id="${evt.id}">
            ${isIn ? '<span class="ck">✓</span>You\'re in' : "I'm coming"}
          </button>` : ''}
      </div>

      ${isExp ? `
        <div class="names">
          <div class="nlabel">Who's coming</div>
          <ul>
            ${evt.attendees.map(a => `
              <li>
                <span class="pip" style="background:${a.color}">${a.initials}</span>
                ${a.name}
                ${a.you ? '<small>you</small>' : ''}
              </li>`).join('')}
          </ul>
        </div>` : ''}
    </div>`;
}

export function renderHome() {
  const el = document.getElementById('screen-home');
  const events = getFilteredEvents();
  const label = SCOPE_LABELS[state.scope];

  el.innerHTML = `
    <div class="appbar">
      <div class="greeting">Good morning, Dana</div>
      <h1>What's coming up</h1>
    </div>
    <div class="scope">
      ${Object.entries(SCOPE_LABELS).map(([key, lbl]) =>
        `<button class="chip${state.scope === key ? ' active' : ''}" data-action="set-scope" data-scope="${key}">${lbl}</button>`
      ).join('')}
    </div>
    <div class="scroll-area">
      <div class="section-label">${label}</div>
      <div class="feed">
        ${events.length === 0
          ? '<div class="empty">No events for this period.</div>'
          : events.map(cardHtml).join('')}
      </div>
    </div>
    <div class="nav">
      <button class="plus" data-action="new-event" aria-label="Create event">+</button>
    </div>`;
}

export function initHome() {
  const el = document.getElementById('screen-home');

  el.addEventListener('click', e => {
    // close any open menu unless click is inside a menu or on a menu button
    if (!e.target.closest('.card-menu') && !e.target.closest('[data-action="toggle-menu"]')) {
      el.querySelectorAll('.card-menu.open').forEach(m => m.classList.remove('open'));
    }

    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id !== undefined ? +btn.dataset.id : null;
    const scope = btn.dataset.scope;

    switch (action) {
      case 'set-scope':
        setScope(scope);
        renderHome();
        break;

      case 'toggle-rsvp':
        toggleRsvp(id);
        renderHome();
        break;

      case 'toggle-expanded':
        toggleExpanded(id);
        renderHome();
        break;

      case 'toggle-menu': {
        const menu = el.querySelector(`[data-menu="${id}"]`);
        const wasOpen = menu?.classList.contains('open');
        el.querySelectorAll('.card-menu.open').forEach(m => m.classList.remove('open'));
        if (!wasOpen && menu) menu.classList.add('open');
        break;
      }

      case 'edit':
        navigate('form', { mode: 'edit', editingId: id });
        break;

      case 'clone':
        navigate('form', { mode: 'create', cloneId: id });
        break;

      case 'cancel':
        cancelEvent(id);
        renderHome();
        break;

      case 'remove':
        removeEvent(id);
        renderHome();
        break;

      case 'new-event':
        navigate('form', { mode: 'create' });
        break;
    }
  });
}
