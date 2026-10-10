(() => {
  const search = document.getElementById('menu-search');
  const category = document.getElementById('menu-category');
  if (!search || !category) return;
  const groups = [...document.querySelectorAll('.menu-group')];
  const initialOpen = new Map(groups.map(g => [g, g.open]));
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function filter() {
    const terms = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let total = 0;
    groups.forEach(group => {
      const selected = category.value === 'all' || group.dataset.category === category.value;
      let count = 0;
      group.querySelectorAll('.menu-item').forEach(item => {
        const text = normalize(item.textContent);
        const matches = selected && terms.every(term => text.includes(term));
        item.hidden = !matches;
        if (matches) count++;
      });
      group.hidden = !count;
      group.open = (terms.length > 0 || category.value !== 'all') ? count > 0 : initialOpen.get(group);
      total += count;
    });
    document.getElementById('menu-empty').hidden = total > 0;
    document.getElementById('menu-status').textContent = `${total} ${total === 1 ? 'opção encontrada' : 'opções para explorar'}`;
  }
  search.addEventListener('input', filter);
  category.addEventListener('change', filter);
  // Preserve manually expanded categories when returning from a search.
  groups.forEach(group => group.addEventListener('toggle', () => {
    if (!search.value.trim() && category.value === 'all') initialOpen.set(group, group.open);
  }));
  document.getElementById('menu-status').textContent = `${document.querySelectorAll('.menu-item').length} opções para explorar`;
})();
