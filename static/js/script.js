/* ========================================
   WISHLIST
======================================== */

function toggleWishlist(button) {

    button.classList.toggle("active");

    if (button.classList.contains("active")) {
        button.innerHTML = "♥";
    } else {
        button.innerHTML = "♡";
    }
}


/* ========================================
   ADD TO CART
======================================== */

function addToCart(productName) {

    showToast(productName + " added to cart");

}


/* ========================================
   TOAST
======================================== */

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) {
        return;
    }

    const text = toast.querySelector("p");

    text.textContent = message;

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

    }, 2500);
}


/* ========================================
   QUICK VIEW
======================================== */

function showQuickView(name, price) {

    const modal = document.getElementById("quickViewModal");

    const productName = document.getElementById("quickProductName");

    const productPrice = document.getElementById("quickProductPrice");

    productName.textContent = name;

    productPrice.textContent = "₹" + price;

    modal.classList.add("show");

    document.body.style.overflow = "hidden";
}


/* ========================================
   CLOSE QUICK VIEW
======================================== */

function closeQuickView() {

    const modal = document.getElementById("quickViewModal");

    modal.classList.remove("show");

    document.body.style.overflow = "";
}


/* ========================================
   CLOSE MODAL WHEN CLICK OUTSIDE
======================================== */

document.addEventListener("click", function(event) {

    const modal = document.getElementById("quickViewModal");

    if (event.target === modal) {
        closeQuickView();
    }

});


/* ========================================
   ESC KEY
======================================== */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeQuickView();
    }

});


/* ========================================
   PAGE LOAD ANIMATION
======================================== */

document.addEventListener("DOMContentLoaded", function() {

    const cards = document.querySelectorAll(".product-card");

    cards.forEach(function(card, index) {

        card.style.animationDelay = (index * 0.08) + "s";

    });

});
/* ========================================
   PRODUCT DETAIL QUANTITY
======================================== */

function increaseQuantity(maxStock) {

    const quantity = document.getElementById("quantity");

    let current = parseInt(quantity.value);

    if (current < maxStock) {
        quantity.value = current + 1;
    }

}


function decreaseQuantity() {

    const quantity = document.getElementById("quantity");

    let current = parseInt(quantity.value);

    if (current > 1) {
        quantity.value = current - 1;
    }

}


/* ========================================
   DETAIL WISHLIST
======================================== */

function toggleDetailWishlist(button) {

    button.classList.toggle("active");

    if (button.classList.contains("active")) {

        button.innerHTML = "♥";

    } else {

        button.innerHTML = "♡";

    }

}


/* ========================================
   DETAIL CART
======================================== */

function addDetailToCart(productName) {

    const quantity =
        document.getElementById("quantity").value;

    showDetailToast(
        productName + " × " + quantity + " added to cart"
    );

}


/* ========================================
   BUY NOW
======================================== */

function buyNow(productName) {

    const quantity =
        document.getElementById("quantity").value;

    showDetailToast(
        "Ready to buy " + productName + " × " + quantity
    );

}


/* ========================================
   DETAIL TOAST
======================================== */

function showDetailToast(message) {

    const toast =
        document.getElementById("detailToast");

    if (!toast) {
        return;
    }

    const text =
        toast.querySelector("p");

    text.textContent = message;

    toast.classList.add("show");

    setTimeout(function() {

        toast.classList.remove("show");

    }, 2500);

}