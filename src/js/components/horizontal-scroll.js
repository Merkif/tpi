const scrollContainers = document.querySelectorAll("[data-scroll='horizontal']");

scrollContainers.forEach(container => {
  container.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    const currentScroll = container.scrollLeft;
    const newScroll = currentScroll + evt.deltaY;
    container.scrollLeft = newScroll;
  });
});
