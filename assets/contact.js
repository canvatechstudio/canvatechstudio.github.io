const copyEmail = document.querySelector('[data-copy-email]');

if (navigator.clipboard?.writeText) {
  const address = document.querySelector('[data-contact-address]').textContent.trim();
  const status = document.querySelector('[data-copy-status]');
  copyEmail.hidden = false;

  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address);
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = 'Select the email address above and copy it from your browser.';
    }
  });
}
