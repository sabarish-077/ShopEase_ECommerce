const products = [
  {
    id: "1",
    name: "Paisley Blue Kurta",
    category: "Women",
    price: 1299,
    image: "static/images/products/blue-kurta.jpg",
    description: "A soft, easy kurta with a classic paisley print and a relaxed everyday fit.",
    note: "Printed cotton blend"
  },
  {
    id: "2",
    name: "Essential White Tee",
    category: "Women",
    price: 599,
    image: "static/images/products/white-tee.webp",
    description: "A clean, versatile crew-neck tee made for simple daily layering.",
    note: "Soft cotton"
  },
  {
    id: "3",
    name: "Relaxed Denim Jeans",
    category: "Men",
    price: 1499,
    image: "static/images/products/denim-jeans.webp",
    description: "Relaxed-fit blue denim with a modern shape and easy movement.",
    note: "Relaxed fit"
  },
  {
    id: "4",
    name: "Classic White Shirt",
    category: "Men",
    price: 1199,
    image: "static/images/products/white-shirt.webp",
    description: "A crisp button-down shirt that works from weekday plans to evenings out.",
    note: "Regular fit"
  },
  {
    id: "5",
    name: "Printed Linen Shirt",
    category: "Men",
    price: 1399,
    image: "static/images/products/printed-shirt.webp",
    description: "A lightweight printed shirt with an easy, warm-weather feel.",
    note: "Linen blend"
  },
  {
    id: "6",
    name: "Pink Festive Suit",
    category: "Ethnic",
    price: 2299,
    image: "static/images/products/pink-suit.webp",
    description: "A bright printed suit set with a flowing dupatta for special occasions.",
    note: "Three-piece set"
  },
  {
    id: "7",
    name: "Natural Linen Trousers",
    category: "Men",
    price: 999,
    image: "static/images/products/linen-trousers.webp",
    description: "Light, neutral trousers with a straight leg and an understated finish.",
    note: "Linen blend"
  }
];

const cartKey = "shopease-static-cart";
const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(cartKey) || "{}");
  } catch {
    return {};
  }
}

function writeCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = Object.values(readCart()).reduce((total, quantity) => total + quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((element) => {
    element.textContent = count;
  });
}

function addToCart(id) {
  const cart = readCart();
  cart[id] = (cart[id] || 0) + 1;
  writeCart(cart);

  const notice = document.querySelector("[data-cart-notice]");
  if (notice) {
    notice.textContent = "Added to your cart.";
    window.setTimeout(() => { notice.textContent = ""; }, 2200);
  }
}

function productCard(product) {
  return `
    <article class="product-card">
      <a class="product-card-image" href="product.html?id=${product.id}" aria-label="View ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-card-copy">
        <p class="product-category">${product.category} <span>${product.note}</span></p>
        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="product-card-bottom">
          <strong>${money.format(product.price)}</strong>
          <button class="text-button" type="button" data-add-to-cart="${product.id}" aria-label="Add ${product.name} to cart">Add to cart +</button>
        </div>
      </div>
    </article>`;
}

function renderFeatured() {
  const container = document.querySelector("[data-featured-products]");
  if (container) {
    container.innerHTML = products.slice(0, 4).map(productCard).join("");
  }
}

