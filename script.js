const WHATSAPP_NUMBER = "5551996164998"; // Exemplo: "51996164998", com código do país e DDD.

const products = [
  {
    id: 1,
    name: "Perfume Elegance",
    category: "Perfumes",
    price: 249.90,
    description: "Uma fragrância marcante e sofisticada.",
    tag: "DESTAQUE",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Perfume Gold",
    category: "Perfumes",
    price: 189.90,
    description: "Elegância em uma fragrância especial.",
    tag: "SELEÇÃO",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Whisky Premium",
    category: "Bebidas",
    price: 219.90,
    description: "Uma opção especial para presentear.",
    tag: "DESTAQUE",
    image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Vinho Reserva",
    category: "Bebidas",
    price: 129.90,
    description: "Para acompanhar bons momentos.",
    tag: "",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Jogo de Cama Premium",
    category: "Cama, Mesa e Banho",
    price: 189.90,
    description: "Conforto e elegância para o seu quarto.",
    tag: "MAIS VENDIDO",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Toalhas de Luxo",
    category: "Cama, Mesa e Banho",
    price: 89.90,
    description: "Maciez para transformar a sua rotina.",
    tag: "",
    image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Kit Presente Especial",
    category: "Variedade",
    price: 159.90,
    description: "Uma escolha elegante para surpreender.",
    tag: "PRESENTE",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Acessório Premium",
    category: "Variedade",
    price: 79.90,
    description: "Detalhes que fazem a diferença.",
    tag: "",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
  }
];

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("search-form");
const sortSelect = document.getElementById("sort-select");
const emptyMessage = document.getElementById("empty-message");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartDrawer = document.getElementById("cart-drawer");
const drawerBackdrop = document.getElementById("drawer-backdrop");
const toast = document.getElementById("toast");

let activeCategory = "Todos";
let favoritesOnly = false;
let favorites = new Set();
let cart = [];
let toastTimer;

const money = value =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function getVisibleProducts() {
  let result = [...products];

  if (activeCategory !== "Todos") {
    result = result.filter(
      product => product.category === activeCategory
    );
  }

  const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");

  if (term) {
    result = result.filter(product =>
      `${product.name} ${product.category} ${product.description}`
        .toLocaleLowerCase("pt-BR")
        .includes(term)
    );
  }

  if (favoritesOnly) {
    result = result.filter(product => favorites.has(product.id));
  }

  switch (sortSelect.value) {
    case "price-low":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      result.sort((a, b) => b.price - a.price);
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
      break;
  }

  return result;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  productGrid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
        ${product.tag
          ? `<span class="product-tag">${product.tag}</span>`
          : ""}
        <button
          class="favorite-toggle ${favorites.has(product.id) ? "is-favorite" : ""}"
          data-favorite="${product.id}"
          aria-label="${favorites.has(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}"
          aria-pressed="${favorites.has(product.id)}"
        >${favorites.has(product.id) ? "♥" : "♡"}</button>
      </div>

      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <strong class="product-price">
          ${money(product.price)}
          <small>Preço demonstrativo</small>
        </strong>
        <button class="add-cart" data-add="${product.id}">
          ADICIONAR AO CARRINHO +
        </button>
      </div>
    </article>
  `).join("");

  emptyMessage.hidden = visibleProducts.length > 0;
}

function setCategory(category) {
  activeCategory = category;
  favoritesOnly = false;

  document.querySelectorAll("[data-category]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.category === category
    );
  });

  document.getElementById("favorites-button")
    .setAttribute("aria-pressed", "false");

  renderProducts();
}

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", event => {
    event.preventDefault();
    setCategory(button.dataset.category);

    document.getElementById("produtos").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  renderProducts();

  document.getElementById("produtos").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

productGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const addButton = event.target.closest("[data-add]");

  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);

    if (favorites.has(id)) {
      favorites.delete(id);
      showToast("Produto removido dos favoritos.");
    } else {
      favorites.add(id);
      showToast("Produto adicionado aos favoritos!");
    }

    renderProducts();
    return;
  }

  if (addButton) {
    const id = Number(addButton.dataset.add);
    addToCart(id);
  }
});

document.getElementById("favorites-button").addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;

  if (favoritesOnly) {
    activeCategory = "Todos";
    document.querySelectorAll("[data-category]").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.category === "Todos"
      );
    });
  }

  document.getElementById("favorites-button")
    .setAttribute("aria-pressed", String(favoritesOnly));

  renderProducts();

  document.getElementById("produtos").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  if (favoritesOnly && favorites.size === 0) {
    showToast("Você ainda não tem produtos favoritos.");
  }
});

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  renderCart();
  showToast("Produto adicionado ao carrinho!");
}

function changeQuantity(id, amount) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = totalItems;

  const total = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  cartTotal.textContent = money(total);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="cart-empty">
        Seu carrinho está vazio.<br>
        Descubra algo especial para você.
      </p>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const product = products.find(product => product.id === item.id);

    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${money(product.price * item.quantity)}</p>
          <div class="quantity-controls">
            <button data-quantity="${product.id}" data-change="-1" aria-label="Diminuir quantidade">−</button>
            <span>${item.quantity}</span>
            <button data-quantity="${product.id}" data-change="1" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <button class="remove-item" data-remove="${product.id}">Excluir</button>
      </article>
    `;
  }).join("");
}

cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    changeQuantity(
      Number(quantityButton.dataset.quantity),
      Number(quantityButton.dataset.change)
    );
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

function openCart() {
  cartDrawer.classList.add("open");
  drawerBackdrop.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("drawer-open");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");
}

document.getElementById("cart-button").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

document.getElementById("checkout-button").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Adicione algum produto antes de continuar.");
    return;
  }

  if (!/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
    showToast("Configure o número do WhatsApp no arquivo script.js.");
    return;
  }

  const lines = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    return `• ${product.name} x${item.quantity} = ${money(product.price * item.quantity)}`;
  });

  const total = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  const message = [
    "Olá! Quero fazer um pedido na World Imports.",
    "",
    ...lines,
    "",
    `Total dos produtos: ${money(total)}`,
    "",
    "Gostaria de confirmar a disponibilidade, o frete e as formas de pagamento."
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

function openWhatsApp() {
  if (!/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
    showToast("Configure o número do WhatsApp no arquivo script.js.");
    return;
  }

  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de conhecer os produtos da World Imports.")}`,
    "_blank",
    "noopener,noreferrer"
  );
}

document.getElementById("newsletter-button").addEventListener("click", event => {
  event.preventDefault();
  openWhatsApp();
});

document.getElementById("footer-contact").addEventListener("click", event => {
  event.preventDefault();
  openWhatsApp();
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();