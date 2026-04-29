const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
const openLetter = document.querySelector('#openLetter');
const modal = document.querySelector('#letterModal');
const lightbox = document.querySelector('#lightbox');
const lightboxImg = document.querySelector('#lightboxImg');
const lightboxTitle = document.querySelector('#lightboxTitle');

menuBtn?.addEventListener('click', () => nav.classList.toggle('is-open'));
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('is-open'));
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

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
      bubbleTexts.forEach((p, index) => setTimeout(() => typeMessage(p, messages[index]), index * 650));
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
    closeModal();
    closeLightbox();
  }
});

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

setInterval(spawnHeart, 1200);
