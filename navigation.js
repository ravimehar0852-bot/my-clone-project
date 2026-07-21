document.addEventListener("DOMContentLoaded", () => {

  const buttons = document.querySelectorAll(".nav-btn");
  const screens = document.querySelectorAll(".screen");

  buttons.forEach(button => {
    button.addEventListener("click", () => {

      const target = button.dataset.nav;

      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      screens.forEach(screen => {
        if (screen.dataset.screen === target) {
          screen.classList.remove("hidden");
        } else {
          screen.classList.add("hidden");
        }
      });

    });
  });

});
