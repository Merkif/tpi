const scrollContainers = document.querySelectorAll("[data-scroll='horizontal']");

scrollContainers.forEach(container => {
  container.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    container.scrollLeft += evt.deltaY;
  });

  container.addEventListener("DOMMouseScroll", (evt) => {
    evt.preventDefault();
    container.scrollLeft += evt.detail * 10;
  });

  container.addEventListener("mousewheel", (evt) => {
    evt.preventDefault();
    container.scrollLeft += evt.wheelDelta;
  });
});
