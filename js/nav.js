import { state } from './state.js';

let _renderHome, _renderForm;

export function registerRenderers(renderHome, renderForm) {
  _renderHome = renderHome;
  _renderForm = renderForm;
}

export function navigate(screen, opts = {}) {
  state.screen = screen;
  state.formMode = opts.mode || 'create';
  state.editingId = opts.editingId ?? null;
  state.cloneId = opts.cloneId ?? null;

  const homeEl = document.getElementById('screen-home');
  const formEl = document.getElementById('screen-form');

  homeEl.classList.add('transitioning');
  formEl.classList.add('transitioning');

  if (screen === 'home') {
    homeEl.classList.add('active');
    homeEl.classList.remove('slide-left');
    formEl.classList.remove('active');
    _renderHome?.();
  } else {
    homeEl.classList.remove('active');
    homeEl.classList.add('slide-left');
    formEl.classList.add('active');
    _renderForm?.();
  }

  setTimeout(() => {
    homeEl.classList.remove('transitioning');
    formEl.classList.remove('transitioning');
  }, 320);
}
