// Mobile navigation menu
function toggleMenu() {
  const nav = document.getElementById("nav");

  if (nav) {
    nav.classList.toggle("show");
  }
}

// WhatsApp order buttons
document.addEventListener("DOMContentLoaded", function () {
  const orderButtons = document.querySelectorAll(".order-btn");

  const whatsappNumber = "919864152219";

  orderButtons.forEach(function (button) {
    const product = button.dataset.product;

    if (!product) return;

    // Product name and price from collection.html
    const match = product.match(/₹\s*([\d,]+)/);
    const originalPrice = match
      ? Number(match[1].replace(/,/g, ""))
      : 0;

    // Instagram follow discount: 5%
    const discount = originalPrice * 0.05;
    const finalPrice = originalPrice - discount;

    const message =
      "Hello Ribbon Bouquet by Muskan! 🎀\n\n" +
      "I want to order:\n" +
      "🌹 " + product + "\n\n" +
      "💰 Original Price: ₹" + originalPrice.toLocaleString("en-IN") + "\n" +
      "🎁 Instagram Follow Discount (5%): ₹" +
      discount.toLocaleString("en-IN", {
        maximumFractionDigits: 2
      }) + "\n" +
      "✅ Final Price: ₹" +
      finalPrice.toLocaleString("en-IN", {
        maximumFractionDigits: 2
      }) + "\n\n" +
      "I will follow your Instagram page @b_o_u_q_u_e_t_0 for the discount.\n\n" +
      "Please confirm colour options, discount eligibility and delivery charges across Assam. 🎀";

    button.href =
      "https://wa.me/" +
      whatsappNumber +
      "?text=" +
      encodeURIComponent(message);

    button.target = "_blank";
    button.rel = "noopener noreferrer";
  });
});
