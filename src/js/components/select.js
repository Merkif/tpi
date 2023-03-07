class Select {
  constructor(select) {
    this.select = select;
    this.selectBtn = select.querySelector('.c-select__value');
    this.selectOptions = select.querySelector('.c-select__options');
    this.checkboxes = select.querySelectorAll('.c-select__options input');
    this.selectedOptionsContainer = null;
    this.closeOnSelect = select.hasAttribute('data-close-on-select');

    this.getOptionsCountText = this.getOptionsCountText.bind(this);
    this.updateSelectText = this.updateSelectText.bind(this);
    this.onSelectBtnClick = this.onSelectBtnClick.bind(this);
    this.onCheckboxChange = this.onCheckboxChange.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
    document.addEventListener('keydown', this.onDocumentKeyDown);


    this.init();
  }

  getOptionsCountText(count) {
    if (count % 10 === 1 && count % 100 !== 11) {
      return `${count} вариант`;
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
      return `Выбрано ${count} варианта`;
    } else {
      return `Выбрано ${count} вариантов`;
    }
  }

  updateSelectText() {
    const selectedOptions = Array.from(this.checkboxes).filter(checkbox => checkbox.checked);
    if (selectedOptions.length === 1) {
      this.selectBtn.textContent = selectedOptions[0].nextElementSibling.textContent;
      this.selectBtn.title = selectedOptions[0].nextElementSibling.textContent;
    } else if (selectedOptions.length > 1) {
      this.selectBtn.textContent = this.getOptionsCountText(selectedOptions.length);
    } else {
      const radioButtons = Array.from(this.checkboxes).filter(checkbox => checkbox.type === 'radio');
      if (radioButtons.length > 0) {
        this.selectBtn.textContent = 'Выберите один из ответов';
      } else {
        this.selectBtn.textContent = 'Выбор нескольких вариантов ответа';
      }
    }

    if (selectedOptions.length > 0) {
      this.selectBtn.classList.add('c-select__value--selected');
    } else {
      this.selectBtn.classList.remove('c-select__value--selected');
    }

    if (this.selectedOptionsContainer) {
      this.selectedOptionsContainer.innerHTML = '';
      selectedOptions.forEach(option => {
        if (option.type === 'radio') {
          return;
        }

        const optionText = option.nextElementSibling.textContent;
        const optionElement = document.createElement('div');
        optionElement.classList.add('c-select__selected-option');
        optionElement.textContent = optionText;
        const removeBtn = document.createElement('button');
        removeBtn.classList.add('c-select__remove-option-btn');
        removeBtn.type = "button"
        removeBtn.textContent = 'Удалить пункт';
        removeBtn.addEventListener('click', () => {
          option.checked = false;
          this.updateSelectText();
        });
        optionElement.appendChild(removeBtn);
        this.selectedOptionsContainer.appendChild(optionElement);
      });
    }
  }

  onSelectBtnClick() {
    const selectHeight = this.selectOptions.getBoundingClientRect().height;
    const windowHeight = window.innerHeight;
    const distanceToBottom = windowHeight - this.selectBtn.getBoundingClientRect().bottom;

    if (distanceToBottom < 400 && selectHeight < distanceToBottom) {
      this.select.classList.add('c-select--open-top');
    } else {
      this.select.classList.remove('c-select--open-top');
    }

    this.select.classList.toggle('c-select--open');

    if (!this.select.classList.contains('c-select--open') && this.closeOnSelect) {
      this.updateSelectText();
    }

    if (this.select.classList.contains('c-select--open')) {
      document.addEventListener('keydown', this.onDocumentKeyDown);
      document.addEventListener('click', this.onDocumentClick);
    } else {
      document.removeEventListener('keydown', this.onDocumentKeyDown);
      document.removeEventListener('click', this.onDocumentClick);
    }
  }

  onCheckboxChange() {
    this.updateSelectText();
    if (this.closeOnSelect) {
      this.select.classList.remove('c-select--open');
      document.removeEventListener('keydown', this.onDocumentKeyDown);
    }
  }

  onDocumentClick(event) {
    if (!this.select.contains(event.target)) {
      this.select.classList.remove('c-select--open');
      this.select.classList.remove('c-select--open-top');
      document.removeEventListener('click', this.onDocumentClick);
    }
  }

  onDocumentKeyDown(event) {
    if (event.key === 'Escape' && this.select.classList.contains('c-select--open')) {
      this.select.classList.remove('c-select--open');
      this.select.classList.remove('c-select--open-top');
      document.removeEventListener('click', this.onDocumentClick);
      document.removeEventListener('keydown', this.onDocumentKeyDown);
    }
  }

  init() {
    this.selectBtn.addEventListener('click', this.onSelectBtnClick);

    this.selectedOptionsContainer = document.createElement('div');
    this.selectedOptionsContainer.classList.add('c-select__selected-options');
    this.selectOptions.parentNode.insertBefore(this.selectedOptionsContainer, this.selectOptions.nextSibling);

    this.checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', this.onCheckboxChange);
    });

    this.updateSelectText();
  }
}

const selects = document.querySelectorAll('.c-select');
selects.forEach(select => new Select(select));
