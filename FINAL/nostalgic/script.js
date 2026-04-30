// Find all photo windows on the page.
const cards = document.querySelectorAll(".photo-card");

// Find the shuffle button on the page.
const shuffleBtn = document.getElementById("shuffleBtn");

// This number controls which window appears on top.
let topLayer = 20;

// Go through every photo window one by one.
cards.forEach(function (card) {
  // Make each photo window draggable.
  makeDraggable(card);
});

// This function returns a random number between min and max.
function random(min, max) {
  // Math.random() gives a number between 0 and 1.
  // This line changes that number into the range we want.
  return Math.random() * (max - min) + min;
}

// This function moves the photo windows to random places.
function shuffleCards() {
  // Go through every photo window one by one.
  cards.forEach(function (card) {
    // Pick a random horizontal position using viewport width.
    const newLeft = random(5, 72);

    // Pick a random vertical position using viewport height.
    const newTop = random(18, 78);

    // Move the card horizontally.
    card.style.left = newLeft + "vw";

    // Move the card vertically.
    card.style.top = newTop + "vh";

    // Remove right positioning so it does not conflict with left.
    card.style.right = "auto";

    // Give the card a small random rotation.
    card.style.transform = "rotate(" + random(-4, 4) + "deg)";
  });
}

// When the shuffle button is clicked, run the shuffleCards function.
shuffleBtn.addEventListener("click", shuffleCards);

// This function makes one element draggable.
function makeDraggable(element) {
  // This remembers whether the user is dragging right now.
  let isDragging = false;

  // This stores the pointer's x position when dragging starts.
  let startX = 0;

  // This stores the pointer's y position when dragging starts.
  let startY = 0;

  // This stores the window's left position when dragging starts.
  let startLeft = 0;

  // This stores the window's top position when dragging starts.
  let startTop = 0;

  // This starts dragging when the user presses down on a photo window.
  element.addEventListener("pointerdown", function (event) {
    // If the user is using a mouse, only allow left click to drag.
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    // Stop default browser behavior, such as selecting text or dragging the image file.
    event.preventDefault();

    // Turn dragging on.
    isDragging = true;

    // Increase the top layer number.
    topLayer = topLayer + 1;

    // Add the dragging class so CSS can pause the floating animation.
    element.classList.add("dragging");

    // Put this window above the other windows.
    element.style.zIndex = topLayer;

    // Save the pointer's starting x position.
    startX = event.clientX;

    // Save the pointer's starting y position.
    startY = event.clientY;

    // Save the window's starting left position.
    startLeft = element.offsetLeft;

    // Save the window's starting top position.
    startTop = element.offsetTop;

    // Keep tracking this pointer even if the user moves quickly.
    element.setPointerCapture(event.pointerId);
  });

  // This moves the window while the pointer moves.
  element.addEventListener("pointermove", function (event) {
    // If dragging is not active, stop here.
    if (isDragging === false) {
      return;
    }

    // Find how far the pointer moved horizontally.
    const moveX = event.clientX - startX;

    // Find how far the pointer moved vertically.
    const moveY = event.clientY - startY;

    // Calculate the new left position.
    // There is no limit here, so the window can move freely.
    const newLeft = startLeft + moveX;

    // Calculate the new top position.
    // There is no limit here, so the window can move freely.
    const newTop = startTop + moveY;

    // Apply the new horizontal position.
    element.style.left = newLeft + "px";

    // Apply the new vertical position.
    element.style.top = newTop + "px";

    // Make sure right positioning does not conflict with left.
    element.style.right = "auto";
  });

  // This stops dragging when the user releases the pointer.
  element.addEventListener("pointerup", function (event) {
    // Turn dragging off.
    isDragging = false;

    // Remove the dragging class so the animation can continue.
    element.classList.remove("dragging");

    // Release the captured pointer.
    element.releasePointerCapture(event.pointerId);
  });

  // This also stops dragging if the browser cancels the pointer.
  element.addEventListener("pointercancel", function () {
    // Turn dragging off.
    isDragging = false;

    // Remove the dragging class.
    element.classList.remove("dragging");
  });
}