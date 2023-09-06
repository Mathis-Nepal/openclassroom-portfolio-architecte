import { MODE } from "./config.js";

const response = await fetch(`${MODE}/works`).then((response) => response.json());

//get all the images from the server and display them
const gallery = document.querySelector(".gallery");

function displayImages(response) {
	for (let i = 0; i < response.length; i++) {
		const element = response[i];
		const figure = document.createElement("figure");
		const img = document.createElement("img");
		img.src = element.imageUrl;
		img.alt = element.title;
		const figcaption = document.createElement("figcaption");
		figcaption.textContent = element.title;
		figure.append(img, figcaption);
		gallery.appendChild(figure);
	}
}
//filter

const filters = document.querySelectorAll(".list-filter button");

filters.forEach((filter) => {
	filter.addEventListener("click", () => {
		const filterName = filter.textContent.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
		if (filter.classList.contains("active") === false) {
			document.querySelector(".gallery").innerHTML = "";

			filters.forEach((otherFilter) => {
				otherFilter.classList.remove("active");
			});

			filter.classList.add("active");
			const elementFilterise = response.filter(function (element) {
				if (filter.textContent === "Tous") {
					return element;
				}
				return element.category.name === filterName;
			});
			displayImages(elementFilterise);
		}
	});
});

displayImages(response);
