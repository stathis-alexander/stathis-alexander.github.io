const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

const stars = Array.from({ length: 1000 }, () => ({
  x: Math.random(),
  y: Math.random(),
  alpha: Math.random(),
  speed: 0.0005 + Math.random() * 0.002,
  phase: Math.random() * Math.PI * 2
}));

function animate(t) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.alpha = Math.pow(Math.max(0, Math.sin(t * s.speed + s.phase)), 2);
    ctx.beginPath();
    ctx.arc(s.x * canvas.width, s.y * canvas.height, 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
