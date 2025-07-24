document.addEventListener('DOMContentLoaded', function () {
  // --- Horizontal scroll setup ---
  const container = document.querySelector('.horizontal-scroll-container');
  if (container) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse drag scrolling
    container.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 3;
      container.scrollLeft = scrollLeft - walk;
    });

    // Touch swipe scrolling (for mobile)
    let touchStartX = 0;
    let touchScrollLeft = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = container.scrollLeft;
    });

    container.addEventListener('touchmove', (e) => {
      const touchX = e.touches[0].pageX;
      const walk = (touchX - touchStartX) * 1.5;
      container.scrollLeft = touchScrollLeft - walk;
    });

    // Scroll wheel horizontal support (desktop)
    container.addEventListener(
      'wheel',
      (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      },
      { passive: false }
    );
  }

  // --- Move title outside of scroll container on mobile ---
  function moveTitleOnMobile() {
    const title = document.getElementById('scroll-title');
    const section = document.getElementById('scroll-section');
    const scrollContainer = document.getElementById('scroll-container');

    if (window.innerWidth <= 767) {
      if (title && section && title.parentElement !== section) {
        section.insertBefore(title, section.firstChild);
      }
    } else {
      if (title && scrollContainer && title.parentElement !== scrollContainer) {
        scrollContainer.insertBefore(title, scrollContainer.firstChild);
      }
    }
  }

  moveTitleOnMobile();
  window.addEventListener('resize', moveTitleOnMobile);

  // --- Contact message randomizer ---
  const messages = [
    "Interested in working together or have a question? Feel free to reach out with any inquiries, collaboration ideas, or booking requests — I’d love to hear from you.",
    "Whether you're ready to book a session, explore a creative collaboration, or simply want to connect — don't hesitate to get in touch. I look forward to hearing from you!",
    "Have a project in mind or a question to ask? Let’s connect. I’m always open to new ideas, collaborations, and creative conversations.",
  ];

  function randomizeMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const messageEl = document.getElementById("contact-message");
    if (messageEl) {
      messageEl.textContent = messages[randomIndex];
    } else {
      console.error("Element with ID 'contact-message' not found.");
    }
  }

  randomizeMessage();

  const messageEl = document.getElementById("contact-message");
  if (messageEl) {
    messageEl.addEventListener("click", randomizeMessage);
  }
});
