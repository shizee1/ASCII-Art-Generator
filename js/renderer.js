(function (App) {
  'use strict';

  const outputEl = document.getElementById('asciiOutput');

  App.Renderer = {
    // Рендерит ASCII в DOM (<pre>)
    render: function (ascii, color) {
      outputEl.classList.remove('empty');
      if (color) {
        outputEl.innerHTML = App.Converter.toHtml(ascii, true);
      } else {
        outputEl.textContent = App.Converter.toText(ascii);
      }
    },

    // Отрисовывает ASCII на канвасе для экспорта в PNG
    // Возвращает HTMLCanvasElement
    renderToCanvas: function (ascii, color) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const fontSize = 14;
      const font = fontSize + 'px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.font = font;

      // Измеряем реальную ширину символа и высоту строки
      const metrics = ctx.measureText('М');
      const charWidth = Math.max(metrics.width || fontSize * 0.6, fontSize * 0.5);
      const lineHeight = fontSize * 1.25;

      canvas.width = Math.ceil(ascii.width * charWidth);
      canvas.height = Math.ceil(ascii.height * lineHeight);

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = font;
      ctx.textBaseline = 'top';

      for (let y = 0; y < ascii.height; y++) {
        for (let x = 0; x < ascii.width; x++) {
          const cell = ascii.lines[y][x];
          if (color) {
            ctx.fillStyle = 'rgb(' + cell.r + ',' + cell.g + ',' + cell.b + ')';
          } else {
            ctx.fillStyle = '#ffffff';
          }
          ctx.fillText(cell.ch, x * charWidth, y * lineHeight);
        }
      }

      return canvas;
    },

    // Сброс предпросмотра в пустое состояние
    reset: function () {
      outputEl.classList.add('empty');
      outputEl.textContent = 'Загрузите изображение, чтобы начать';
      outputEl.innerHTML = outputEl.textContent;
    },
  };

})(window.App || (window.App = {}));
