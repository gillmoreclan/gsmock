import { state, addEvent, updateEvent, getEvent } from './state.js';
import { navigate } from './nav.js';

function esc(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderForm() {
  const el = document.getElementById('screen-form');
  const { formMode, editingId, cloneId } = state;
  const isEdit = formMode === 'edit';

  let pre = { title: '', date: '', time: '', location: '', note: '', link: '' };

  if (isEdit && editingId) {
    const evt = getEvent(editingId);
    if (evt) pre = { title: evt.title, date: evt.date, time: evt.time || '', location: evt.location || '', note: evt.note || '', link: evt.link || '' };
  } else if (cloneId) {
    const src = getEvent(cloneId);
    if (src) pre = { title: src.title, date: '', time: '', location: src.location || '', note: src.note || '', link: src.link || '' };
  }

  const heading = isEdit ? 'Edit Event' : cloneId ? 'Clone Event' : 'New Event';

  el.innerHTML = `
    <div class="form-appbar">
      <button class="back-btn" data-action="back" aria-label="Back">←</button>
      <h2>${heading}</h2>
    </div>
    <div class="scroll-area">
      <form class="event-form" id="event-form" novalidate>

        <div class="field">
          <label for="f-title">Title</label>
          <input id="f-title" name="title" type="text" placeholder="What's happening?" value="${esc(pre.title)}" autocomplete="off">
        </div>

        <div class="field">
          <label for="f-date">Date</label>
          <input id="f-date" name="date" type="date" value="${esc(pre.date)}">
          ${isEdit ? '<p class="field-hint" id="date-hint" hidden>Changing the date will clear the coming list.</p>' : ''}
        </div>

        <div class="field multi-date-row">
          <label class="multi-date-label">
            <input type="checkbox" id="multi-date"> Multi-date
          </label>
          <span class="multi-date-hint">Tap several dates to create one event per date</span>
        </div>

        <div class="field">
          <label for="f-time">Time <span class="optional">(optional)</span></label>
          <input id="f-time" name="time" type="text" placeholder="e.g. 6:30 PM" value="${esc(pre.time)}" autocomplete="off">
        </div>

        <div class="field">
          <label for="f-location">Location <span class="optional">(optional)</span></label>
          <input id="f-location" name="location" type="text" placeholder="Where?" value="${esc(pre.location)}" autocomplete="off">
        </div>

        <div class="field">
          <label for="f-note">Note <span class="optional">(optional)</span></label>
          <textarea id="f-note" name="note" placeholder="Anything to add?" rows="3">${esc(pre.note)}</textarea>
        </div>

        <div class="field">
          <label for="f-link">Link <span class="optional">(optional)</span></label>
          <input id="f-link" name="link" type="url" placeholder="https://…" value="${esc(pre.link)}">
        </div>

        <button type="submit" class="btn-submit">${isEdit ? 'Save changes' : 'Create event'}</button>

      </form>
    </div>`;

  attachSubmitHandler(el.querySelector('#event-form'));
}

export function initForm() {
  const el = document.getElementById('screen-form');

  el.addEventListener('click', e => {
    if (e.target.closest('[data-action="back"]')) {
      navigate('home');
    }
  });

  // show date-change warning in edit mode
  el.addEventListener('change', e => {
    if (e.target.name !== 'date' || state.formMode !== 'edit') return;
    const hint = el.querySelector('#date-hint');
    if (!hint) return;
    const evt = getEvent(state.editingId);
    hint.hidden = !(evt && e.target.value && e.target.value !== evt.date);
  });
}

function attachSubmitHandler(form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const val = name => form.querySelector(`[name="${name}"]`)?.value.trim() || '';
    const title = val('title');
    const date  = val('date');

    if (!title) { form.querySelector('[name="title"]').focus(); return; }
    if (!date)  { form.querySelector('[name="date"]').focus();  return; }

    const data = { title, date, time: val('time'), location: val('location'), note: val('note'), link: val('link') };

    if (state.formMode === 'edit' && state.editingId) {
      updateEvent(state.editingId, data);
    } else {
      addEvent(data);
    }

    navigate('home');
  });
}
