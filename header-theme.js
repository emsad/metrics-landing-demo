(() => {
  const header = document.querySelector('.site-header');
  const sections = [...document.querySelectorAll('main > section, .site-footer')];

  if (!header || sections.length === 0) return;

  let scheduled = false;

  const updateHeaderTheme = () => {
    scheduled = false;
    const headerRect = header.getBoundingClientRect();
    const probeY = headerRect.top + (headerRect.height / 2);
    const activeSection = sections.find((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= probeY && rect.bottom > probeY;
    });

    const isNegative = activeSection?.classList.contains('theme-negative') ?? false;
    header.classList.toggle('header-on-negative', isNegative);
    header.classList.toggle('header-on-positive', !isNegative);
  };

  const scheduleHeaderThemeUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateHeaderTheme);
  };

  window.addEventListener('scroll', scheduleHeaderThemeUpdate, { passive: true });
  window.addEventListener('resize', scheduleHeaderThemeUpdate);
  updateHeaderTheme();
})();
