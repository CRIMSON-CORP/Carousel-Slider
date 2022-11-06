// NOTE
// I would have done the normal approach with setting a slide index
// and and setting the image to be displayed based on the slide index
// i just wanted it to be animated

//the major issue with my approach is that, it requires more lines of code
// and a lot of time to learn
// and user cannot scroll back to the first slide only
// if they went to the last slide from the first slide
// (i.e, pressing previous when on the first slide)

// grabs the wrapper div
const wrapper = document.querySelector(".wrapper");
// grabs the two caret for slide control
const carets = wrapper.querySelectorAll("button");
// grabs all the slides availbale
const slides = wrapper.querySelectorAll(".wrapper .carousel img");
// grabs the container for the slide
const slider = wrapper.querySelector(".slider");

// duplicate slide will be needed for the loop effect
const DUPLICATE_SLIDE = slides[0];
// this could be any of the slide, just needed one of the slides
// as all slides behave the exact same way
const FIRST_INDEX_SLIDE = slides[1];
// width of each slide
const SLIDE_WIDTH = FIRST_INDEX_SLIDE.clientWidth;
// width of the container containing all the slides
const SLIDER_WIDTH = slider.clientWidth;
// combined width of all the slides
const ALL_SLIDE_WIDTH = SLIDE_WIDTH * slides.length;
// width of the part container that can be scrolled
// that is width of all the slides, minus the width of the container, minus
// the width of one slide, as at least one slide is visible at a time
const SCROLLABLE_WIDTH = ALL_SLIDE_WIDTH - SLIDER_WIDTH - SLIDE_WIDTH;
// just getting the transform property value that was set in css
const DEFAULT_TRANSITION = window.getComputedStyle(slides[0]).transition;

// major variable used to track the progress of the slid
// this is always less than zero as slide slides towards negative X for next
//and positive x for prev
let slideProgress = -SLIDE_WIDTH;
// need to stop user for pressing next or previous while slide is moving
let isTransitioning = false;

// this could be for any slide as they all behave the same way
//when transition starts, set transitioning to true and vice versa
FIRST_INDEX_SLIDE.ontransitionstart = () => {
  isTransitioning = true;
};
FIRST_INDEX_SLIDE.ontransitionend = () => {
  isTransitioning = false;
};

// this updated the slide based on the slide progress
updateSlides(false);

// for each of the buttons, I'm adding a click event, there are only two of those though
carets.forEach((caret) => {
  caret.onclick = (e) => {
    // i dont want any action carried out if the slide is still moving
    if (isTransitioning) return;

    // if prev button is pressed and there are slides to scoll to behind, slidePrev..
    if (e.target.id === "prev" && slideProgress <= 0) {
      slidePrev();
      // if next button is pressed and there are slides to scoll to in front, slideNext..
    } else if (e.target.id === "next" && slideProgress >= -SCROLLABLE_WIDTH) {
      slideNext();
      // else do nothing
    } else return;
  };
});

// slidePrev, increase the slideProgress, slide moves towards the right and update the slides based on
// the new slide progress value
function slidePrev() {
  slideProgress += SLIDE_WIDTH;
  updateSlides(true);
}

// slideNext, decrease the slideProgress, slide moves towards the left and update the slides based on
// the new slide progress value
function slideNext() {
  slideProgress -= SLIDE_WIDTH;
  updateSlides(true);
}

function arrangeSlides() {
  // if slide progress === the scrollable width minus a slide width
  // that is if the slide has reached the end, update the slide
  // remove the transition and jump back to start
  if (slideProgress === -SCROLLABLE_WIDTH - SLIDE_WIDTH) {
    slideProgress = 0;
    updateSlides(false);
    //other way around if slideProgress is at the beginning
    //just to the end of the slide
  } else if (slideProgress === 0) {
    slideProgress = -SCROLLABLE_WIDTH - SLIDE_WIDTH;
    updateSlides(false);
  }
}

// this is called everytime a slide transition ends
DUPLICATE_SLIDE.addEventListener("transitionend", arrangeSlides);

function updateSlides(transition) {
  slides.forEach((slide) => {
    // for each of the slide, set transition based on wether transition is allowed or not
    slide.style.transition = transition ? DEFAULT_TRANSITION : "none";
    // update the slide transition position based on the value of the slide progress
    slide.style.transform = `translate(${slideProgress}px)`;
  });
}
