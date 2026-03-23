// images and words for each slide
const slides = [
  {
    image: "images/calm1.jpg", // first background image
    count: "01", // first slide number
    words: ["Calm", "Quiet", "Soft", "Still", "Space", "Light", "Slow", "Air"] // words for slide 1
  },
  {
    image: "images/calm2.jpg", // second background image
    count: "02", // second slide number
    words: ["Silence", "Drift", "Pause", "Breath", "Distance", "Ease", "Float", "Hush"] // words for slide 2
  },
  {
    image: "images/calm3.jpg", // third background image
    count: "03", // third slide number
    words: ["Motion", "Glow", "Mist", "Gentle", "Fade", "Echo", "Weightless", "Blur"] // words for slide 3
  }
];

// get parts from the page
const bg = document.getElementById("bg"); // background image element
const count = document.getElementById("count"); // number text
const wordsBox = document.getElementById("words"); // box where words will be added

// keep track of which slide is showing now
let currentIndex = 0;

// prevents changing slides too quickly
let isAnimating = false;

// stores total scroll amount so scrolling feels smoother
let wheelTotal = 0;

// stores timer for resetting the scroll amount
let wheelTimer = null;

// helper function: makes a random decimal number
function random(min, max) {
  return Math.random() * (max - min) + min; // picks a number between min and max
}

// helper function: makes a random whole number
function randomInt(min, max) {
  return Math.floor(random(min, max + 1)); // rounds down a random decimal into an integer
}

// create one floating word
function createWord(wordText) {
  const word = document.createElement("span"); // create a new span element
  word.className = "word ghost"; // give it the word and ghost classes
  word.textContent = wordText; // set the visible text

  // set a random horizontal position
  word.style.left = random(12, 88) + "%";

  // set a random vertical position
  word.style.top = random(16, 82) + "%";

  // choose a random text size
  const size = random(1.2, 4.8);

  // apply that size using clamp so it still works better on different screens
  word.style.fontSize = `clamp(1rem, ${size}vw, 4.5rem)`;

  // give the animation a random left-right movement amount
  word.style.setProperty("--move-x", random(-40, 40) + "px");

  // give the animation a random up-down movement amount
  word.style.setProperty("--move-y", random(-28, 28) + "px");

  // give each word a random animation duration
  word.style.setProperty("--time", random(5, 10) + "s");

  // give each word a random delay so they do not all start together
  word.style.setProperty("--delay", random(0, 4) + "s");

  // give each word a random brightness
  word.style.setProperty("--opacity", random(0.3, 0.9));

  return word; // send the finished word back
}

// show words for one slide
function renderWords(index) {
  wordsBox.innerHTML = ""; // clear out old words first

  count.textContent = slides[index].count; // update the slide number

  const wordList = slides[index].words; // get the word list for this slide

  for (let i = 0; i < 18; i++) { // repeat 18 times to place many words
    const chosenWord = wordList[randomInt(0, wordList.length - 1)]; // pick a random word from the list
    const word = createWord(chosenWord); // create one word element
    wordsBox.appendChild(word); // place that word on the page
  }
}

// switch to another slide
function changeSlide(direction) {
  if (isAnimating) { // if a transition is already happening
    return; // stop here
  }

  isAnimating = true; // lock transitions for a moment

  // decide next slide number
  if (direction === "down") { // if user scrolls down
    currentIndex = currentIndex + 1; // go forward
    if (currentIndex >= slides.length) { // if index becomes too large
      currentIndex = 0; // go back to first slide
    }
  } else { // if user scrolls up
    currentIndex = currentIndex - 1; // go backward
    if (currentIndex < 0) { // if index becomes negative
      currentIndex = slides.length - 1; // go to the last slide
    }
  }

  // fade words and number a little before changing
  wordsBox.style.opacity = "0.2";
  count.style.opacity = "0.2";
  count.style.transform = "translateY(10px)";

  // change the background image
  bg.src = slides[currentIndex].image;

  // after a short delay, create the new words
  setTimeout(() => {
    renderWords(currentIndex);
  }, 120);

  // after another short delay, bring everything back clearly
  setTimeout(() => {
    wordsBox.style.opacity = "1";
    count.style.opacity = "1";
    count.style.transform = "translateY(0)";
    isAnimating = false; // unlock transitions again
  }, 450);
}

// listen for mouse wheel scrolling
window.addEventListener(
  "wheel",
  function (event) {
    event.preventDefault(); // stop the browser from normal scrolling

    if (isAnimating) { // if already changing slides
      return; // do nothing
    }

    wheelTotal = wheelTotal + event.deltaY; // add current wheel movement to total

    if (Math.abs(wheelTotal) > 140) { // only change when enough scrolling has happened
      if (wheelTotal > 0) { // positive means scrolling down
        changeSlide("down"); // go to next slide
      } else { // negative means scrolling up
        changeSlide("up"); // go to previous slide
      }
      wheelTotal = 0; // reset total after slide change
    }

    clearTimeout(wheelTimer); // clear old timer if user keeps scrolling

    wheelTimer = setTimeout(function () { // wait a little
      wheelTotal = 0; // then reset the scroll total
    }, 200);
  },
  { passive: false } // needed because preventDefault is used
);

// if image path is wrong, print an error in console
bg.addEventListener("error", function () {
  console.log("Image not found:", bg.src);
});

// show the first slide when page starts
renderWords(0);