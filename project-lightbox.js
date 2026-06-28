const lightbox = document.querySelector("#project-lightbox");
const lightboxImage = document.querySelector("#project-lightbox-image");
const lightboxVideo = document.querySelector("#project-lightbox-video");
const lightboxTitle = document.querySelector("#project-lightbox-title");
const lightboxDescription = document.querySelector(
  "#project-lightbox-description"
);

const lightboxCounter = document.querySelector(
  "#project-lightbox-counter"
);

const lightboxDots = document.querySelector(
  "#project-lightbox-dots"
);

const closeButton = document.querySelector(
  ".project-lightbox-close"
);

const previousButton = document.querySelector(
  ".project-lightbox-arrow-left"
);

const nextButton = document.querySelector(
  ".project-lightbox-arrow-right"
);

const processItems = document.querySelectorAll(
  ".project-process-item"
);


let currentImages = [];
let currentImageIndex = 0;
let currentTitle = "";


/* DISPLAY CURRENT SLIDE */

function displayCurrentImage() {
  if (currentImages.length === 0) {
    return;
  }

  const currentImage = currentImages[currentImageIndex];

const currentFile = currentImages[currentImageIndex].trim();
const isVideo = currentFile.endsWith(".mp4") || currentFile.endsWith(".webm");

lightboxImage.classList.add("is-hidden");
lightboxVideo.classList.add("is-hidden");
lightboxVideo.classList.remove("is-visible");

lightboxVideo.pause();
lightboxVideo.removeAttribute("src");
lightboxVideo.load();

if (isVideo) {
  lightboxVideo.src = currentFile;
  lightboxVideo.classList.remove("is-hidden");
  lightboxVideo.classList.add("is-visible");
  lightboxVideo.load();
} else {
  lightboxImage.src = currentFile;
  lightboxImage.classList.remove("is-hidden");
}


  lightboxCounter.textContent =
    `${currentImageIndex + 1} / ${currentImages.length}`;

  updateDots();
  updateArrowVisibility();
}


/* CREATE SLIDE DOTS */

function createDots() {
  lightboxDots.innerHTML = "";

  currentImages.forEach((image, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.className = "project-lightbox-dot";
    dot.setAttribute(
      "aria-label",
      `View image ${index + 1}`
    );

    dot.addEventListener("click", () => {
      currentImageIndex = index;
      displayCurrentImage();
    });

    lightboxDots.appendChild(dot);
  });
}


/* UPDATE ACTIVE DOT */

function updateDots() {
  const dots = lightboxDots.querySelectorAll(
    ".project-lightbox-dot"
  );

  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "active",
      index === currentImageIndex
    );
  });
}


/* HIDE ARROWS IF THERE IS ONLY ONE IMAGE */

function updateArrowVisibility() {
  const hasMultipleImages = currentImages.length > 1;

  previousButton.hidden = !hasMultipleImages;
  nextButton.hidden = !hasMultipleImages;
}


/* PREVIOUS SLIDE */

function showPreviousImage() {
  currentImageIndex =
    (currentImageIndex - 1 + currentImages.length) %
    currentImages.length;

  displayCurrentImage();
}


/* NEXT SLIDE */

function showNextImage() {
  currentImageIndex =
    (currentImageIndex + 1) %
    currentImages.length;

  displayCurrentImage();
}


/* OPEN LIGHTBOX */

processItems.forEach((item) => {
  item.addEventListener("click", () => {
    const imageList = item.dataset.lightboxImages;

    if (!imageList) {
      console.error(
        "No data-lightbox-images attribute found."
      );
      return;
    }

    currentImages = imageList
      .split("|")
      .map((image) => image.trim())
      .filter((image) => image.length > 0);

    if (currentImages.length === 0) {
      console.error(
        "No valid lightbox images were provided."
      );
      return;
    }

    currentImageIndex = 0;
    currentTitle =
      item.dataset.lightboxTitle || "Project process";

    lightboxTitle.textContent = currentTitle;

    lightboxDescription.textContent =
      item.dataset.lightboxDescription || "";

    createDots();
    displayCurrentImage();

    lightbox.showModal();
    document.body.classList.add("lightbox-open");
  });
});


/* CLOSE LIGHTBOX */

function closeLightbox() {
  lightbox.close();

  document.body.classList.remove("lightbox-open");

  lightboxImage.src = "";
  lightboxImage.alt = "";

  currentImages = [];
  currentImageIndex = 0;

  lightboxDots.innerHTML = "";
}


closeButton.addEventListener("click", closeLightbox);

previousButton.addEventListener(
  "click",
  showPreviousImage
);

nextButton.addEventListener(
  "click",
  showNextImage
);


/* CLICK OUTSIDE TO CLOSE */

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});


/* ESCAPE KEY */

lightbox.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLightbox();
});


/* KEYBOARD ARROWS */

document.addEventListener("keydown", (event) => {
  if (!lightbox.open) {
    return;
  }

  if (event.key === "ArrowLeft") {
    showPreviousImage();
  }

  if (event.key === "ArrowRight") {
    showNextImage();
  }
});