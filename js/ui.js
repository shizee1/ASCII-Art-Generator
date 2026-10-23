(function (App) {
  'use strict';

  const errorEl = document.getElementById('error');
  const fileInfoEl = document.getElementById('fileInfo');

  App.UI = {
    showError: function (message) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      setTimeout(function () {
        App.UI.hideError();
      }, 5000);
    },

    hideError: function () {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    },

    showFileInfo: function (file, img) {
      const sizeKB = (file.size / 1024).toFixed(1);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const sizeText = file.size > 1024 * 1024 ? sizeMB + ' МБ' : sizeKB + ' КБ';
      fileInfoEl.style.display = 'block';
      fileInfoEl.innerHTML =
        '<strong>' + escapeHtml(file.name) + '</strong><br>' +
        'Размер: ' + sizeText + ' · ' +
        img.naturalWidth + '×' + img.naturalHeight;
    },

    showPreviewThumb: function (dataUrl) {
      const thumb = document.getElementById('previewThumb');
      thumb.src = dataUrl;
      thumb.style.display = 'block';
    },

    notify: function (message) {
      const old = document.querySelector('.notify');
      if (old) old.remove();

      const el = document.createElement('div');
      el.className = 'notify';
      el.textContent = message;
      el.style.position = 'fixed';
      el.style.bottom = '24px';
      el.style.right = '24px';
      el.style.background = 'var(--panel)';
      el.style.border = '1px solid var(--border)';
      el.style.color = 'var(--text)';
      el.style.padding = '10px 16px';
      el.style.borderRadius = '8px';
      el.style.fontSize = '0.9rem';
      el.style.zIndex = '1000';
      el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
      document.body.appendChild(el);

      setTimeout(function () {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s';
        setTimeout(function () {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 300);
      }, 2000);
    },

    setExportButtonsDisabled: function (disabled) {
      const ids = ['downloadTxt', 'copyClipboard', 'downloadPng'];
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.disabled = disabled;
      });
    },
  };

  const escapeHtml = function (text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
    return String(text).replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  };

})(window.App || (window.App = {}));
