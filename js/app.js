(function (App) {
  'use strict';

  const config = App.CONFIG;

  // Состояние приложения
  const state = {
    settings: Object.assign({}, config.defaultSettings),
    ascii: null,
  };

  // DOM элементы
  const els = {
    widthRange: document.getElementById('widthRange'),
    widthValue: document.getElementById('widthValue'),
    presetSelect: document.getElementById('presetSelect'),
    invertCheck: document.getElementById('invertCheck'),
    colorCheck: document.getElementById('colorCheck'),
    downloadTxt: document.getElementById('downloadTxt'),
    copyClipboard: document.getElementById('copyClipboard'),
    downloadPng: document.getElementById('downloadPng'),
  };

  // Дебаунс для живого предпросмотра
  let renderTimer = null;

  const debounce = function (fn, delay) {
    return function () {
      clearTimeout(renderTimer);
      renderTimer = setTimeout(fn, delay);
    };
  };

  const recompute = function () {
    if (!App.Loader.image) return;

    const settings = {
      width: parseInt(els.widthRange.value, 10) || config.defaultSettings.width,
      preset: els.presetSelect.value,
      invert: els.invertCheck.checked,
      color: els.colorCheck.checked,
    };

    state.settings = settings;

    const ascii = App.Converter.convert(App.Loader.image, settings);
    state.ascii = ascii;

    App.Renderer.render(ascii, settings.color);
    App.UI.setExportButtonsDisabled(false);
  };

  const init = function () {
    // Загрузка файла → пересчёт арта
    App.Loader.init(function (img) {
      recompute();
    });

    // Живой предпросмотр при изменении настроек
    [els.widthRange, els.presetSelect, els.invertCheck, els.colorCheck].forEach(function (el) {
      el.addEventListener('input', debounce(recompute, 150));
      el.addEventListener('change', debounce(recompute, 150));
    });

    // Отображение текущего значения ширины
    els.widthRange.addEventListener('input', function () {
      els.widthValue.textContent = els.widthRange.value;
    });

    // Экспорт
    els.downloadTxt.addEventListener('click', function () {
      if (state.ascii) App.Exporter.downloadTxt(state.ascii);
    });

    els.copyClipboard.addEventListener('click', function () {
      if (state.ascii) App.Exporter.copyToClipboard(state.ascii);
    });

    els.downloadPng.addEventListener('click', function () {
      if (state.ascii) App.Exporter.downloadPng(state.ascii, state.settings.color);
    });

    App.UI.setExportButtonsDisabled(true);
  };

  // Точка входа
  App.init = init;

  // Запуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window.App || (window.App = {}));
