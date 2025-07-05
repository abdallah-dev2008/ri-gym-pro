document.addEventListener('DOMContentLoaded', () => {
  // Tilt effect
  const tiltElements = document.querySelectorAll('.tilt-card');
  if (tiltElements.length) {
    VanillaTilt.init(tiltElements, {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.2
    });
  }

  // Delivery costs
  const deliveryCosts = {"Adrar": 1200, "Chlef": 700, "Laghouat": 900, "Oum El Bouaghi": 800, "Batna": 800, "Béjaïa": 700, "Biskra": 900, "Béchar": 1100, "Blida": 600, "Bouira": 700, "Tamanrasset": 1500, "Tébessa": 900, "Tlemcen": 800, "Tiaret": 800, "Tizi Ouzou": 700, "Algiers": 600, "Djelfa": 800, "Jijel": 700, "Sétif": 800, "Saïda": 800, "Skikda": 700, "Sidi Bel Abbès": 800, "Annaba": 700, "Guelma": 800, "Constantine": 700, "Médéa": 700, "Mostaganem": 700, "M'Sila": 800, "Mascara": 800, "Ouargla": 1200, "Oran": 700, "El Bayadh": 1000, "Illizi": 1500, "Bordj Bou Arréridj": 800, "Boumerdès": 600, "El Tarf": 900, "Tindouf": 1500, "Tissemsilt": 800, "El Oued": 1000, "Khenchela": 900, "Souk Ahras": 900, "Tipaza": 600, "Mila": 800, "Aïn Defla": 700, "Naâma": 1000, "Aïn Témouchent": 800, "Ghardaïa": 1100, "Relizane": 800, "Timimoun": 1400, "Bordj Badji Mokhtar": 1500, "Ouled Djellal": 1000, "Béni Abbès": 1400, "In Salah": 1500, "In Guezzam": 1500, "Touggourt": 1100, "Djanet": 1500, "El M'Ghair": 1100, "El Meniaa": 1300};

  // Fill wilaya select
  const wilayaSelect = document.getElementById('wilaya');
  Object.keys(deliveryCosts).forEach(w => {
    const opt = document.createElement('option');
    opt.value = w;
    opt.textContent = w;
    wilayaSelect.appendChild(opt);
  });

  const orderButtons = document.querySelectorAll('.order-btn');
  const modal = document.getElementById('order-modal');
  const closeModal = document.getElementById('close-modal');
  const productNameElem = document.getElementById('modal-product-name');
  const productInput = document.getElementById('product');
  const quantityInput = document.getElementById('quantity');
  const deliverySpan = document.getElementById('delivery-cost');
  const totalSpan = document.getElementById('total-cost');

  let currentPrice = 0;

  const calculateTotal = () => {
    const wilaya = wilayaSelect.value;
    const delivery = wilaya ? deliveryCosts[wilaya] : 0;
    const quantity = parseInt(quantityInput.value, 10) || 1;
    deliverySpan.textContent = delivery;
    totalSpan.textContent = currentPrice * quantity + delivery;
  };

  orderButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      const prod = btn.dataset.product;
      currentPrice = parseInt(btn.dataset.price, 10);
      productNameElem.textContent = prod;
      productInput.value = prod;
      quantityInput.value = 1;
      wilayaSelect.value = '';
      deliverySpan.textContent = 0;
      totalSpan.textContent = currentPrice;
    });
  });

  closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  wilayaSelect.addEventListener('change', calculateTotal);
  quantityInput.addEventListener('input', calculateTotal);

  // Handle form submission
  document.getElementById('order-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('تم استلام طلبك بنجاح! سنتواصل معك لتأكيد الطلب.');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  });
    // Category filter
  const categoryItems = document.querySelectorAll('.category-item');
  const productCards = document.querySelectorAll('.tilt-card');

  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active from all
      categoryItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const cat = item.getAttribute('data-category');
      productCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  // --- Search functionality ---
const searchInput = document.getElementById('product-search');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const value = this.value.toLowerCase();
    document.querySelectorAll('.tilt-card').forEach(card => {
      const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
      card.style.display = name.includes(value) ? '' : 'none';
    });
  });
}

// --- Cart functionality ---
let cart = [];
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartModal = document.getElementById('close-cart-modal');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

function updateCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `${item.name} x${item.qty} - ${item.price * item.qty} DA <button data-idx="${idx}" style="color:red;">Remove</button>`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total;
  cartCount.textContent = cart.length;
}

document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const name = btn.dataset.product;
    const price = parseInt(btn.dataset.price, 10);
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    updateCart();
  });
});

if (cartBtn) {
  cartBtn.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    updateCart();
  });
}
if (closeCartModal) {
  closeCartModal.addEventListener('click', () => {
    cartModal.classList.add('hidden');
    document.body.style.overflow = '';
  });
}
if (cartItems) {
  cartItems.addEventListener('click', function (e) {
    if (e.target.tagName === 'BUTTON') {
      const idx = parseInt(e.target.dataset.idx, 10);
      cart.splice(idx, 1);
      updateCart();
    }
  });
}
});