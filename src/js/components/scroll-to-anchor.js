function smoothScroll(target) {
  const element = document.querySelector(target);
  const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'));
  const targetPosition = element.offsetTop - headerHeight - 30;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const duration = 2000; // Время анимации в миллисекундах

  let start = null;
  let animationFrameId;

  function step(timestamp) {
    if (!start) start = timestamp;
    const timeElapsed = timestamp - start;
    const percentComplete = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutQuad(percentComplete);
    window.scrollTo(0, startPosition + distance * ease);
    if (timeElapsed < duration) {
      animationFrameId = window.requestAnimationFrame(step);
    }
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  animationFrameId = window.requestAnimationFrame(step);
}

document.querySelectorAll('.scroll').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.getAttribute('href');
    smoothScroll(target);
  });
});
