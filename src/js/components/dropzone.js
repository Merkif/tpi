import Dropzone from "dropzone";

const mediaUploader = document?.querySelector('.js-media-uploader');
const mediaUploaderUrl = mediaUploader?.dataset.url || "upload.php";
const acceptedFiles = mediaUploader?.dataset.acceptedFiles || "image/png, image/svg+xml";
const thumbnailMethod = mediaUploader?.dataset.thumbnailMethod || "crop";
const thumbnailWidth = mediaUploader?.dataset.thumbnailWidth || 112;
const thumbnailHeight = mediaUploader?.dataset.thumbnailHeight || 112;


if(mediaUploader) {
  let mediaUploaderInit = new Dropzone(mediaUploader, {
    url: mediaUploaderUrl,
    acceptedFiles: acceptedFiles,
    previewsContainer: ".media-uploader__preview-container",
    autoDiscover: false,
    thumbnailWidth: thumbnailWidth,
    thumbnailHeight: thumbnailHeight,
    thumbnailMethod: thumbnailMethod,
    maxFiles: 1,
    maxFilesize: 2,
    parallelUploads: 1,
    dictResponseError: 'Код ошибки {{statusCode}}',
    dictDefaultMessage: 'Перетащите Файлы для загрузки',
    dictFileTooBig: "Размер файла не должен превышать {{maxFilesize}}Mб.",
    dictInvalidFileType: `Вы не можете загружать файлы этого типа, разрешенные форматы - ${acceptedFiles}`,
    dictMaxFilesExceeded: "Вы не можете загружать больше одного файла",
    previewTemplate: `
    <div class="media-uploader__preview">
      <img class="media-uploader__preview-img" data-dz-thumbnail />
    </div>
    `,
    accept: function (file, done) {
      console.log("uploaded");
      done();
    },
    init: function () {
      this.on("addedfile", function () {
        this.previewsContainer.classList.add('media-uploader__preview-container--gap');
        while (this.files.length > this.options.maxFiles) {
          this.removeFile(this.files[0]);
        }
      });

      this.on("success", function (file, response) {
        let oldText = this.element.querySelector('.media-uploader__text--main');
        let words = oldText.textContent.split(" ");
        words[0] = "Изменить";
        let newText = words.join(" ");
        oldText.textContent = newText;
      });

    },

    error: function (file, message) {
      if (file.previewElement) {
        alert(message);
        this.removeFile(file);
        this.previewsContainer.classList.remove('media-uploader__preview-container--gap');
      }
    },
  });
}
