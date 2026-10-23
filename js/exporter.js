(function (App) {
  'use strict';

  App.Exporter = {
    // Скачивает ASCII как .txt
    downloadTxt: function (ascii) {
      const text = App.Converter.toText(ascii);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      App.Exporter.downloadBlob(blob, 'ascii-art.txt');
    },

    // Копирует ASCII в буфер обмена
    copyToClipboard: function (ascii) {
      const text = App.Converter.toText(ascii);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {
            App.UI.notify('Скопировано в буфер обмена');
          },
          function () {
            App.Exporter.fallbackCopy(text);
          }
        );
      } else {
        App.Exporter.fallbackCopy(text);
      }
    },

    // Фолбэк копирования через скрытый textarea
    fallbackCopy: function (text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        App.UI.notify('Скопировано в буфер обмена');
      } catch (err) {
        App.UI.showError('Не удалось скопировать в буфер обмена.');
      } finally {
        document.body.removeChild(textarea);
      }
    },

    // Скачивает ASCII как PNG (отрендерено на canvas)
    downloadPng: function (ascii, color) {
      const canvas = App.Renderer.renderToCanvas(ascii, color);
      const url = canvas.toDataURL('image/png');
      App.Exporter.downloadUrl(url, 'ascii-art.png');
    },

    downloadBlob: function (blob, filename) {
      const url = URL.createObjectURL(blob);
      App.Exporter.downloadUrl(url, filename);
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
    },

    downloadUrl: function (url, filename) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  };

})(window.App || (window.App = {}));
