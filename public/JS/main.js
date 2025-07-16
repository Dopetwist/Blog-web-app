const menu = document.querySelector("#menu-icon");
const navBar = document.querySelector(".nav-bar");

menu.addEventListener("click", () => {
    menu.classList.toggle("bx-x");
    navBar.classList.toggle("active");
});


//Auto detect users time zone
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('timeZone').value = Intl.DateTimeFormat().resolvedOptions().timeZone;
});

//Convert UTC timestamp to each user's local time zone
function updateTimestamps () {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    document.querySelectorAll(".timestamp").forEach(element => {
        const utcDate = new Date(element.dataset.utc);
        const options = { timeZone: userTimeZone, hour12: true };

        const year = utcDate.toLocaleString('en-US', { year: 'numeric', ...options });
        const month = utcDate.toLocaleString('en-US', { month: '2-digit', ...options });
        const day = utcDate.toLocaleString('en-US', { day: '2-digit', ...options });
        const time = utcDate.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', ...options });

        element.innerHTML = `<strong class="strong">Posted on:</strong> ${year}/${month}/${day}, ${time}`;
    });
}
