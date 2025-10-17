/* Menu acessível com folha dourada */
const hamb = document.getElementById('hamb');
const menu = document.getElementById('menu');

function closeMenu(){
  menu.classList.remove('show');
  hamb.classList.remove('is-open');
  hamb.setAttribute('aria-expanded','false');
  document.body.classList.remove('menu-open');
}

if (hamb && menu) {
  hamb.addEventListener('click', ()=>{
    const open = menu.classList.toggle('show');
    hamb.classList.toggle('is-open', open);
    hamb.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    if(open) menu.querySelector('a')?.focus();
  });

  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape' && menu.classList.contains('show')) closeMenu();
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMenu));
}

function initCarousel(rootSelector, slideSelector, dotSelector, interval = 3500) {
  const root = document.querySelector(rootSelector);
  if (!root) return;

  const slides = Array.from(root.querySelectorAll(slideSelector));
  const dots   = Array.from(root.querySelectorAll(dotSelector));
  const viewport = root.querySelector('[class$="viewport"]') || root;

  let i = 0, timer = null;

  function set(n){
    slides.forEach((s,k)=> s.setAttribute('aria-hidden', String(k!==n)));
    dots.forEach((d,k)=> d.setAttribute('aria-current', k===n ? 'true' : 'false'));
    i = n;
    const h = slides[n]?.scrollHeight || 220;
    viewport.style.height = h + 'px';
  }

  const next = () => set((i + 1) % slides.length);
  const prev = () => set((i - 1 + slides.length) % slides.length);

  function start(){ stop(); timer = setInterval(next, interval); }  // força autoplay
  function stop(){ if (timer) clearInterval(timer); }

  // Dots e interações
  dots.forEach((d,k)=> d.addEventListener('click', ()=>{ set(k); start(); }));
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  // Pausa quando a aba fica oculta
  document.addEventListener('visibilitychange', ()=> document.hidden ? stop() : start());

  // Swipe no mobile
  let x0 = null, THRESH = 30;
  root.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; stop(); }, {passive:true});
  root.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > THRESH) (dx < 0 ? next() : prev());
    x0 = null; start();
  }, {passive:true});

  // Inicializa depois do layout
  const boot = () => { set(0); start(); };
  if (document.fonts?.ready) document.fonts.ready.then(()=>requestAnimationFrame(boot));
  else window.addEventListener('load', ()=>requestAnimationFrame(boot));
}

// Inicializa os DOIS carrosséis
document.addEventListener('DOMContentLoaded', () => {
  initCarousel('.carousel', '.carousel__slide', '.carousel__dots button', 3500);   // Quem somos
  initCarousel('.testi',    '.testi__slide',    '.testi__dots button',    3500);   // Depoimentos
});
