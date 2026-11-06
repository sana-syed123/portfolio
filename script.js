const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll progress bar
const bar = $('#progress');
addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
}, { passive: true });

// Cursor glow + card spotlight
const glow = $('#glow');
addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    const c = e.target.closest && e.target.closest('.card');
    if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px') }
});

// Photo tilt
const wrap = $('#tilt'), photo = $('.photo');
if (!calm) {
    wrap.addEventListener('mousemove', e => {
        const r = wrap.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        photo.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
    });
    wrap.addEventListener('mouseleave', () => photo.style.transform = '');
}

// Project filters
$$('.filters button').forEach(b => b.addEventListener('click', () => {
    $$('.filters button').forEach(x => x.classList.toggle('on', x === b));
    $$('.card').forEach(c => c.classList.toggle('hide', b.dataset.f !== 'all' && c.dataset.c !== b.dataset.f));
}));

// Reveal on scroll
$$('.card,.box,.certs li,.about-photo,.contact li').forEach(el => el.classList.add('rv'));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 });
$$('.rv').forEach(el => io.observe(el));

// Active nav link
const links = $$('.links a');
const spy = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('section').forEach(s => spy.observe(s));

// Copy email
$('#copy').addEventListener('click', async e => {
    try { await navigator.clipboard.writeText('sanasyed0604@gmail.com'); e.target.textContent = 'Copied' }
    catch { e.target.textContent = 'Copy failed' }
    setTimeout(() => e.target.textContent = 'Copy', 1800);
});

// Blue network background
const css = getComputedStyle(document.documentElement), B = () => css.getPropertyValue('--b').trim(), S = () => css.getPropertyValue('--s').trim();
const cv = $('#net'), ctx = cv.getContext('2d'); let W, H, pts = [];
function size() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    pts = Array.from({ length: Math.min(70, Math.floor(W / 20)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }))
}
function draw() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach((p, i) => {
        if (!calm) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1 }
        ctx.fillStyle = `rgba(${S()},.8)`; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 6.28); ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
            const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 140) { ctx.strokeStyle = `rgba(${B()},${.35 * (1 - d / 140)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() }
        }
    });
    if (!calm) requestAnimationFrame(draw);
}
size(); draw(); addEventListener('resize', () => { size(); if (calm) draw() });