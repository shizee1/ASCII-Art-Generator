(function (App) {
  'use strict';

  const luminance = function (r, g, b) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const escapeHtml = function (text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return String(text).replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  };

  App.Converter = {
    // Конвертирует изображение в ASCII-структуру.
    // settings: { width, preset, invert, color }
    // Возвращает: { width, height, lines: [[{ch, r, g, b}, ...], ...] }
    convert: function (img, settings) {
      const config = App.CONFIG;
      const width = Math.max(config.limits.minWidth, Math.min(config.limits.maxWidth, settings.width || config.defaultSettings.width));
      const presetKey = settings.preset || config.defaultSettings.preset;
      const chars = config.presets[presetKey] || config.presets.standard;
      const invert = !!settings.invert;

      // Offscreen canvas для чтения пикселей
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      const srcW = img.naturalWidth || img.width;
      const srcH = img.naturalHeight || img.height;

      // Корректируем высоту с учётом соотношения сторон символа (~0.5),
      // иначе арт растягивается по вертикали.
      const height = Math.max(1, Math.round(width * (srcH / srcW) * config.charAspectRatio));

      canvas.width = width;
      canvas.height = height;

      // Масштабируем изображение под целевое разрешение ( nearest neighbor через drawImage )
      ctx.drawImage(img, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const lastIndex = chars.length - 1;
      const lines = [];

      for (let y = 0; y < height; y++) {
        const line = [];
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          let lum = luminance(r, g, b);
          if (invert) lum = 255 - lum;

          const index = Math.round((lum / 255) * lastIndex);
          const ch = chars[Math.max(0, Math.min(lastIndex, index))];

          line.push({ ch: ch, r: r, g: g, b: b });
        }
        lines.push(line);
      }

      return {
        width: width,
        height: height,
        lines: lines,
      };
    },

    // Превращает структуру ASCII в обычный текст (для .txt и буфера обмена)
    toText: function (ascii) {
      return ascii.lines.map(function (line) {
        return line.map(function (cell) {
          return cell.ch;
        }).join('');
      }).join('\n');
    },

    // Превращает структуру ASCII в HTML (цветные span при необходимости)
    toHtml: function (ascii, color) {
      return ascii.lines.map(function (line) {
        return line.map(function (cell) {
          if (color) {
            return '<span style="color: rgb(' + cell.r + ',' + cell.g + ',' + cell.b + ')">' +
              escapeHtml(cell.ch) + '</span>';
          }
          return escapeHtml(cell.ch);
        }).join('');
      }).join('<br>');
    },
  };

})(window.App || (window.App = {}));
