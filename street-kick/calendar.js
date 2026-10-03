const HOUR = 3600000;
const PLAY_URL = 'https://toss.onelink.me/3563614660?deep_link_value=intoss%3A%2F%2Fstreet-kick-tournament&af_dp=intoss%3A%2F%2Fstreet-kick-tournament';
function stamp(date) { return date.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'; }
function escapeText(value) { return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;'); }
function foldLine(line) {
  const encoder = new TextEncoder();
  let result = '', bytes = 0;
  for (const char of line) {
    const length = encoder.encode(char).length;
    if (bytes + length > 75) { result += '\r\n '; bytes = 1; }
    result += char; bytes += length;
  }
  return result;
}
export function tomorrowEvent(now = new Date()) {
  const koreanDay = new Date(now.getTime() + 9 * HOUR);
  // Tomorrow at 09:00 KST equals tomorrow at 00:00 UTC.
  const start = new Date(Date.UTC(koreanDay.getUTCFullYear(), koreanDay.getUTCMonth(), koreanDay.getUTCDate() + 1));
  const key = start.toISOString().slice(0, 10);
  const dateLabel = `${start.getUTCMonth() + 1}월 ${start.getUTCDate()}일 오전 9시 (한국 시간)`;
  const description = `토스에서 승부차기 토너먼트를 열고 오늘의 도전에 참여해보세요.\n${PLAY_URL}\n안내: https://yesol-pilot.github.io/mint-privacy/street-kick/`;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Neo Genesis//Street Kick Return//KO',
    'CALSCALE:GREGORIAN', 'BEGIN:VEVENT',
    `UID:street-kick-${key}@yesol-pilot.github.io`, `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`, `DTEND:${stamp(new Date(start.getTime() + 10 * 60000))}`,
    'SUMMARY:' + escapeText('승부차기 토너먼트 오늘의 도전'),
    'DESCRIPTION:' + escapeText(description), 'URL:' + PLAY_URL,
    'END:VEVENT', 'END:VCALENDAR'
  ];
  return { filename: `street-kick-${key}.ics`, dateLabel, content: lines.map(foldLine).join('\r\n') + '\r\n' };
}
const button = document.getElementById('calendar');
if (button) {
  button.disabled = false;
  button.addEventListener('click', () => {
    const event = tomorrowEvent();
    const url = URL.createObjectURL(new Blob([event.content], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = event.filename;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    document.getElementById('calendar-status').textContent = `${event.dateLabel} 일정 파일을 열거나 저장한 뒤 캘린더에 추가해주세요. 알림은 직접 선택할 수 있어요.`;
  });
}

const google = document.getElementById('google-calendar');
function updateGoogleLink() {
  const event = tomorrowEvent();
  const unfolded = event.content.replace(/\r\n /g, '');
  const start = unfolded.match(/DTSTART:(.*)/)[1].trim();
  const end = unfolded.match(/DTEND:(.*)/)[1].trim();
  const params = new URLSearchParams({ action: 'TEMPLATE', text: '승부차기 토너먼트 오늘의 도전', dates: `${start}/${end}`, details: `토스에서 오늘의 도전에 참여해보세요.\n${PLAY_URL}` });
  google.href = `https://calendar.google.com/calendar/render?${params}`;
}
if (google) { updateGoogleLink(); google.hidden = false; google.addEventListener('click', updateGoogleLink); }
