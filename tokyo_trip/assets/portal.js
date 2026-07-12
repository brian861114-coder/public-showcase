(() => {
  const tabs = [...document.querySelectorAll('[data-stage-tab]')];
  const panels = [...document.querySelectorAll('[data-stage-panel]')];
  if (!tabs.length || !panels.length) return;
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
})();
