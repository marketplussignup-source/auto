const highIncomeZips = new Set(['94027','94022','94024','90210','94105','33139','10007','02116']);

const intentIndicators = {
  high: ['install', 'quote', 'estimate', 'interested', 'ready', 'now', 'book', 'pay'],
  medium: ['check', 'info', 'show', 'cost', 'how much', 'solar questions', 'consult']
};

function classifyIntent(text) {
  const clean = text.toLowerCase();
  let score = 0;
  for (const keyword of intentIndicators.high) {
    if (clean.includes(keyword)) score += 3;
  }
  for (const keyword of intentIndicators.medium) {
    if (clean.includes(keyword)) score += 1;
  }
  return Math.min(100, Math.max(0, Math.floor((score / 15) * 100)));
}

function isInTargetZip(zip) {
  return highIncomeZips.has(String(zip).trim());
}

function getSmsAction(score, zipHit) {
  if (!zipHit) return {
    action: 'Do not auto-send, follow up with geo-upgrade content',
    message: 'This lead is outside target premium zip. Send nurturing sequence.'
  };
  if (score >= 55) return {
    action: 'Send immediate hot lead SMS',
    message: 'High intent lead. Auto-text customer with booking link and upsell offer.'
  };
  if (score >= 25) return {
    action: 'Send warm reply SMS',
    message: 'Warm lead. Invite to a quick free solar savings call.'
  };
  return {
    action: 'Queue for nurture drip',
    message: 'Low intent. Keep in the cadence and harvest data.'
  };
}

const form = document.getElementById('demo-form');
const result = document.getElementById('result');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const phone = document.getElementById('caller-phone').value.trim();
  const zip = document.getElementById('zip').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!phone || !zip || !message) {
    result.textContent = 'Please complete all fields.';
    return;
  }

  const zipHit = isInTargetZip(zip);
  const score = classifyIntent(message);
  const sms = getSmsAction(score, zipHit);

  result.innerHTML = `
    <p><strong>Caller:</strong> ${phone}</p>
    <p><strong>ZIP code:</strong> ${zip} ${zipHit ? '(target high-income)' : '(non-target)'}</p>
    <p><strong>Intent score:</strong> ${score}/100</p>
    <p><strong>Recommended action:</strong> ${sms.action}</p>
    <p><strong>Auto-text draft:</strong> ${sms.message}</p>
    <p><em>In production, this would write to your Google Sheet, update CRM, and call Twilio SMS API.</em></p>
  `;
});
