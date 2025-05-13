const menu = document.querySelector("#menu-icon");
const navBar = document.querySelector(".nav-bar");

menu.addEventListener("click", () => {
    menu.classList.toggle("bx-x");
    navBar.classList.toggle("active");
});

