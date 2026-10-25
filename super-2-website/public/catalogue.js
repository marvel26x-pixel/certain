const grid = document.querySelector('#product-grid');
const count = document.querySelector('#results-count');
const filters = {
  type: document.querySelector('#filter-type'),
  flavour: document.querySelector('#filter-flavour'),
  texture: document.querySelector('#filter-texture'),
  occasion: document.querySelector('#filter-occasion')
};
const resetButton = document.querySelector('#reset-filters');

function renderProducts(products) {
  const selected = Object.fromEntries(Object.entries(filters).map(([key, select]) => [key, select.value]));
  const visibleProducts = products.filter((product) =>
    Object.entries(selected).every(([key, value]) => !value || product[key] === value)
  );

  count.textContent = `${visibleProducts.length} sample ${visibleProducts.length === 1 ? 'biscuit' : 'biscuits'}`;
  if (visibleProducts.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'catalogue-message';
    empty.textContent = 'No sample biscuits match those filters. Try a different combination.';
    grid.replaceChildren(empty);
    return;
  }

  const cards = visibleProducts.map((product) => {
    const article = document.createElement('article');
    article.className = 'product-card';

    const visual = document.createElement('div');
    visual.className = 'product-visual';
    visual.dataset.palette = product.palette;
    visual.setAttribute('aria-hidden', 'true');
    const wrapper = document.createElement('div');
    wrapper.className = 'sample-wrapper';
    const brand = document.createElement('span');
    brand.className = 'sample-brand';
    brand.textContent = 'CERTAIN BISCUITS';
    const packName = document.createElement('span');
    packName.className = 'sample-pack-name';
    packName.textContent = product.name;
    const sample = document.createElement('span');
    sample.className = 'sample-stamp';
    sample.textContent = 'SAMPLE';
    wrapper.append(brand, packName, sample);
    visual.append(wrapper);

    const details = document.createElement('div');
    details.className = 'product-card-details';
    const title = document.createElement('h3');
    title.textContent = product.name;
    const category = document.createElement('p');
    category.textContent = `${product.type} · ${product.flavour}`;
    details.append(title, category);
    article.append(visual, details);
    return article;
  });

  grid.replaceChildren(...cards);
}

async function loadProducts() {
  try {
    const response = window.GITHUB_PAGES
      ? await fetch(`${window.SITE_BASE_PATH}data/products.json`)
      : await fetch('/api/products');
    if (!response.ok) throw new Error('Product catalogue is unavailable.');
    const products = await response.json();
    if (!Array.isArray(products)) throw new Error('Invalid product catalogue.');

    for (const [key, select] of Object.entries(filters)) {
      const options = [...new Set(products.map((product) => product[key]).filter(Boolean))].sort();
      for (const option of options) {
        const element = document.createElement('option');
        element.value = option;
        element.textContent = option;
        select.append(element);
      }
      select.addEventListener('change', () => renderProducts(products));
    }
    resetButton.addEventListener('click', () => {
      Object.values(filters).forEach((select) => { select.value = ''; });
      renderProducts(products);
    });
    renderProducts(products);
  } catch {
    count.textContent = 'Sample catalogue unavailable';
    grid.replaceChildren(Object.assign(document.createElement('p'), {
      className: 'catalogue-message',
      textContent: 'The sample catalogue could not load. Please try refreshing the page.'
    }));
  }
}

loadProducts();