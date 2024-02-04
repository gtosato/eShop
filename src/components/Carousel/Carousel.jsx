import React, { useState } from "react";
import styles from "./Carousel.module.scss";

const Carousel = () => {
  const [position, setPosition] = useState(0);
  const slides = [
    "https://www.deadeyedarts.com/media/wysiwyg/red-dragon-2024-range.jpg",
    "https://www.deadeyedarts.com/media/wysiwyg/20231207-BARNEY25.jpg",
    "https://www.deadeyedarts.com/media/wysiwyg/20240201-target-d3031.jpg",
  ];

  const handleMoveToNextSlide = () => {
    setPosition((prevPosition) => (prevPosition + 1) % slides.length);
  };

  const handleMoveToPrevSlide = () => {
    setPosition(
      (prevPosition) => (prevPosition - 1 + slides.length) % slides.length
    );
  };

  return (
    <div className={styles.carousel}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${styles.carouselItem} ${
            index === position ? styles.carouselItemVisible : ""
          }`}
        >
          <img src={slide} alt={`Slide ${index + 1}`} />
        </div>
      ))}
      <div className={styles.carouselActions}>
        <button
          id="carouselButtonPrev"
          aria-label="Previous"
          onClick={handleMoveToPrevSlide}
        >
          &#60;
        </button>
        <button
          id="carouselButtonNext"
          aria-label="Next"
          onClick={handleMoveToNextSlide}
        >
          &#62;
        </button>
      </div>
      <div className={styles.carouselDots}>
        {slides.map((_, index) => (
          <input
            key={index}
            className={styles.dot}
            type="radio"
            name="dot"
            checked={index === position}
            readOnly // Add this line to make the field mutable
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