function renderCatalog() {
  const container = document.querySelector("[data-product-grid]");
  if (!container) return;

  const search = document.querySelector("[data-product-search]").value.trim().toLowerCase();
  const category = document.querySelector("[data-product-category]").value;
  const filtered = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search);
    return matchesSearch && (!category || product.category === category);
  });

  container.innerHTML = filtered.length
    ? filtered.map(productCard).join("")
    : '<p class="empty-message">No products match that search. Try another term or category.</p>';
  document.querySelector("[data-results-count]").textContent = `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;
}

function renderProduct() {
  const container = document.querySelector("[data-product-detail]");
  if (!container) return;

  const product = products.find((item) => item.id === new URLSearchParams(window.location.search).get("id"));
  if (!product) {
    container.innerHTML = '<div class="empty-message"><h1>Product not found</h1><a class="button-link" href="products.html">Browse products</a></div>';
    return;
  }

  document.title = `${product.name} | ShopEase`;
  container.innerHTML = `
    <div class="detail-image"><img src="${product.image}" alt="${product.name}"></div>
    <div class="detail-copy">
      <p class="eyebrow">${product.category} / ${product.note}</p>
      <h1>${product.name}</h1>
      <p class="detail-price">${money.format(product.price)}</p>
      <p class="detail-description">${product.description}</p>
      <p class="demo-notice">Static preview item. Checkout and order processing are not enabled.</p>
      <button class="primary-button" type="button" data-add-to-cart="${product.id}">Add to cart</button>
      <p class="cart-notice" data-cart-notice aria-live="polite"></p>
      <a class="back-link" href="products.html">Back to all products</a>
    </div>`;
}

function renderCart() {
  const container = document.querySelector("[data-cart-items]");
  if (!container) return;

  const cart = readCart();
  const items = products.filter((product) => cart[product.id] > 0);
  const count = items.reduce((total, product) => total + cart[product.id], 0);
  const total = items.reduce((sum, product) => sum + product.price * cart[product.id], 0);
  document.querySelector("[data-cart-total]").textContent = money.format(total);
  document.querySelector("[data-cart-summary-count]").textContent = `${count} ${count === 1 ? "item" : "items"}`;

  if (!items.length) {
    container.innerHTML = '<div class="empty-cart"><h2>Your cart is empty</h2><p>Find something you like and it will show up here.</p><a class="primary-button" href="products.html">Browse products</a></div>';
    return;
  }

  container.innerHTML = items.map((product) => `
    <article class="cart-item">
      <a class="cart-item-image" href="product.html?id=${product.id}"><img src="${product.image}" alt="${product.name}"></a>
      <div class="cart-item-copy">
        <p class="product-category">${product.category}</p>
        <h2><a href="product.html?id=${product.id}">${product.name}</a></h2>
        <strong>${money.format(product.price)}</strong>
        <button class="remove-button" type="button" data-remove-item="${product.id}">Remove</button>
      </div>
      <div class="quantity-control" aria-label="Quantity for ${product.name}">
        <button type="button" data-change-quantity="-1" data-product-id="${product.id}" aria-label="Decrease quantity">-</button>
        <span>${cart[product.id]}</span>
        <button type="button" data-change-quantity="1" data-product-id="${product.id}" aria-label="Increase quantity">+</button>
      </div>
      <strong class="line-total">${money.format(product.price * cart[product.id])}</strong>
    </article>`).join("");
}

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");
  if (addButton) {
    addToCart(addButton.dataset.addToCart);
    return;
  }

  const removeButton = event.target.closest("[data-remove-item]");
  if (removeButton) {
    const cart = readCart();
    delete cart[removeButton.dataset.removeItem];
    writeCart(cart);
    renderCart();
    return;
  }

  const quantityButton = event.target.closest("[data-change-quantity]");
  if (quantityButton) {
    const cart = readCart();
    const id = quantityButton.dataset.productId;
    cart[id] = (cart[id] || 0) + Number(quantityButton.dataset.changeQuantity);
    if (cart[id] <= 0) delete cart[id];
    writeCart(cart);
    renderCart();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFeatured();
  renderProduct();
  renderCart();

  const search = document.querySelector("[data-product-search]");
  const category = document.querySelector("[data-product-category]");
  if (search && category) {
    const params = new URLSearchParams(window.location.search);
    search.value = params.get("search") || "";
    category.value = params.get("category") || "";
    renderCatalog();
    search.addEventListener("input", renderCatalog);
    category.addEventListener("change", renderCatalog);
  }
});
