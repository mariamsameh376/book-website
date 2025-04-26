document.addEventListener("DOMContentLoaded", function () {
    let index = 0;
    const slides = document.querySelector(".slider-container .slider");
    const dots = document.querySelectorAll(".dot");

    function showSlide(n) {
        index = n;
        slides.style.transform = `translateX(${-index * 100}%)`;
        dots.forEach(dot => dot.classList.remove("active"));
        dots[n].classList.add("active");
    }

    function moveSlide(step) {
        index = (index + step + dots.length) % dots.length;
        showSlide(index);
    }

    function currentSlide(n) {
        showSlide(n - 1);
    }

    setInterval(() => moveSlide(1), 3000);
    showSlide(0);
});

function addReview() {
    let name = document.getElementById("name").value;
    let role = document.getElementById("role").value;
    let reviewText = document.getElementById("review-text").value;

    if (name === "" || role === "" || reviewText === "") {
        alert("Please fill out all fields!");
        return;
    }

    let newReview = document.createElement("div");
    newReview.classList.add("review");

    newReview.innerHTML = `
        <p class="stars">★★★★★</p>
        <p class="text">${reviewText}</p>
        <div class="reviewer">
            <img src="images/default-user.png" alt="${name}">
            <div>
                <h4>${name}</h4>
                <p>${role}</p>
            </div>
        </div>
    `;

    document.getElementById("reviews-container").appendChild(newReview);

    // مسح البيانات بعد الإضافة
    document.getElementById("name").value = "";
    document.getElementById("role").value = "";
    document.getElementById("review-text").value = "";
}

