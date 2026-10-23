(function (App) {
  'use strict';

  App.CONFIG = {
    // Пресеты наборов символов (от тёмного к светлому)
    presets: {
      standard: '@%#*+=-:. ',
      detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
      blocks: '█▓▒░ ',
      minimal: '@#*+-. ',
    },
    // Значения по умолчанию
    defaultSettings: {
      width: 100,
      preset: 'standard',
      invert: false,
      color: false,
    },
    // Лимиты
    limits: {
      maxFileSize: 10 * 1024 * 1024, // 10 МБ
      minWidth: 20,
      maxWidth: 300,
    },
    // Соотношение сторон одного символа (высота / ширина) для коррекции пропорций
    charAspectRatio: 0.5,
  };

})(window.App || (window.App = {}));
