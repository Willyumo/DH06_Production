const CART_KEY = "cart";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}
function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
}
function addToCart(id, label, price, qty) {
  const cart = getCart();
  const line = cart.find(i => i.id === id);
  if (line) line.qty = Math.min(10, line.qty + qty);
  else cart.push({ id, label, price, qty });   // price is for display only
  saveCart(cart);
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart");
  if (!btn) return;
  const sel = document.getElementById(btn.dataset.select);
  const opt = sel.options[sel.selectedIndex];
  const qty = Math.max(1, Math.min(10, parseInt(document.getElementById(btn.dataset.qty).value, 10) || 1));
  addToCart(opt.value, opt.dataset.label, Number(opt.dataset.price), qty);
  btn.textContent = "Added ✓";
  setTimeout(() => (btn.textContent = "Add to cart"), 1500);
});

// Used by cart.html
function renderCart() {
  const list = document.getElementById("cart-items");
  if (!list) return;
  const cart = getCart();
  list.textContent = "";
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const row = document.createElement("li");
    row.textContent = `${item.label} × ${item.qty} — $${(item.price * item.qty).toFixed(2)} `;
    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.onclick = () => { cart.splice(idx, 1); saveCart(cart); renderCart(); };
    row.appendChild(remove);
    list.appendChild(row);
  });
  document.getElementById("cart-total").textContent = `Estimated total: $${total.toFixed(2)}`;
  document.getElementById("go-checkout").disabled = cart.length === 0;
}
document.addEventListener("DOMContentLoaded", renderCart);