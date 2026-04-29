const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
const openLetter = document.querySelector('#openLetter');
const modal = document.querySelector('#letterModal');
const lightbox = document.querySelector('#lightbox');
const lightboxImg = document.querySelector('#lightboxImg');
const lightboxTitle = document.querySelector('#lightboxTitle');
const scrollProgress = document.querySelector('.scroll-progress');

document.body.classList.add('page-loaded');

function closeMenu() {
  nav?.classList.remove('is-open');
  menuBtn?.classList.remove('is-active');
  menuBtn?.setAttribute('aria-label', 'Abrir menu');
}

menuBtn?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuBtn.classList.toggle('is-active', isOpen);
  menuBtn.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (event) => {
  if (!nav?.classList.contains('is-open')) return;
  const clickedInsideMenu = nav.contains(event.target) || menuBtn.contains(event.target);
  if (!clickedInsideMenu) closeMenu();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const messages = [
  'Você é meu lugar seguro, meu riso diário e minha paz favorita.',
  'Obrigado por ser minha melhor amiga, parceira e meu grande amor.',
  'Com você, cada dia fica mais bonito.',
  'Te escolheria em todas as vidas, em todos os tempos.'
];

function typeMessage(element, text, speed = 28) {
  let i = 0;
  element.textContent = '';
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

const bubbleTexts = document.querySelectorAll('.bubble p');
const messagesObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      bubbleTexts.forEach((p, index) => {
        setTimeout(() => typeMessage(p, messages[index] || '', 24), index * 650);
      });
      messagesObserver.disconnect();
    }
  });
}, { threshold: 0.35 });

const messagesSection = document.querySelector('#mensagens');
if (messagesSection) messagesObserver.observe(messagesSection);

function openModal() {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}
openLetter?.addEventListener('click', openModal);
modal?.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));

function openLightbox(src, title) {
  lightboxImg.src = src;
  lightboxTitle.textContent = title || 'Nossa foto';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  setTimeout(() => { lightboxImg.src = ''; }, 250);
}

document.querySelectorAll('.photo-open').forEach(btn => {
  btn.addEventListener('click', () => openLightbox(btn.dataset.img, btn.dataset.title));
});
lightbox?.querySelectorAll('[data-lightbox-close]').forEach(el => el.addEventListener('click', closeLightbox));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
    closeModal();
    closeLightbox();
  }
});

function updateScrollProgress() {
  if (!scrollProgress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  requestAnimationFrame(() => {
    updateScrollProgress();
    ticking = false;
  });
  ticking = true;
}, { passive: true });
updateScrollProgress();

function spawnHeart() {
  const heart = document.createElement('span');
  heart.textContent = ['♡', '💗', '✨'][Math.floor(Math.random() * 3)];
  heart.style.position = 'fixed';
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.bottom = '-24px';
  heart.style.fontSize = `${14 + Math.random() * 16}px`;
  heart.style.opacity = '0';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '2';
  heart.style.transition = 'transform 4.5s linear, opacity .8s ease';
  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.opacity = '.72';
    heart.style.transform = `translateY(-${70 + Math.random() * 45}vh) translateX(${(Math.random() - .5) * 80}px) rotate(${Math.random() * 80 - 40}deg)`;
  });

  setTimeout(() => heart.style.opacity = '0', 3600);
  setTimeout(() => heart.remove(), 4700);
}

const isSmallScreen = window.matchMedia('(max-width: 820px)').matches;
setInterval(spawnHeart, isSmallScreen ? 1800 : 1200);

function createTapHeart(x, y) {
  const heart = document.createElement('span');
  heart.className = 'tap-heart';
  heart.textContent = ['💗', '♡', '✨'][Math.floor(Math.random() * 3)];
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 950);
}

let lastTapHeart = 0;
document.addEventListener('pointerdown', (event) => {
  if (!window.matchMedia('(max-width: 820px)').matches) return;
  const interactive = event.target.closest('button, a, input, textarea, .modal__content, .lightbox__content');
  if (interactive) return;
  const now = Date.now();
  if (now - lastTapHeart < 260) return;
  lastTapHeart = now;
  createTapHeart(event.clientX, event.clientY);
}, { passive: true });
