  // core version + navigation, pagination modules:
  import Swiper, {
    Navigation,
    Pagination,
    HashNavigation,
    EffectFade
  } from 'swiper';

  // Validation function
  const toggleInputValidation = (input, isValid) => {
    input.classList.toggle('valid', isValid);
    input.classList.toggle('invalid', !isValid);
  };

  const toggleNavClass = (link, isValid) => {
    link.classList.toggle("questions__link--success", isValid);
    link.classList.toggle("questions__link--error", !isValid);
  }

  const isValidInput = input => {
    if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
      return input.checkValidity() && (!input.hasAttribute('minlength') || input.value.length >= input.minLength);
    }
    return input.checked;
  };

  const handleLastSlideSubmit = (swiper, isValid) => {
    const next = swiper.navigation.nextEl;
    const submit = next?.nextElementSibling;

    if (swiper.activeIndex === swiper.slides.length - 1 && isValid) {
      next.classList.add("questions__button--hidden");
      submit.classList.remove("questions__button--hidden");
    } else {
      next?.classList.remove("questions__button--hidden");
      submit?.classList.add("questions__button--hidden");
    }
  };

  const handleNavigationState = (swiper) => {
    const links = document.querySelectorAll(".questions__link");
    const currentIndex = swiper.activeIndex;
    const activeSlide = swiper.slides[swiper.activeIndex];
    const inputs = activeSlide?.querySelectorAll("input:not([type='file']), textarea, select, .file");

    let isValid = true;

    inputs?.forEach((input) => {
      if (input.tagName === "SELECT") {
        if (!input.selectedIndex === "") {
          isValid = false;
        }
      } else if (input.type === "checkbox" || input.type === "radio") {
        if (!input.checked) {
          isValid = false;
        }
      } else if (!input.value) {
        isValid = false;
      }
    });


    links.forEach((link, index) => {
      if (index === currentIndex) {
        link.classList.add("questions__link--current");
        toggleNavClass(link, isValid);
      } else {
        link.classList.remove("questions__link--current");
      }
    });

    inputs?.forEach((input) => {
      input.addEventListener("input", (event) => {
        let isValid = true;
        inputs.forEach((input) => {
          if (input.tagName === "SELECT") {
            if (!input.selectedIndex === "") {
              isValid = false;
            }
          } else if (input.type === "checkbox" || input.type === "radio") {
            if (!input.checked) {
              isValid = false;
            }
          } else if (!input.value) {
            isValid = false;
          }
        });
        links.forEach((link, index) => {
          if (index === currentIndex) {
            link.classList.add("questions__link--current");
            toggleNavClass(link, isValid);
          } else {
            link.classList.remove("questions__link--current");
          }
        });
      });
    });
  };

  function validateActiveSlideInputs() {
    const activeSlide = this.slides[this.activeIndex];
    const inputs = activeSlide?.querySelectorAll('[required]');
    let isValid = true;

    inputs?.forEach(input => {
      const inputIsValid = isValidInput(input);
      if (!inputIsValid) {
        isValid = false;
      }
      toggleInputValidation(input, inputIsValid);
    });
    this.navigation.nextEl?.toggleAttribute('disabled', !isValid);

    handleLastSlideSubmit(this, isValid);
    handleNavigationState(this);
  }

  // init Swiper:
  const swiper = new Swiper('.swiper', {
    modules: [Navigation, Pagination, HashNavigation, EffectFade],
    slidesPerView: 'auto',
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
    pagination: '.swiper-pagination',
    navigation: {
      nextEl: '.questions__button--next',
      prevEl: '.questions__button--prev',
      disabledClass:'questions__button--disabled',
    },
    paginationClickable: true,
    allowTouchMove: false,
    hashNavigation: {
      watchState: true,
    },
    on: {
      slideChangeTransitionStart: function () {
        validateActiveSlideInputs.call(this);
      }
    }
  });

  // Add event listeners to each input element to handle real-time validation
  const inputs = document.querySelectorAll('.swiper-slide [required]');
  inputs.forEach(input => input.addEventListener('input', validateActiveSlideInputs.bind(swiper)));

  validateActiveSlideInputs.call(swiper);
