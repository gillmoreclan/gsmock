import { seedData } from './state.js';
import { registerRenderers } from './nav.js';
import { renderHome, initHome } from './home.js';
import { renderForm, initForm } from './create.js';

registerRenderers(renderHome, renderForm);

seedData();

// activate home screen without triggering a CSS transition
const homeEl = document.getElementById('screen-home');
homeEl.classList.add('active');

renderHome();
initHome();
initForm();
