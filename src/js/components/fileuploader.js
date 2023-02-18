class FileUploader {
  constructor(selector, options = {}) {
    const defaults = {
      maxFileSize: 10, // Максимальный размер файла в МБ
      maxFileCount: 5, // Максимальное количество файлов
      deleteText: 'Удалить файл', // Текст для кнопки удаления файла
      onChange: () => {}, // Функция, вызываемая при изменении списка файлов
      onMaxFileSizeExceeded: () => {}, // Функция, вызываемая при попытке загрузить слишком большой файл
      onMaxFileCountExceeded: () => {}, // Функция, вызываемая при попытке загрузить слишком много файлов
      onFileAdded: () => {}, // Функция, вызываемая при добавлении файла
      onFileRemoved: () => {}, // Функция, вызываемая при удалении файла
    };
    this.options = Object.assign(defaults, options);
    this.container = selector;
    this.input = this.container.querySelector('input[type="file"]');
    this.filesList = this.container.querySelector('.file-loader__files');
    this.dropBox = this.container.querySelector('.file-loader__input-wrapper');
    this.files = [];
    this.init();
  }

  init() {
    this.input.addEventListener('change', (event) => {
      const files = event.target.files;
      const exceededFiles = this.getExceededFiles(files);
      if (exceededFiles.length) {
        this.options.onMaxFileSizeExceeded(exceededFiles);
      } else {
        this.addFiles(files);
      }
      this.input.value = ''; // Сбросить значение input для возможности загрузки одних и тех же файлов

    });

    this.dropBox.addEventListener('dragover', (event) => {
      event.preventDefault();
    });

    this.dropBox.addEventListener('drop', (event) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      const exceededFiles = this.getExceededFiles(files);
      if (exceededFiles.length) {
        this.options.onMaxFileSizeExceeded(exceededFiles);
      } else {
        this.addFiles(files);
      }
    });

    this.filesList.addEventListener('click', (event) => {
      if (event.target.classList.contains('file-loader__file-delete')) {
        this.removeFile(event.target.parentNode);
      }
    });
  }

  addFiles(files) {
    if (this.files.length + files.length > this.options.maxFileCount) {
      this.options.onMaxFileCountExceeded();
      return;
    }

    Array.from(files).forEach((file) => {
      // Проверка на уже прикрепленный файл
      const isAlreadyAdded = this.files.some((addedFile) => addedFile.name === file.name);
      if (isAlreadyAdded) {
        alert(`Файл ${file.name} уже прикреплен`);
        return;
      }
      if (file.size / 1024 / 1024 > this.options.maxFileSize) {
        this.options.onMaxFileSizeExceeded([file]);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const url = URL.createObjectURL(file);
        const item = document.createElement('li');
        item.classList.add('file-loader__file');
        item.innerHTML = `<a href="${url}" class="file-loader__file-name" target="_blank">${file.name}</a><button type="button" class="file-loader__file-delete">${this.options.deleteText}</button>`;
        this.filesList.appendChild(item);
        this.files.push(file);
        this.options.onFileAdded(file);
        this.options.onChange(this.files);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  removeFile(node) {
    const index = Array.from(this.filesList.children).indexOf(node);
    this.filesList.removeChild(node);
    if (this.files && this.files.length > 0) {
      this.files.splice(index, 1);
      this.options.onFileRemoved(index);
      this.options.onChange(this.files);
    }
  }

  getExceededFiles(files) {
    const exceededFiles = [];
    Array.from(files).forEach((file) => {
      if (file.size / 1024 / 1024 > this.options.maxFileSize) {
        exceededFiles.push(file);
      }
    });
    return exceededFiles;
  }

  clear() {
    this.filesList.innerHTML = '';
    this.files = [];
  }
}

// Пример использования:
const options = {
  maxFileSize: 10,
  maxFileCount: 5,
  deleteText: 'Удалить',
  onChange: (files) => {
    console.log('Список файлов изменился:', files);
  },
  onMaxFileSizeExceeded: (files) => {
    alert('Превышен максимальный размер файла:', files);
  },
  onMaxFileCountExceeded: () => {
    alert('Превышено максимальное количество файлов');
  },
  onFileAdded: (file, files) => {
    console.log('Добавлен файл:', file);
  },
  onFileRemoved: (file) => {
    console.log('Удален файл:', file);
  },
}

const uploaders = document.querySelectorAll('.file-loader');
uploaders.forEach((uploader) => {
  new FileUploader(uploader, options);
});
