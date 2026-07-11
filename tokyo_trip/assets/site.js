(() => {
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
    [['search.html','搜尋']].forEach(([href,label]) => { if (!nav.querySelector(`[href="${href}"]`)) { const link=document.createElement('a'); link.href=href; link.textContent=label; nav.append(link); } });
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
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
