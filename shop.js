// Display only. The server has the real prices and photo counts.
const SETS = {
  "edited-5":    { label: "5 edited photos", price: 20, count: 5 },
  "prints-6x4":  { label: "5 prints, 6x4",   price: 10, count: 5 },
  "prints-5x7":  { label: "5 prints, 5x7",   price: 15, count: 5 },
  "prints-8x10": { label: "5 prints, 8x10",  price: 25, count: 5 },
};

const setSel = document.getElementById("set");
const grid = document.getElementById("grid");
const status = document.getElementById("status");
const addBtn = document.getElementById("add");
let selected = [];

Object.entries(SETS).forEach(([id, s]) => setSel.add(new Option(`${s.label} - $${s.price}`, id)));

function update() {
  const s = SETS[setSel.value];
  status.textContent = `${selected.length} of ${s.count} photos selected`;
  addBtn.disabled = selected.length !== s.count;
  grid.querySelectorAll(".photo").forEach((b) => b.setAttribute("aria-pressed", String(selected.includes(b.dataset.path))));
}

function toggle(path) {
  const max = SETS[setSel.value].count;
  if (selected.includes(path)) selected = selected.filter((p) => p !== path);
  else if (selected.length < max) selected.push(path);
  update();
}

setSel.addEventListener("change", () => { selected = []; update(); });

addBtn.addEventListener("click", () => {
  const s = SETS[setSel.value];
  if (addSet(setSel.value, s.label, s.price, selected)) {
    selected = [];
    update();
    status.textContent = "Added to your cart. Choose another set or view your cart.";
  } else {
    status.textContent = "Your cart is full (10 sets). Check out first.";
  }
});

(async () => {
  let photos = [];
  try { photos = await (await fetch("photos.json")).json(); } catch {}
  photos.forEach((path) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "photo";
    b.dataset.path = path;
    b.setAttribute("aria-pressed", "false");
    const img = document.createElement("img");
    img.src = encodeURI(path);
    img.loading = "lazy";
    img.alt = path.split("/").pop().replace(/\.[^.]+$/, "").replace(/_/g, " ");
    b.appendChild(img);
    b.addEventListener("click", () => toggle(path));
    grid.appendChild(b);
  });
  update();
})();