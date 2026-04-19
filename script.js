let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedSize = null;
let selectedVariant = null;

let currentSlide = 0;   // ✅ ADD IT RIGHT HERE (TOP LEVEL)

/* LOAD */
document.addEventListener("DOMContentLoaded", () => {
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    updateCart();

    // 🔥 ADD THIS HERE
    const slider = document.querySelector(".product-slider");
    if (slider) slider.scrollLeft = 0;
});

/* SIZE */
function selectSize(el){
    selectedSize = el.innerText;

    document.querySelectorAll(".sizes span").forEach(s => {
        s.classList.remove("active");
    });

    el.classList.add("active");
}

/* VARIANT */
function selectVariant(el) {
    selectedVariant = el.innerText;

    document.querySelectorAll(".variants span").forEach(v => {
        v.classList.remove("active");
    });

    el.classList.add("active");
}
function selectQuickVariant(el) {
    document.querySelectorAll(".quick-popup .variants span")
        .forEach(v => v.classList.remove("active"));

    el.classList.add("active");
    quickVariant = el.innerText;
}
/* ADD FROM PRODUCT */
function addToCartFromProduct() {

    if (!selectedSize) {
        showPopup("sizePopup");
        return;
    }

    if (!selectedVariant) {
        showPopup("variantPopup");
        return;
    }

    const name = document.getElementById("productName").innerText;
    const price = parseInt(document.getElementById("productPrice").innerText.replace("₹", ""));
    const img = document.getElementById("img1").src;
    let existing = cart.find(i =>
        i.name === name &&
        i.size === selectedSize &&
        i.variant === selectedVariant
    );

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            name,
            price,
            img,
            size: selectedSize,
            variant: selectedVariant,
            qty: 1
        });
    }

    updateCart();
    showPopup("cartPopup");
}

/* ADD FROM SHOP */
function addToCartDirect(name, price, img) {

    // ❌ NO SIZE SELECTED
    if (!selectedSize) {
        showPopup("sizePopup");
        return;
    }

    let existing = cart.find(i =>
        i.name === name &&
        i.size === selectedSize
    );

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            name,
            price: Number(price),
            img,
            size: selectedSize,
            variant: "Regular",
            qty: 1
        });
    }

    updateCart();
    showPopup("cartPopup");
}

/* CART UI */
function updateCart() {
    let total = 0;
    let cartItemsDiv = document.getElementById("cartItems");

    if (!cartItemsDiv) return;

    cartItemsDiv.innerHTML = "";

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        let div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <img src="${item.img}" class="cart-img">

            <div class="cart-details">
                <h3>${item.name}</h3>
                <p class="cart-size">Size: ${item.size}</p>
                <p class="cart-size">Variant: ${item.variant}</p>
                <p class="cart-price">₹${item.price}</p>

                <div class="qty-controls">
                    <button onclick="changeQty(${index}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                </div>

                <button class="remove-btn" onclick="removeItem(${index})">
                    Remove
                </button>
            </div>
        `;

        cartItemsDiv.appendChild(div);
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    document.getElementById("total").innerText = total;
    document.getElementById("count").innerText = cart.length;
}

/* QTY */
function changeQty(index, change) {
    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}

/* REMOVE */
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

/* CART PANEL */
function toggleCart(){
    document.getElementById("cartPanel").classList.toggle("active");
}

function closeCart(){
    document.getElementById("cartPanel").classList.remove("active");
}

/* POPUP SYSTEM */
function showPopup(id) {
    // ❌ DO NOTHING on shop page
    if (!window.location.pathname.includes("product")) return;

    const popup = document.getElementById(id);
    if (!popup) return;

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 1500);
}

/* CHECKOUT */
function checkout(){
    alert("Order placed!");
    cart = [];
    updateCart();
}

function filterCategory(type, el){

    let items = document.querySelectorAll(".item");

    items.forEach(item => {
        if (type === "all" || item.dataset.category === type) {
            item.classList.remove("hidden");
        } else {
            item.classList.add("hidden");
        }
    });

    document.querySelectorAll(".cat").forEach(c => c.classList.remove("active"));
    el.classList.add("active");
}

let quickProduct = {};
let quickSize = null;
let quickVariant = null;

function openQuickAdd(name, price, img) {
    quickProduct = { name, price, img };

    document.getElementById("quickName").innerText = name;
    document.getElementById("quickPrice").innerText = "₹" + price;

    document.getElementById("quickAddPopup").style.display = "flex";
}

function closeQuickAdd() {
    document.getElementById("quickAddPopup").style.display = "none";

    quickSize = null;
    quickVariant = null;
}

function selectQuickSize(el) {
    document.querySelectorAll(".quick-popup .sizes span")
        .forEach(s => s.classList.remove("active"));

    el.classList.add("active");
    quickSize = el.innerText;
}

function confirmQuickAdd() {

    if (!quickSize) {
        showPopup("sizePopup");
        return;
    }

    if (!quickVariant) {
        showPopup("variantPopup");
        return;
    }

    addItemToCart({
        name: quickProduct.name,
        price: quickProduct.price,
        img: quickProduct.img,
        size: quickSize,
        variant: quickVariant,
        qty: 1
    });

    showPopup("cartPopup");

    // 🔥 ADD IT RIGHT HERE
    quickSize = null;
    quickVariant = null;

    document.querySelectorAll(".quick-popup span")
        .forEach(el => el.classList.remove("active"));

    closeQuickAdd();
}

    updateCart();
    showPopup("cartPopup");

    closeQuickAdd();
function goToProduct(name, price, img) {
    window.location.href = `product.html?name=${encodeURIComponent(name)}&price=${price}&img=${encodeURIComponent(img)}`;
}

function openSizeChart() {
    document.getElementById("sizeChartPopup").style.display = "flex";
}

function closeSizeChart() {
    document.getElementById("sizeChartPopup").style.display = "none";
}
function nextSlide() {
    const slider = document.querySelector(".product-slider");
    const slides = document.querySelectorAll(".product-slider img");

    if (currentSlide < slides.length - 1) {
        currentSlide++;
        slider.scrollLeft = slider.offsetWidth * currentSlide;
    }
}

function prevSlide() {
    const slider = document.querySelector(".product-slider");
    const slides = document.querySelectorAll(".product-slider img");

    if (currentSlide > 0) {
        currentSlide--;
        slider.scrollLeft = slider.offsetWidth * currentSlide;
    }
}