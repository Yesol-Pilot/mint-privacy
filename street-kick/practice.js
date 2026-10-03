// Guide-only practice; no storage, game SDK, ads, rewards or music.
export function markerPosition(elapsed, slow = false) {
  const sweep = Math.max(0, elapsed) / (slow ? 4800 : 2400);
  const phase = sweep % 2;
  return phase <= 1 ? phase : 2 - phase;
}
export function judgePractice(position) {
  if (!Number.isFinite(position) || position < 0 || position > 1) return 'miss';
  if (position >= 0.46 && position <= 0.54) return 'perfect';
  return position >= 0.35 && position <= 0.65 ? 'goal' : 'miss';
}
if (typeof document !== 'undefined') {
  const shoot = document.getElementById('practice-shoot');
  const marker = document.getElementById('practice-marker');
  const result = document.getElementById('practice-result');
  const count = document.getElementById('practice-count');
  const slow = document.getElementById('practice-slow');
  const play = document.getElementById('practice-play');
  slow.checked = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let phase = 'ready', shots = 0, goals = 0, perfects = 0;
  let elapsed = 0, last = 0, raf = 0, position = 0;
  const paint = () => { marker.style.left = `${position * 100}%`; };
  function frame(now) {
    if (phase !== 'aiming' || document.hidden) { raf = 0; return; }
    elapsed += Math.min(Math.max(0, now - last), 100); last = now;
    position = markerPosition(elapsed, slow.checked); paint();
    raf = requestAnimationFrame(frame);
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  function start() {
    phase = 'aiming'; elapsed = 0; position = 0; last = performance.now(); paint();
    slow.disabled = true; shoot.classList.add('primary');
    shoot.textContent = '탭해서 슛!';
    result.textContent = `${shots + 1}번째 공 · 흰 선이 초록 구간에 오면 탭해요.`;
    raf = requestAnimationFrame(frame);
  }
  shoot.disabled = false;
  shoot.addEventListener('click', () => {
    if (phase === 'done') { shots = 0; goals = 0; perfects = 0; play.hidden = true; }
    if (phase !== 'aiming') { count.textContent = `${shots} / 3 슛`; start(); return; }
    stop(); phase = 'between'; shots += 1; slow.disabled = false;
    const shot = judgePractice(position);
    if (shot !== 'miss') goals += 1;
    if (shot === 'perfect') perfects += 1;
    count.textContent = `${shots} / 3 슛`;
    const feedback = shot === 'perfect' ? '정밀골! 가운데에 딱 맞았어요.' : shot === 'goal' ? '골! 초록 구간에 잘 맞췄어요.' : '아깝다! 흰 선이 초록 구간에 오면 눌러봐요.';
    if (shots === 3) {
      phase = 'done'; result.textContent = `${feedback} 연습 ${goals}/3골 · 정밀골 ${perfects}회. 실제 경기에서 도전해볼까요?`;
      shoot.textContent = '세 번 더 연습하기'; shoot.classList.remove('primary'); play.hidden = false;
    } else { result.textContent = feedback; shoot.textContent = '다음 공 연습'; }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (phase === 'aiming' && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
  window.addEventListener('pagehide', stop);
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) stop();
    else if (phase === 'aiming' && !raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
  observer.observe(shoot.closest('section'));
}
