document.addEventListener('DOMContentLoaded', function () {
  // Optional: Horizontal scroll setup for any .horizontal-scroll-container
  const container = document.querySelector('.horizontal-scroll-container');
  if (container) {
    let isDown = false;
    let startX;
    let scrollLeft;

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
      const walk = (x - startX) * 3; // Adjust scrolling speed
      container.scrollLeft = scrollLeft - walk;
    });
  }

  // Message rotation for contact page
  const messages = [
    "Interested in working together or have a question? Feel free to reach out with any inquiries, collaboration ideas, or booking requests — I’d love to hear from you.",
    "Whether you're ready to book a session, explore a creative collaboration, or simply want to connect — don't hesitate to get in touch. I look forward to hearing from you!",
    "Have a project in mind or a question to ask? Let’s connect. I’m always open to new ideas, collaborations, and creative conversations."
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

  // Show a random message when the page loads
  randomizeMessage();

  // Optional: Change message on click
  const messageEl = document.getElementById("contact-message");
  if (messageEl) {
    messageEl.addEventListener("click", randomizeMessage);
  }
});
