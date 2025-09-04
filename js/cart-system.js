document.addEventListener('DOMContentLoaded', () => {
  // Inject cart HTML
  const cartHTML = `
    <div class="cart-button" id="cartBtn">🛒</div>
    <div class="cart-panel" id="cartPanel">
      <div class="cart-header">
        <span>Your Cart</span>
        <button id="closeCart">✖</button>
      </div>
      <div class="cart-items" id="cartItems"><p>Your cart is empty.</p></div>
      <span id="cartTotal">Total: $0</span>
      <button class="checkout-btn" id="checkoutBtn">Checkout</button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);

  const cartBtn = document.getElementById('cartBtn');
  const cartPanel = document.getElementById('cartPanel');
  const closeCart = document.getElementById('closeCart');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  let cart = [];

  cartBtn.addEventListener('click', () => cartPanel.classList.toggle('open'));
  closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));

  // Add plan buttons
  document.querySelectorAll('.plan-card .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.plan-card');
      const name = card.querySelector('h3').innerText;
      const price = parseFloat(card.querySelector('p strong').innerText.replace('$', '').replace(' / month',''));
      const existing = cart.find(i => i.name === name);
      if (existing) existing.qty++;
      else cart.push({ name, price, qty: 1 });
      renderCart();
      cartPanel.classList.add('open');
    });
  });

  function renderCart() {
    cartItems.innerHTML = '';
    if (cart.length === 0) { 
      cartItems.innerHTML = '<p>Your cart is empty.</p>'; 
      cartTotal.innerText = 'Total: $0'; 
      return; 
    }
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <span>${item.name} x${item.qty} - $${(item.price*item.qty).toFixed(2)}</span>
        <button class="remove-btn" data-name="${item.name}">Remove</button>
      `;
      cartItems.appendChild(div);
    });
    cartTotal.innerText = `Total: $${total.toFixed(2)}`;

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        cart = cart.filter(i => i.name !== name);
        renderCart();
      });
    });
  }
});
