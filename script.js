// Mobile navigation menu
function toggleMenu() {
const nav = document.getElementById("nav");

if (nav) {
nav.classList.toggle("show");
}
}

// WhatsApp order buttons on the collection page
document.addEventListener("DOMContentLoaded", function () {
const orderButtons = document.querySelectorAll(".order-btn");

orderButtons.forEach(function (button) {
const product = button.dataset.product;

if (product) {
  const message =
    "Hello Ribbon Bouquet by Muskan! 🎀\n\n" +
    "I want to order: " + product + "\n\n" +
    "Please confirm colour options and delivery charges.";

  button.href =
    "https://wa.me/919864152219?text=" +
    encodeURIComponent(message);

  button.target = "_blank";
  button.rel = "noopener";
}

});
});
