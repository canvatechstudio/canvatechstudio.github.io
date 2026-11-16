function setupDeviceTabs(section, onSelect) {
  const controls = section.querySelector('[data-device-controls]');
  const tabList = section.querySelector('[data-tabs]');
  const tabs = [...tabList.querySelectorAll('button')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  let activeIndex = 0;

  function select(index) {
    activeIndex = index;
    tabs.forEach((tab, position) => {
      const selected = position === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[position].hidden = !selected;
    });
    onSelect(index);
  }

  tabList.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', () => select(index));
  });

  tabList.addEventListener('keydown', (event) => {
    const positions = {
      ArrowLeft: (activeIndex + tabs.length - 1) % tabs.length,
      ArrowRight: (activeIndex + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    };
    const index = positions[event.key];
    if (index === undefined) return;
    event.preventDefault();
    select(index);
    tabs[index].focus();
  });

  section.dataset.enhanced = '';
  controls.hidden = false;
  select(0);
}

const gallery = document.querySelector('[data-gallery]');

if (gallery) {
  const tracks = [...gallery.querySelectorAll('[data-gallery-track]')];
  const previous = gallery.querySelector('[data-previous]');
  const next = gallery.querySelector('[data-next]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let activeTrack = tracks[0];

  function updateArrows() {
    const remaining = activeTrack.scrollWidth - activeTrack.clientWidth - activeTrack.scrollLeft;
    previous.disabled = activeTrack.scrollLeft <= 2;
    next.disabled = remaining <= 2;
  }

  function move(direction) {
    const [first, second] = activeTrack.children;
    const step = second.offsetLeft - first.offsetLeft;
    activeTrack.scrollBy({
      left: direction * step,
      behavior: reducedMotion.matches ? 'instant' : 'smooth'
    });
  }

  tracks.forEach((track) => track.addEventListener('scroll', updateArrows, { passive: true }));
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  window.addEventListener('resize', updateArrows);
  setupDeviceTabs(gallery, (index) => {
    activeTrack = tracks[index];
    updateArrows();
  });
}

const promo = document.querySelector('[data-promo]');

if (promo) {
  const recordings = [...promo.querySelectorAll('video')];
  setupDeviceTabs(promo, (index) => {
    recordings.forEach((recording, position) => {
      if (position !== index) recording.pause();
    });
  });
}
