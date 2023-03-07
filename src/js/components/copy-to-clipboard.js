const buttons = [...document.querySelectorAll('.text-copy__button')];
const successClassName = 'text-copy__label--success';
const errorClassName = 'text-copy__label--error';
let timeout;

function setDefaultState(tooltip) {
  tooltip.innerText = 'Скопировать ссылку';
  tooltip.classList.remove(successClassName);
}

function setSuccessState(tooltip) {
  tooltip.innerText = 'Скопировано';
  tooltip.classList.add(successClassName);
}

function setErrorState(tooltip) {
  tooltip.innerText = 'Не удалось скопировать';
  tooltip.classList.remove(errorClassName);
}

function handleCopy() {
  const tooltip = this.firstElementChild;
  const input = this.nextElementSibling;
  if (!input) {
    setErrorState(tooltip);
    return;
  }
  input.focus();
  input.select();
  input.setSelectionRange(0, 99999);
  if (navigator.clipboard) {
    try {
      navigator.clipboard.writeText(`${input.value}`).then(() => {
        setSuccessState(tooltip);
        setTimeout(() => {
          setDefaultState(tooltip);
        }, 1000);
      }).catch(() => {
        setErrorState(tooltip);
        setTimeout(() => {
          setDefaultState(tooltip);
        }, 1000);
      });
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      setErrorState(tooltip);
      setTimeout(() => {
        setDefaultState(tooltip);
      }, 1000);
    }
  } else {
    setErrorState(tooltip);
    setTimeout(() => {
      setDefaultState(tooltip);
    }, 1000);
  }
}

function handleMouseEnter() {
  const tooltip = this.firstElementChild;

  if (timeout) {
    return;
  }
  setDefaultState(tooltip);
}

function handleMouseOut() {
  const tooltip = this.firstElementChild;

  if (!tooltip.classList.contains(successClassName) && !tooltip.classList.contains(errorClassName)) {
    return;
  }

  timeout = setTimeout(() => {
    this.blur();
    setDefaultState(tooltip);
  }, 1000);
}

buttons.forEach((button) => {
  button.addEventListener('click', handleCopy);
  button.addEventListener('mouseenter', handleMouseEnter);
  button.addEventListener('mouseout', handleMouseOut);
});
