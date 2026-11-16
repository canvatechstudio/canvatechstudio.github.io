const copyEmail = document.querySelector('[data-copy-email]');

if (navigator.clipboard?.writeText) {
  const emailLink = document.querySelector('[data-contact-address]');
  const status = document.querySelector('[data-copy-status]');
  copyEmail.hidden = false;

  copyEmail.addEventListener('click', async () => {
    try {
      const address = emailLink.textContent.trim();
      if (!emailLink.href.startsWith('mailto:')) {
        status.textContent = 'The email address is unavailable. You can use an app support link below.';
        return;
      }
      await navigator.clipboard.writeText(address);
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = 'Select the email address above and copy it from your browser.';
    }
  });
}
