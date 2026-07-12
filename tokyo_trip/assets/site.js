(() => {
  if (!document.querySelector('link[href$="assets/site.css"]')) {
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = 'assets/site.css';
    document.head.append(styles);
  }
  document.body.classList.add('subpage-ui');
  const nav = document.querySelector('.trip-nav');
  const main = document.querySelector('main, .app, #app');
  if (main && !main.id) main.id = 'main-content';
  if (main && !document.querySelector('.site-skip')) {
    const skip = document.createElement('a');
    skip.className = 'site-skip';
    skip.href = `#${main.id || 'main-content'}`;
    skip.textContent = '跳至主要內容';
    document.body.prepend(skip);
  }
  if (nav) {
    nav.setAttribute('aria-label', nav.getAttribute('aria-label') || '旅程導覽');
    const current = location.pathname.split('/').pop() || 'index.html';
    const group = current === 'transportation_guide.html' || current === 'fuji_hakone_rail.html' || current === 'tokyo_rail.html' ? 'transport' :
      current === 'attractions_guide.html' ? 'attractions' :
      current === 'packing_checklist.html' || current === 'japanese_phrases.html' || current === 'budget.html' ? 'preparation' :
      current === 'emergency_guide.html' ? 'emergency' : current === 'search.html' ? 'search' : current === 'trip_timeline.html' ? 'preparation' : 'home';
    const links = [
      ['index.html', '首頁', 'home'],
      ['transportation.html', '交通', 'transport'],
      ['attractions.html', '景點', 'attractions'],
      ['preparation.html', '準備', 'preparation'],
      ['tools.html', '其他', 'tools'],
      ['search.html', '搜尋', 'search'],
      ['emergency_guide.html', '緊急協助', 'emergency']
    ];
    nav.replaceChildren(...links.map(([href, label, key]) => {
      const link = document.createElement('a');
      link.href = href; link.textContent = label;
      if (key === group) { link.setAttribute('aria-current', 'page'); }
      return link;
    }));
  }
  if (main && !document.querySelector('.site-page-actions')) {
    const current = location.pathname.split('/').pop() || 'index.html';
    const parent = current === 'transportation_guide.html' || current === 'fuji_hakone_rail.html' || current === 'tokyo_rail.html' ? ['transportation.html', '返回交通分類'] :
      current === 'attractions_guide.html' ? ['attractions.html', '返回景點分類'] :
      current === 'packing_checklist.html' || current === 'japanese_phrases.html' || current === 'budget.html' || current === 'trip_timeline.html' ? ['preparation.html', '返回準備分類'] :
      current === 'search.html' ? ['tools.html', '返回其他工具'] :
      current === 'emergency_guide.html' ? ['index.html', '返回旅程首頁'] : ['index.html', '返回旅程首頁'];
    const actions = document.createElement('nav');
    actions.className = 'site-page-actions';
    actions.setAttribute('aria-label', '返回導覽');
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'site-history-back';
    back.textContent = '← 上一頁';
    back.addEventListener('click', () => {
      const sameSiteReferrer = document.referrer && new URL(document.referrer).origin === location.origin;
      if (sameSiteReferrer) history.back();
      else location.href = parent[0];
    });
    const category = document.createElement('a');
    category.href = parent[0];
    category.textContent = parent[1];
    const home = document.createElement('a');
    home.href = 'index.html';
    home.textContent = '旅程首頁';
    actions.append(back, category, home);
    if (nav) nav.insertAdjacentElement('afterend', actions);
    else main.insertAdjacentElement('beforebegin', actions);
  }
  if (document.querySelector('.spot')) {
    const key = 'tokyo-trip-favorites-v1';
    const read = () => new Set(JSON.parse(localStorage.getItem(key) || '[]'));
    document.querySelectorAll('.spot').forEach((spot, index) => {
      const header = spot.querySelector('.spot-header');
      const name = spot.querySelector('.spot-name')?.textContent.trim();
      if (!header || !name) return;
      spot.id ||= `spot-${index + 1}`;
      const value = `attractions_guide.html#${spot.id}`;
      const resource = document.createElement('a');
      resource.className = 'site-resource';
      resource.href = window.ATTRACTION_RESOURCES?.[name] || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} 日本`)}`;
      resource.target = '_blank'; resource.rel = 'noopener noreferrer';
      resource.title = `在 Google 地圖查看 ${name}`;
      resource.setAttribute('aria-label', `在 Google 地圖查看 ${name}（另開分頁）`);
      resource.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7M21 3l-9 9M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/></svg>';
      resource.addEventListener('click', event => event.stopPropagation());
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'site-favorite';
      const sync = () => { const saved = read().has(value); button.textContent = saved ? '★' : '☆'; button.setAttribute('aria-pressed', saved); button.setAttribute('aria-label', `${saved ? '取消收藏' : '收藏'} ${name}`); };
      button.addEventListener('click', event => { event.stopPropagation(); const saved = read(); saved.has(value) ? saved.delete(value) : saved.add(value); localStorage.setItem(key, JSON.stringify([...saved])); sync(); });
      sync(); header.insertBefore(resource, header.lastElementChild); header.insertBefore(button, header.lastElementChild);
    });
  }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        // 每次進站主動檢查是否有新版 SW
        reg.update().catch(() => {});
        setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      }).catch(() => {});

      // 新 SW 接管後自動重整一次，避免卡在舊頁面
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
      });
    });
  }
})();
