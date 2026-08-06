(function () {
  'use strict';

  const data = window.TRIP_DATA;
  if (!data || !data.presentation) {
    document.documentElement.dataset.tripDataState = 'missing';
    return;
  }

  const p = data.presentation;
  const byId = (id) => document.getElementById(id);

  function clear(node) {
    if (node) node.replaceChildren();
    return node;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function appendLines(parent, lines) {
    lines.forEach((line, index) => {
      if (index) parent.append(document.createElement('br'));
      parent.append(document.createTextNode(line));
    });
  }

  function renderSegments() {
    const root = clear(byId('overviewSteps'));
    if (!root) return;
    p.segments.forEach((segment, index) => {
      const card = el('div', 'step');
      card.append(
        el('div', 'num', String(index + 1)),
        el('div', 'region-code', segment.code),
        el('h4', '', segment.title)
      );
      const copy = el('p');
      appendLines(copy, [segment.detail, segment.sub]);
      card.append(copy);
      root.append(card);
    });
  }

  function renderSchedule(id, rows) {
    const root = clear(byId(id));
    if (!root) return;
    rows.forEach((item) => {
      const row = document.createElement('tr');
      if (item.highlight) row.className = 'hl';
      row.append(el('td', '', item.time), el('td', '', item.text));
      root.append(row);
    });
  }

  function renderDayCard(id, day) {
    const card = clear(byId(id));
    if (!card) return;
    card.append(el('div', 'region-code', day.code), el('h4', '', day.title));
    const copy = el('p', 'dim');
    appendLines(copy, day.lines);
    card.append(copy);
    if (day.note) card.append(el('p', 'day-note', day.note));
  }

  function renderDay5() {
    const root = clear(byId('day5Card'));
    if (!root) return;
    root.append(el('div', 'region-code', p.day5.code), el('h4', '', p.day5.title));
    const copy = el('p', 'dim');
    appendLines(copy, p.day5.lines);
    root.append(copy);
  }

  function renderDay7() {
    const root = clear(byId('day7Card'));
    if (!root) return;
    root.append(el('div', 'region-code', 'DAY 7'), el('h4', '', '週六 · 安全回程'));
    const timeline = el('div', 'mini-schedule');
    p.schedules.day7.forEach((item) => {
      const row = el('div', item.highlight ? 'mini-row is-key' : 'mini-row');
      row.append(el('strong', '', item.time), el('span', '', item.text));
      timeline.append(row);
    });
    root.append(timeline);
  }

  function renderDay6() {
    const root = clear(byId('day6Options'));
    if (!root) return;
    p.day6Options.forEach((option) => {
      const card = el('article', option.recommended ? 'option-card recommended' : 'option-card');
      const top = el('div', 'option-top');
      top.append(el('span', 'option-code', option.code), el('span', 'option-effort', option.effort));
      card.append(
        top,
        el('h3', '', option.title),
        el('p', 'option-mood', option.mood),
        el('p', 'option-route', option.route)
      );
      const tags = el('div', 'option-tags');
      option.highlights.forEach((tag) => tags.append(el('span', '', tag)));
      tags.append(el('span', 'weather', option.weather));
      card.append(tags);
      root.append(card);
    });
    const decision = byId('day6Decision');
    if (decision) decision.textContent = p.day6Decision;
  }

  function renderHotels() {
    const root = clear(byId('hotelGrid'));
    if (!root) return;
    p.lodgings.forEach((hotel) => {
      const card = el('div', 'hotel-card');
      card.append(
        el('div', 'h-date', `${hotel.code} · ${hotel.dates}`),
        el('h4', '', hotel.name)
      );
      const copy = el('p');
      appendLines(copy, [hotel.area, hotel.detail]);
      card.append(copy);
      root.append(card);
    });
  }

  function renderPrep() {
    const root = clear(byId('prepGrid'));
    if (!root) return;
    p.prep.forEach((item) => {
      const card = el('div', item.status === 'done' ? 'chk-item done' : 'chk-item');
      const body = document.createElement('div');
      const strong = document.createElement('strong');
      strong.append(el('span', `status-mark ${item.status}`), document.createTextNode(item.title));
      const detail = el('p', 'dim', item.detail);
      detail.style.margin = '0';
      detail.style.fontSize = '12px';
      body.append(strong, detail);
      card.append(body);
      root.append(card);
    });
  }

  function renderExpectations() {
    const root = clear(byId('expectGrid'));
    if (!root) return;
    p.expectations.forEach((item) => {
      const card = el('div', 'expect-card');
      card.append(el('strong', '', item.title), document.createTextNode(item.text));
      root.append(card);
    });
  }

  function numberSlides() {
    const slides = Array.from(document.querySelectorAll('.deck > .slide'));
    slides.forEach((slide, index) => {
      const number = slide.querySelector('.slide-number');
      if (!number) return;
      number.dataset.current = String(index + 1);
      number.dataset.total = String(slides.length);
    });
  }

  renderSegments();
  renderSchedule('day1Rows', p.schedules.day1);
  renderDayCard('day2Card', p.kawaguchiko.day2);
  renderDayCard('day3Card', p.kawaguchiko.day3);
  renderSchedule('day4Rows', p.schedules.day4);
  renderDay5();
  renderDay7();
  renderDay6();
  renderHotels();
  renderPrep();
  renderExpectations();
  numberSlides();
  document.documentElement.dataset.tripDataState = 'ready';
})();
