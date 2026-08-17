/* ================================================================
   SCRIPT.JS — Kate's Birthday Website  (v2 — Cinematic Edition)
   ================================================================ */

/* ----------------------------------------------------------------
   TYPEWRITER — opening line
   CUSTOMIZE: Change the text string below
   ---------------------------------------------------------------- */
const TYPEWRITER_TEXT = 'A little something\nI made just for you…';
const TYPEWRITER_SPEED = 55;   // ms per character — lower = faster

function runTypewriter() {
  const target = document.getElementById('typewriterTarget');
  if (!target) return;

  let i = 0;
  target.textContent = '';

  const tick = () => {
    if (i < TYPEWRITER_TEXT.length) {
      const ch = TYPEWRITER_TEXT[i];
      target.textContent += ch === '\n' ? '' : ch;
      if (ch === '\n') target.insertAdjacentHTML('beforeend', '<br/>');
      i++;
      setTimeout(tick, TYPEWRITER_SPEED + Math.random() * 30);
    } else {
      // Hide blinking cursor after typing finishes
      setTimeout(() => {
        const cursor = document.querySelector('.cursor');
        if (cursor) cursor.style.display = 'none';
      }, 1800);
    }
  };

  setTimeout(tick, 900);   // delay before typing starts
}

/* ----------------------------------------------------------------
   SECTION NAVIGATION
   ---------------------------------------------------------------- */
const SECTIONS = ['opening', 'reveal', 'message', 'memories', 'wish', 'final'];
let current = 0;
let transitioning = false;

function goTo(index) {
  if (transitioning || index === current) return;
  transitioning = true;

  const prev = document.getElementById(SECTIONS[current]);
  const next = document.getElementById(SECTIONS[index]);

  // Exit current
  prev.classList.remove('active');
  prev.classList.add('exit');
  setTimeout(() => prev.classList.remove('exit'), 700);

  // Enter next
  next.classList.add('active');
  current = index;

  // Swap background gradient
  document.body.className = `bg-${SECTIONS[index]}`;

  // Update progress dots
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });

  // Section-specific triggers
  if (index === 1) spawnConfetti();
  if (index === 5) animateFinalSection();

  setTimeout(() => { transitioning = false; }, 900);
}

/* ----------------------------------------------------------------
   BUTTON WIRING
   ---------------------------------------------------------------- */
document.getElementById('openSurpriseBtn').addEventListener('click', () => {
  goTo(1);
  startMusic();   // gentle fade-in starts here
});
document.getElementById('toMessageBtn').addEventListener('click',    () => goTo(2));
document.getElementById('toMemoriesBtn').addEventListener('click',   () => goTo(3));
document.getElementById('toWishBtn').addEventListener('click',       () => goTo(4));
document.getElementById('toFinalBtn').addEventListener('click',      () => goTo(5));

document.getElementById('replayBtn').addEventListener('click', () => {
  // Reset final animations for replay
  document.getElementById('finalTitle').classList.remove('visible');
  document.getElementById('finalSub').classList.remove('visible');
  // Restart typewriter
  const cursor = document.querySelector('.cursor');
  if (cursor) cursor.style.display = 'inline-block';
  goTo(0);
  setTimeout(runTypewriter, 950);
});

/* ----------------------------------------------------------------
   PROGRESS DOTS — click to navigate
   ---------------------------------------------------------------- */
document.querySelectorAll('.dot').forEach(dot => {
  dot.addEventListener('click', () => goTo(Number(dot.dataset.index)));
});

/* ----------------------------------------------------------------
   MEMORY CARDS — flip on click / keyboard
   ---------------------------------------------------------------- */
