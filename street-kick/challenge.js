const CANONICAL = 'https://yesol-pilot.github.io/mint-privacy/street-kick/';
export function parseGoals(raw) {
  if (typeof raw !== 'string' || !/^(0|[1-9][0-9]{0,2})$/.test(raw.trim())) return null;
  return Number(raw.trim());
}
export function challengeLink(raw) {
  const goals = parseGoals(raw);
  return goals === null ? CANONICAL : `${CANONICAL}#goals=${goals}`;
}
export function receivedGoals(hash) {
  // Only accept links created by this page; reject ambiguous or injected fields.
  const match = /^#goals=(0|[1-9][0-9]{0,2})$/.exec(hash);
  return match ? parseGoals(match[1]) : null;
}
if (typeof document !== 'undefined') {
  const invite = document.getElementById('challenge-invite');
  function showInvite() {
    const goals = receivedGoals(location.hash);
    invite.hidden = goals === null;
    document.getElementById('invite-title').textContent = goals === null ? '' : `${goals}골 기록에 도전해볼까요?`;
  }
  showInvite();
  window.addEventListener('hashchange', showInvite);
  const input = document.getElementById('goals');
  const error = document.getElementById('score-error');
  const status = document.getElementById('share-status');
  const button = document.getElementById('share');
  const fallback = document.getElementById('share-link-wrap');
  const linkField = document.getElementById('share-link');
  button.disabled = false;
  input.addEventListener('input', () => {
    error.textContent = ''; input.removeAttribute('aria-invalid');
    fallback.hidden = true; status.textContent = '';
  });
  document.getElementById('challenge-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    const raw = input.value.trim();
    const goals = parseGoals(raw);
    if (raw && goals === null) {
      error.textContent = '골 수를 0~999 사이의 정수로 입력해주세요.';
      input.setAttribute('aria-invalid', 'true'); input.focus(); return;
    }
    error.textContent = ''; input.removeAttribute('aria-invalid');
    status.textContent = ''; fallback.hidden = true;
    const url = challengeLink(raw);
    const text = goals === null ? '승부차기 토너먼트에서 나의 골 기록에 도전해보세요.' : `승부차기 토너먼트 · 토스 일반 경기 ${goals}골! (직접 입력한 기록) 너는 몇 골 넣을 수 있어?`;
    button.disabled = true;
    try {
      if (navigator.share) {
        await navigator.share({ title: '승부차기 토너먼트 · 친구의 골 기록 도전', text, url });
        status.textContent = '다음에는 친구의 골 기록에도 도전해보세요.';
      } else {
        linkField.value = url; fallback.hidden = false;
        if (navigator.clipboard?.writeText) {
          try { await navigator.clipboard.writeText(url); status.textContent = '도전 링크를 복사했어요. 친구에게 붙여넣어 보내보세요.'; }
          catch { status.textContent = '아래 도전 링크를 길게 눌러 복사해 보내보세요.'; }
        } else { status.textContent = '아래 도전 링크를 길게 눌러 복사해 보내보세요.'; }
      }
    } catch (e) {
      if (e?.name !== 'AbortError') {
        linkField.value = url; fallback.hidden = false;
        status.textContent = '아래 도전 링크를 길게 눌러 복사해 보내보세요.';
      }
    } finally { button.disabled = false; }
  });
}
