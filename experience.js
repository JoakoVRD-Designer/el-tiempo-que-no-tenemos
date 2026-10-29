// Visual rhythm and interactions for the presentation.
const experienceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const portraitInformation = [
  ['han', 'La presión por rendir', 'Si terminas una tarea y ya sientes culpa por descansar, esta idea puede ayudarte a mirar de dónde viene esa exigencia.', '¿Te estás poniendo una meta posible o una que nunca termina?'],
  ['russell', 'El tiempo que también importa', 'Una tarde para leer por gusto, conversar o hacer música también puede aportar a tu formación.', '¿Qué lugar tienen esas cosas cuando todo el día queda ocupado?'],
  ['freire', 'Aprender preguntando', 'En vez de copiar una respuesta, un curso podría investigar un problema de su propio colegio y conversar sobre cómo cambiarlo.', '¿Qué aprenderíamos si también pudiéramos decidir qué preguntar?'],
  ['kant', 'Reglas que nos ayuden a decidir', 'Practicar con un horario puede ayudarnos a desarrollar un hábito. La pregunta es si después podemos organizarnos por nuestra cuenta.', '¿La regla nos está enseñando a decidir o solo a cumplir?'],
  ['aristoteles', 'Aprender más allá del trabajo', 'La música, la lectura o una conversación pueden importarnos aunque no tengan una aplicación directa en nuestra futura profesión.', '¿Qué perderíamos si solo estudiáramos lo que sirve para conseguir trabajo?']
];

document.querySelectorAll('.voice').forEach((voice, index) => {
  const [slug, title, example, question] = portraitInformation[index];
  const identity = voice.querySelector('.identity');
  const portrait = document.createElement('img');
  portrait.className = 'philosopher-portrait';
  portrait.src = `assets/${slug === 'aristoteles' ? 'aristoteles' : slug}.jpg`;
  portrait.alt = voice.querySelector('h3').textContent;
  portrait.width = 145;
  portrait.height = 185;
  portrait.loading = 'lazy';
  const identityText = document.createElement('div');
  while (identity.firstChild) identityText.append(identity.firstChild);
  identity.append(portrait, identityText);

  const detail = document.createElement('details');
  detail.className = 'voice-example';
  const summary = document.createElement('summary');
  summary.textContent = '¿Cómo se vería en clases?';
  const detailBody = document.createElement('div');
  const heading = document.createElement('h4');
  heading.textContent = title;
  const paragraph = document.createElement('p');
  paragraph.textContent = example;
  const prompt = document.createElement('p');
  prompt.className = 'example-question';
  prompt.textContent = question;
  const respond = document.createElement('button');
  respond.type = 'button';
  respond.className = 'idea-response';
  respond.textContent = 'Quiero comentar esta idea ↗';
  respond.addEventListener('click', () => {
    document.getElementById('thinker').value = voice.querySelector('h3').textContent;
    document.getElementById('reflexion').scrollIntoView({behavior: experienceMotion.matches ? 'instant' : 'smooth'});
    document.getElementById('opinion').focus({preventScroll: true});
  });
  detailBody.append(heading, paragraph, prompt, respond);
  detail.append(summary, detailBody);
  voice.querySelector('.argument').append(detail);
});

const debateArguments = document.getElementById('debate-arguments');
const debatePanels = debateArguments.querySelectorAll(':scope > article');
const debateVersus = debateArguments.querySelector('.versus');
const debateMessages = {
  help: 'Con Kant, miramos qué exigencias pueden ayudarnos a decidir por nuestra cuenta.',
  pressure: 'Con Han, miramos cuándo la exigencia se vuelve una presión que nunca termina.',
  both: 'Dos ideas para mirar el mismo problema.'
};
document.querySelectorAll('[data-debate-view]').forEach(button => {
  button.addEventListener('click', () => {
    const view = button.dataset.debateView;
    debateArguments.dataset.view = view;
    debatePanels[0].hidden = view === 'pressure';
    debatePanels[1].hidden = view === 'help';
    debateVersus.hidden = view !== 'both';
    document.querySelectorAll('[data-debate-view]').forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    document.querySelector('.debate-status').textContent = debateMessages[view];
  });
});

// Keep the questions independent so visitors can compare several open answers.
document.querySelectorAll('.question-stack details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    detail.querySelector('summary span').textContent = detail.open ? '−' : '+';
  });
});

const films = [...document.querySelectorAll('video[data-film]')];
const decorativeImages = [...document.querySelectorAll('.motion-image')];
const visibleFilms = new Set();
const visibleImages = new Set();
decorativeImages.forEach(image => image.dataset.poster = image.getAttribute('src'));
function syncFilm(film) {
  if (visibleFilms.has(film) && !experienceMotion.matches && !document.hidden && !document.body.classList.contains('entering')) {
    const source = film.querySelector('source');
    if (!source.hasAttribute('src')) {
      source.src = source.dataset.src;
      film.load();
    }
    film.playbackRate = .75;
    film.play().catch(() => {});
  } else film.pause();
}
function syncDecorativeImage(image) {
  const desired = visibleImages.has(image) && !experienceMotion.matches && !document.hidden ? image.dataset.motionSrc : image.dataset.poster;
  if (image.getAttribute('src') !== desired) image.src = desired;
}
const filmObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) visibleFilms.add(entry.target);
    else visibleFilms.delete(entry.target);
    syncFilm(entry.target);
  }
}, {threshold: .08});
films.forEach(film => filmObserver.observe(film));
const imageObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) visibleImages.add(entry.target);
    else visibleImages.delete(entry.target);
    syncDecorativeImage(entry.target);
  }
}, {rootMargin: '100px'});
decorativeImages.forEach(image => imageObserver.observe(image));
function syncExperienceMedia() {
  films.forEach(syncFilm);
  decorativeImages.forEach(syncDecorativeImage);
}
document.addEventListener('visibilitychange', syncExperienceMedia);
experienceMotion.addEventListener('change', syncExperienceMedia);
new MutationObserver(syncExperienceMedia).observe(document.body, {attributes: true, attributeFilter: ['class']});

const revealTargets = document.querySelectorAll('.section h2, .three article, .study-aside, .voice, .film-copy > *, .writing-copy, .question-stack details, .page-fragment');
if (!experienceMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    }
  }, {threshold: .06, rootMargin: '0px 0px -20px 0px'});
  revealTargets.forEach(target => {
    target.classList.add('scroll-reveal');
    revealObserver.observe(target);
  });
}

const readingProgress = document.querySelector('.scroll-progress span');
let progressPending = false;
function updateProgress() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
  readingProgress.style.transform = `scaleX(${progress})`;
  progressPending = false;
}
document.addEventListener('scroll', () => {
  if (!progressPending) {
    progressPending = true;
    requestAnimationFrame(updateProgress);
  }
}, {passive: true});
window.addEventListener('resize', updateProgress);
updateProgress();

const chapterLinks = [...document.querySelectorAll('.mobile-chapters a')];
const chapterObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      chapterLinks.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }
}, {rootMargin: '-10% 0px -65% 0px'});
chapterLinks.forEach(link => chapterObserver.observe(document.querySelector(link.hash)));
