const stripe = Stripe('pk_test_your_stripe_publishable_key'); // Replace with your key

document.getElementById('pay-btn').addEventListener('click', async () => {
  const session = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: 49900 }) // $499 in cents
  }).then(r => r.json());

  const result = await stripe.redirectToCheckout({ sessionId: session.id });
  if (result.error) alert(result.error.message);
});

// Simulate auto-install after payment (in production, use Stripe webhooks)
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success')) {
    alert('Payment successful! App auto-installing... 3-day free trial started.');
    // Here, trigger actual setup: create Google Sheet, set up Twilio webhook, etc.
  }
});