/* ==========================================
   RIBBON BOUQUET BY MUSKAN
   Shared Order Form + WhatsApp
========================================== */

const WHATSAPP_NUMBER = "919864152219";
const INSTAGRAM_USERNAME = "@b_o_u_q_u_e_t_0";


// ------------------------------------------
// MOBILE NAVIGATION
// ------------------------------------------

function toggleMenu() {
  const nav = document.getElementById("nav")
    || document.getElementById("navLinks");

  const button = document.querySelector(".menu-btn")
    || document.querySelector(".menu-toggle");

  if (!nav) return;

  nav.classList.toggle("show");

  if (button) {
    button.setAttribute(
      "aria-expanded",
      nav.classList.contains("show") ? "true" : "false"
    );
  }
}


// ------------------------------------------
// ORDER FORM
// ------------------------------------------

document.addEventListener("DOMContentLoaded", function () {

  // Create the form automatically.
  // No separate form HTML is required.

  const modalHTML = `
    <div id="orderModal" class="order-modal"
         role="dialog"
         aria-modal="true"
         aria-labelledby="orderHeading">

      <div class="order-box">

        <button type="button"
                id="closeOrder"
                class="close-btn"
                aria-label="Close order form">
          &times;
        </button>

        <div class="popup-icon">🎀</div>

        <h2 id="orderHeading">Place Your Order</h2>

        <p id="selectedProduct"></p>

        <form id="orderForm">

          <label for="customerName">Your Name *</label>

          <input
            id="customerName"
            name="customerName"
            type="text"
            required
            maxlength="100"
            autocomplete="name"
            placeholder="Enter your full name">

          <label for="customerPhone">Mobile Number *</label>

          <input
            id="customerPhone"
            name="customerPhone"
            type="tel"
            required
            inputmode="numeric"
            pattern="[0-9]{10}"
            maxlength="10"
            autocomplete="tel"
            placeholder="10-digit mobile number">

          <label for="customerAddress">Full Address *</label>

          <textarea
            id="customerAddress"
            name="customerAddress"
            required
            maxlength="500"
            autocomplete="street-address"
            placeholder="House, village, town, district"></textarea>

          <label for="customerPin">PIN Code *</label>

          <input
            id="customerPin"
            name="customerPin"
            type="text"
            required
            inputmode="numeric"
            pattern="[0-9]{6}"
            maxlength="6"
            autocomplete="postal-code"
            placeholder="6-digit PIN code">

          <label for="bouquetColor">Preferred Bouquet Colour *</label>

          <input
            id="bouquetColor"
            name="bouquetColor"
            type="text"
            required
            maxlength="100"
            placeholder="Red, pink, white...">

          <label for="quantity">Quantity *</label>

          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            max="20"
            step="1"
            value="1"
            required>

          <label class="discount-check" for="instagramFollow">

            <input
              type="checkbox"
              id="instagramFollow"
              name="instagramFollow">

            <span>
              I follow your Instagram and want to request
              the 5% discount.
            </span>

          </label>

          <div id="priceSummary" class="price-summary"></div>

          <button type="submit" class="btn submit-order">
            Submit Order Details ❤️
          </button>

          <p class="order-notice">
            Your details will be prepared for WhatsApp.
            This website does not save your order to a server.
          </p>

        </form>
      </div>
    </div>

    <div id="thankYouModal"
         class="order-modal"
         role="dialog"
         aria-modal="true"
         aria-labelledby="thankHeading">

      <div class="order-box thank-box">

        <div class="success-animation" aria-hidden="true">
          <span>🎀</span>
          <span>💖</span>
          <span>🌹</span>
        </div>

        <div class="success-circle" aria-hidden="true">✓</div>

        <h2 id="thankHeading">Thank You!</h2>

        <p class="thank-subtitle">
          Ribbon Bouquet by Muskan
        </p>

        <p class="thank-message">
          Your order details are ready!
          Continue to WhatsApp to confirm the price,
          availability and delivery charges.
        </p>

        <a id="sendWhatsApp"
           class="btn whatsapp-order"
           href="#"
           target="_blank"
           rel="noopener noreferrer">
          💬 Continue to WhatsApp
        </a>

        <button type="button"
                id="finishOrder"
                class="btn btn-light btn-full-light">
          Close
        </button>

        <p class="order-notice">
          Your order is not confirmed until the seller
          replies and confirms it on WhatsApp.
        </p>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);


  // ----------------------------------------
  // ELEMENTS
  // ----------------------------------------

  const orderModal = document.getElementById("orderModal");
  const thankYouModal = document.getElementById("thankYouModal");
  const orderForm = document.getElementById("orderForm");

  const selectedProduct = document.getElementById("selectedProduct");
  const priceSummary = document.getElementById("priceSummary");
  const sendWhatsApp = document.getElementById("sendWhatsApp");

  const quantityInput = document.getElementById("quantity");
  const discountCheckbox = document.getElementById("instagramFollow");

  let productName = "";
  let unitPrice = null;
  let lastFocusedElement = null;


  // ----------------------------------------
  // HELPERS
  // ----------------------------------------

  function money(value) {
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  function openModal(modal) {
    orderModal.classList.remove("is-open");
    thankYouModal.classList.remove("is-open");

    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
  }

  function closePopups() {
    orderModal.classList.remove("is-open");
    thankYouModal.classList.remove("is-open");

    document.body.classList.remove("modal-open");

    if (lastFocusedElement &&
        typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }


  // ----------------------------------------
  // PRICE CALCULATION
  // ----------------------------------------

  function getPrices() {
    const quantity = Number(quantityInput.value);

    // Unknown Gallery prices must never be treated as zero-price orders.
    if (unitPrice === null) {
      return {
        quantity: quantity,
        subtotal: null,
        discount: null,
        total: null
      };
    }

    const subtotal = unitPrice * quantity;

    const discount = discountCheckbox.checked
      ? subtotal * 0.05
      : 0;

    const total = subtotal - discount;

    return {
      quantity: quantity,
      subtotal: subtotal,
      discount: discount,
      total: total
    };
  }


  function updatePrice() {
    let quantity = Number(quantityInput.value);

    if (!Number.isFinite(quantity) || quantity < 1) {
      quantity = 1;
    }

    if (quantity > 20) {
      quantity = 20;
    }

    quantityInput.value = quantity;

    const prices = getPrices();

    if (unitPrice === null) {
      priceSummary.innerHTML =
        "<strong>Price: To be confirmed</strong>" +
        "<br>Quantity: " + prices.quantity +
        "<br>Discount: To be confirmed" +
        "<br><small>The seller will confirm the bouquet price on WhatsApp.</small>";

      return;
    }

    priceSummary.innerHTML =
      "Price per bouquet: ₹" + money(unitPrice) +
      "<br>Quantity: " + prices.quantity +
      "<br>Subtotal: ₹" + money(prices.subtotal) +
      "<br>Requested 5% discount: ₹" + money(prices.discount) +
      "<br><strong>Total before delivery: ₹" +
      money(prices.total) + "</strong>" +
      "<br><small>Delivery charges are extra, if applicable. Discount eligibility must be confirmed.</small>";
  }


  // ----------------------------------------
  // OPEN FORM FROM COLLECTION AND GALLERY
  // ----------------------------------------

  document.querySelectorAll(
    ".order-btn, .btn-whatsapp-card"
  ).forEach(function (button) {

    button.addEventListener("click", function (event) {

      event.preventDefault();

      lastFocusedElement = button;

      // Collection uses data-product.
      // Gallery uses data-bouquet.

      const collectionProduct = button.dataset.product || "";
      const galleryBouquet = button.dataset.bouquet || "";

      const isGalleryProduct = Boolean(galleryBouquet);

      if (isGalleryProduct) {

        productName = galleryBouquet;
        unitPrice = null;

      } else {

        const match = collectionProduct.match(/₹\s*([\d,]+)/);

        if (!match) {
          alert("Product price is unavailable. Please contact us on WhatsApp.");
          return;
        }

        unitPrice = Number(match[1].replace(/,/g, ""));

        productName = collectionProduct.replace(
          /\s*-\s*₹[\d,]+/,
          ""
        );
      }

      selectedProduct.textContent =
        productName +
        (unitPrice === null
          ? " — Price on Request"
          : " — ₹" + money(unitPrice));

      orderForm.reset();

      quantityInput.value = 1;

      updatePrice();

      openModal(orderModal);

      document.getElementById("customerName").focus();
    });

  });


  // ----------------------------------------
  // LIVE TOTAL UPDATE
  // ----------------------------------------

  quantityInput.addEventListener("input", updatePrice);

  discountCheckbox.addEventListener("change", updatePrice);


  // ----------------------------------------
  // CLOSE BUTTONS
  // ----------------------------------------

  document.getElementById("closeOrder")
    .addEventListener("click", closePopups);

  document.getElementById("finishOrder")
    .addEventListener("click", closePopups);


  [orderModal, thankYouModal].forEach(function (modal) {

    modal.addEventListener("click", function (event) {

      if (event.target === modal) {
        closePopups();
      }

    });

  });


  document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
      closePopups();
    }

  });


  // ----------------------------------------
  // SUBMIT ORDER DETAILS
  // ----------------------------------------

  orderForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!orderForm.reportValidity()) {
      return;
    }

    const name = document
      .getElementById("customerName")
      .value.trim();

    const phone = document
      .getElementById("customerPhone")
      .value.trim();

    const address = document
      .getElementById("customerAddress")
      .value.trim();

    const pin = document
      .getElementById("customerPin")
      .value.trim();

    const color = document
      .getElementById("bouquetColor")
      .value.trim();

    const prices = getPrices();

    const wantsDiscount = discountCheckbox.checked;


    // Extra validation

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^[0-9]{6}$/.test(pin)) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    if (!Number.isInteger(prices.quantity) ||
        prices.quantity < 1 ||
        prices.quantity > 20) {
      alert("Quantity must be between 1 and 20.");
      return;
    }


    // Price information

    let priceMessage = "";

    if (unitPrice === null) {

      priceMessage =
        "Price per bouquet: To be confirmed\n" +
        "Quantity: " + prices.quantity + "\n" +
        "Total: To be confirmed by seller\n";

    } else {

      priceMessage =
        "Price per bouquet: ₹" + money(unitPrice) + "\n" +
        "Quantity: " + prices.quantity + "\n" +
        "Subtotal: ₹" + money(prices.subtotal) + "\n" +
        "Instagram 5% discount requested: " +
        (wantsDiscount ? "Yes — please verify follow" : "No") + "\n" +
        "Discount amount: ₹" + money(prices.discount) + "\n" +
        "Total before delivery: ₹" + money(prices.total) + "\n";
    }


    // Build WhatsApp message

    const message =
      "Hello Ribbon Bouquet by Muskan! 🎀\n\n" +

      "NEW BOUQUET ORDER\n\n" +

      "Customer Name: " + name + "\n" +
      "Mobile Number: " + phone + "\n" +
      "Address: " + address + "\n" +
      "PIN Code: " + pin + "\n\n" +

      "Bouquet: " + productName + "\n" +
      "Preferred Colour: " + color + "\n" +

      priceMessage + "\n" +

      "Instagram: " + INSTAGRAM_USERNAME + "\n" +
      "5% discount requested: " +
      (wantsDiscount ? "Yes" : "No") + "\n\n" +

      "Please confirm the final price, colour availability " +
      "and delivery charges. Thank you! 💗";


    // Prepare WhatsApp link

    sendWhatsApp.href =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);


    // Show thank-you popup

    openModal(thankYouModal);

  });

});
