document.addEventListener('DOMContentLoaded',()=>{

  // Create cart HTML dynamically
  const cartHTML = `
    <div class="cart-button" id="cartBtn">
      <svg viewBox="0 0 24 24">
        <path d="M7 4h-2l-3 7v2h2l3-7h13v2h-12.6l-.7 2h13.3v2h-14l-.7 2h14.7v2h-16.6l1.3-4h-2l-1.3 4h-2v2h3.6c-.3.6-.6 1.3-.6 2 0 2.2 1.8 4 4 4s4-1.8 4-4c0-.7-.2-1.4-.6-2h5.2c-.4.6-.6 1.3-.6 2 0 2.2 1.8 4 4 4s4-1.8 4-4c0-.7-.2-1.4-.6-2h1.6v-2h-16.6l.7-2h14.7v-2h-13.3l.7-2h12.6v-2h-13zm0 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm10 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
      </svg>
    </div>
    <div class="cart-panel" id="cartPanel">
      <div class="cart-header">
        <span>Your Cart</span>
        <button class="close-cart" id="closeCart">←</button>
      </div>
      <div class="cart-items" id="cartItems"><p>Your cart is empty.</p></div>
      <div class="cart-footer">
        <span id="cartTotal">Total: $0</span>
        <button class="checkout-btn" id="goCheckout">Checkout</button>
      </div>
    </div>
    <div class="checkout-page" id="checkoutPage">
      <div class="checkout-box">
        <h2>Checkout</h2>
        <form id="checkoutForm">
          <label>Name</label><input id="name" required><span class="error-msg" id="nameError">Enter full name</span>
          <label>Email</label><input id="email" type="email" required><span class="error-msg" id="emailError">Enter valid email</span>
          <label>Card</label><input id="card" maxlength="16" required><span class="error-msg" id="cardError">Enter 16-digit card</span>
          <label>CVV</label><input id="cvv" maxlength="3" required><span class="error-msg" id="cvvError">Enter CVV</span>
          <button type="submit">Pay</button>
          <button type="button" class="back-btn" id="backBtn">Back</button>
        </form>
      </div>
    </div>
    <div class="success-page" id="successPage"><p>Payment Successful!</p></div>
  `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);

  const cartBtn = document.getElementById('cartBtn');
  const cartPanel = document.getElementById('cartPanel');
  const closeCart = document.getElementById('closeCart');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const goCheckout = document.getElementById('goCheckout');
  const checkoutPage = document.getElementById('checkoutPage');
  const backBtn = document.getElementById('backBtn');
  const successPage = document.getElementById('successPage');
  const checkoutForm = document.getElementById('checkoutForm');

  let cart=[];

  setTimeout(()=>cartBtn.classList.add('show'),300);

  cartBtn.addEventListener('click',()=>cartPanel.classList.toggle('open'));
  closeCart.addEventListener('click',()=>cartPanel.classList.remove('open'));

  document.querySelectorAll('.plan-card .btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const plan=btn.parentElement.querySelector('h3').innerText;
      const price=parseFloat(btn.parentElement.querySelector('p strong').innerText.replace('$','').replace(' / month',''));
      const existing=cart.find(i=>i.name===plan);
      if(existing) existing.qty++;
      else cart.push({name:plan,price:price,qty:1});
      updateCart();
      cartPanel.classList.add('open');
    });
  });

  function updateCart(){
    cartItems.innerHTML='';
    if(cart.length===0){ cartItems.innerHTML='<p>Your cart is empty.</p>'; cartTotal.innerText='Total: $0'; return;}
    let total=0;
    cart.forEach(item=>{
      total+=item.price*item.qty;
      const div=document.createElement('div');
      div.style.marginBottom='10px';
      div.innerHTML=`<strong>${item.name}</strong> x${item.qty} - $${(item.price*item.qty).toFixed(2)} <button style="float:right;" onclick="removeItem('${item.name}')">Remove</button>`;
      cartItems.appendChild(div);
    });
    cartTotal.innerText=`Total: $${total.toFixed(2)}`;
  }
  window.removeItem=function(name){ cart=cart.filter(i=>i.name!==name); updateCart(); }

  goCheckout.addEventListener('click',()=>{cartPanel.classList.remove('open'); checkoutPage.classList.add('active');});
  backBtn.addEventListener('click',()=>checkoutPage.classList.remove('active'));

  checkoutForm.addEventListener('submit',e=>{
    e.preventDefault();
    let valid=true;
    document.querySelectorAll('.error-msg').forEach(em=>em.style.display='none');
    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const card=document.getElementById('card').value;
    const cvv=document.getElementById('cvv').value;
    if(!name.includes(' ')){document.getElementById('nameError').style.display='block'; valid=false;}
    if(!email.includes('@')){document.getElementById('emailError').style.display='block'; valid=false;}
    if(card.length!==16 || isNaN(card)){document.getElementById('cardError').style.display='block'; valid=false;}
    if(cvv.length!==3 || isNaN(cvv)){document.getElementById('cvvError').style.display='block'; valid=false;}
    if(!valid) return;
    checkoutPage.classList.remove('active');
    successPage.style.display='flex';
    cart=[];
    updateCart();
    setTimeout(()=>{successPage.style.display='none';},2500);
  });
});