document.querySelectorAll('.memory-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});

/* ----------------------------------------------------------------
   FINAL SECTION — staggered cinematic reveal
   ---------------------------------------------------------------- */
function animateFinalSection() {
  const title = document.getElementById('finalTitle');
  const sub   = document.getElementById('finalSub');
  title.classList.remove('visible');
  sub.classList.remove('visible');
  setTimeout(() => title.classList.add('visible'), 550);
  setTimeout(() => sub.classList.add('visible'),   1350);
}

/* ----------------------------------------------------------------
   CONFETTI — richer shapes on birthday reveal
   CUSTOMIZE: Edit colors array or count
   ---------------------------------------------------------------- */
function spawnConfetti() {
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';

  // CUSTOMIZE: Confetti colors
  const colors = ['#e8789a', '#b07fe8', '#f0c060', '#f4afc5', '#d4a0f0', '#ffffff', '#c0506a'];
  const count  = 70;

  for (let i = 0; i < count; i++) {
    const piece  = document.createElement('div');
    piece.className = 'confetti-piece';

    const size   = Math.random() * 9 + 4;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 2.8;
    const dur    = Math.random() * 2.5 + 2.5;
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const r      = Math.random();
    // Mix of circles, squares, and thin rectangles
    const shape  = r < 0.4 ? '50%' : r < 0.7 ? '3px' : '1px';
    const w      = r > 0.7 ? size * 0.35 : size;

    piece.style.cssText = `
      left: ${left}%;
      width: ${w}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${shape};
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      opacity: 0.9;
    `;
    container.appendChild(piece);
  }
}

/* ----------------------------------------------------------------
   PARTICLE CANVAS — twinkling stars
   CUSTOMIZE: Adjust count, size range, speed, colors below
   ---------------------------------------------------------------- */
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let   particles = [];
let   rafId;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  // CUSTOMIZE: Particle density — lower divisor = more particles
  const count = Math.min(Math.floor((canvas.width * canvas.height) / 11000), 100);

  for (let i = 0; i < count; i++) {
    particles.push({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      // CUSTOMIZE: Particle size range
      r:       Math.random() * 1.5 + 0.25,
      // CUSTOMIZE: Particle drift speed
      dx:      (Math.random() - 0.5) * 0.22,
      dy:      (Math.random() - 0.5) * 0.22,
      opacity: Math.random() * 0.55 + 0.1,
      phase:   Math.random() * Math.PI * 2,
      // CUSTOMIZE: Particle colors
      color:   ['#e8789a', '#b07fe8', '#f0c060', '#ffffff', '#f4afc5'][Math.floor(Math.random() * 5)],
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.phase += 0.011;
    const alpha = p.opacity * (0.55 + 0.45 * Math.sin(p.phase));

    // Core dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.fill();

    // Soft glow halo on larger particles
    if (p.r > 1.1) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha * 0.12;
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 0)             p.x = canvas.width;
    if (p.x > canvas.width)  p.x = 0;
    if (p.y < 0)             p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });

  rafId = requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
resizeCanvas();
createParticles();
drawParticles();

/* ----------------------------------------------------------------
   MUSIC
   - Auto-starts with a gentle fade-in when Kate clicks "Open Your Surprise"
   - Music button manually toggles play/pause at any time
   CUSTOMIZE: Volume targets and fade duration below
   ---------------------------------------------------------------- */
const musicBtn    = document.getElementById('musicBtn');
const bgMusic     = document.getElementById('bgMusic');
let   isPlaying   = false;
let   fadeInterval;

// CUSTOMIZE: Final volume after fade-in (0.0 – 1.0)
const VOLUME_TARGET = 0.5;
// CUSTOMIZE: Fade-in duration in ms
const FADE_DURATION = 3000;

bgMusic.volume = 0;   // start silent, fade up

function fadeIn() {
  clearInterval(fadeInterval);
  const steps    = 40;
  const stepTime = FADE_DURATION / steps;
  const stepVol  = VOLUME_TARGET / steps;
  fadeInterval = setInterval(() => {
    if (bgMusic.volume + stepVol >= VOLUME_TARGET) {
      bgMusic.volume = VOLUME_TARGET;
      clearInterval(fadeInterval);
    } else {
      bgMusic.volume = Math.min(bgMusic.volume + stepVol, VOLUME_TARGET);
    }
  }, stepTime);
}

function fadeOut(onDone) {
  clearInterval(fadeInterval);
  const steps    = 25;
  const stepTime = 600 / steps;
  const stepVol  = bgMusic.volume / steps;
  fadeInterval = setInterval(() => {
    if (bgMusic.volume - stepVol <= 0) {
      bgMusic.volume = 0;
      bgMusic.pause();
      clearInterval(fadeInterval);
      if (onDone) onDone();
    } else {
      bgMusic.volume = Math.max(bgMusic.volume - stepVol, 0);
    }
  }, stepTime);
}

function startMusic() {
  if (isPlaying) return;
  bgMusic.volume = 0;
  bgMusic.play().then(() => {
    isPlaying = true;
    fadeIn();
    musicBtn.classList.add('playing');
    musicBtn.querySelector('.music-icon').textContent = '♫';
    musicBtn.setAttribute('aria-label', 'Pause music');
  }).catch(err => {
    // If URL fails or browser blocks, pulse the button so Kate knows she can tap it
    console.warn('Music could not autoplay:', err);
    musicBtn.style.borderColor = 'rgba(240,192,96,0.6)';
    musicBtn.title = 'Tap to play music';
  });
}

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    fadeOut(() => {
      isPlaying = false;
      musicBtn.classList.remove('playing');
      musicBtn.querySelector('.music-icon').textContent = '♪';
      musicBtn.setAttribute('aria-label', 'Play music');
    });
  } else {
    startMusic();
  }
});

bgMusic.addEventListener('ended', () => {
  isPlaying = false;
  musicBtn.classList.remove('playing');
  musicBtn.querySelector('.music-icon').textContent = '♪';
});

/* ----------------------------------------------------------------
   KEYBOARD NAVIGATION
   ---------------------------------------------------------------- */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    if (current < SECTIONS.length - 1) goTo(current + 1);
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    if (current > 0) goTo(current - 1);
  }
});

/* ----------------------------------------------------------------
   TOUCH SWIPE NAVIGATION
   ---------------------------------------------------------------- */
let touchStartY = 0;
let touchStartX = 0;

document.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', e => {
  const dy = touchStartY - e.changedTouches[0].clientY;
  const dx = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 55) {
    if (dy > 0 && current < SECTIONS.length - 1) goTo(current + 1);
    if (dy < 0 && current > 0)                   goTo(current - 1);
  }
}, { passive: true });

/* ----------------------------------------------------------------
   INIT
   ---------------------------------------------------------------- */
document.body.classList.add('bg-opening');
runTypewriter();
