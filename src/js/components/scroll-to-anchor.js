function smoothScroll(target) {
  let targetPosition = document.querySelector(target).offsetTop;
  let startPosition = window.pageYOffset;
  let distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    let timeElapsed = currentTime - startTime;
    let run = ease(timeElapsed, startPosition, distance, 2000);
    window.scrollTo(0, run);
    if (timeElapsed < 2000) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

let links = document.querySelectorAll('.scroll');
links.forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    let target = link.getAttribute('href');
    smoothScroll(target);
  });
});
