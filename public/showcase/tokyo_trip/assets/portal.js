(() => {
  const tabs = [...document.querySelectorAll('[data-stage-tab]')];
  const panels = [...document.querySelectorAll('[data-stage-panel]')];
  if (tabs.length && panels.length) {
    const activate = (stage) => {
      tabs.forEach(tab => {
        const selected = tab.dataset.stageTab === stage;
        tab.setAttribute('aria-selected', String(selected));
      });
      panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.stagePanel === stage));
      if (history.replaceState) history.replaceState(null, '', `#${stage}`);
    };
    tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.stageTab)));
    activate(location.hash.slice(1) || tabs[0].dataset.stageTab);
  }

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.update().catch(() => {});
        setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      }).catch(() => {});

      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
      });
    });
  }
})();
