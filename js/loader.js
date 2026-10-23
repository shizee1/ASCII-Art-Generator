(function (App) {
  'use strict';

  const supportedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

  App.Loader = {
    // Исходное изображение (HTMLImageElement)
    image: null,

    // Инициализация обработчиков загрузки
    init: function (onLoad) {
      const dropzone = document.getElementById('dropzone');
      const fileInput = document.getElementById('fileInput');
      const browseBtn = document.getElementById('browseBtn');
      const fileInfo = document.getElementById('fileInfo');
      const previewThumb = document.getElementById('previewThumb');

      // Кнопка выбора файла
      browseBtn.addEventListener('click', function () {
        fileInput.value = '';
        fileInput.click();
      });

      fileInput.addEventListener('change', function (e) {
        const file = e.target.files && e.target.files[0];
        if (file) this.handleFile(file, onLoad);
      }.bind(this));

      // Drag & Drop
      dropzone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });

      dropzone.addEventListener('dragleave', function () {
        dropzone.classList.remove('drag-over');
      });

      dropzone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) this.handleFile(file, onLoad);
      }.bind(this));
    },

    // Валидация и загрузка файла в изображение
    handleFile: function (file, onLoad) {
      App.UI.hideError();

      if (!file.type || !supportedTypes.includes(file.type)) {
        App.UI.showError('Неверный формат файла. Поддерживаются PNG, JPG, JPEG, GIF, WEBP.');
        return;
      }

      if (file.size > App.CONFIG.limits.maxFileSize) {
        App.UI.showError('Файл слишком большой. Максимальный размер — 10 МБ.');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          App.Loader.image = img;
          App.UI.showFileInfo(file, img);
          App.UI.showPreviewThumb(e.target.result);
          if (typeof onLoad === 'function') onLoad(img);
        };
        img.onerror = function () {
          App.UI.showError('Не удалось прочитать изображение. Попробуйте другой файл.');
        };
        img.src = e.target.result;
      };
      reader.onerror = function () {
        App.UI.showError('Ошибка при чтении файла.');
      };
      reader.readAsDataURL(file);
    },
  };

})(window.App || (window.App = {}));
