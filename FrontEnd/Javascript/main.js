import { MODE } from "./config.js";

const responseWorks = await fetch(`${MODE}/works`).then((response) => response.json());

const listFilter = document.querySelector(".list-filter");
const editionMode = document.querySelector(".edition-mode");
const editionModeButton = document.querySelectorAll(".edition-mode-button");
// localStorage.removeItem("token");
const JWTtoken = localStorage.getItem("token");

const admin = JWTtoken !== null;

if (listFilter !== null && editionMode !== null && editionModeButton !== null) {
	if (admin) {
		listFilter.classList.add("hidden");
		editionMode.classList.remove("hidden");
		editionModeButton.forEach((button) => {
			button.classList.remove("hidden");
		});
	} else {
		listFilter.classList.remove("hidden");
		editionMode.classList.add("hidden");
		editionModeButton.forEach((button) => {
			button.classList.add("hidden");
		});
	}
}

//get all the images from the server and display them
const gallery = document.querySelector(".gallery");
const galleryAdmin = document.querySelector(".admin-gallery");

function displayImages(response, admin = false) {
	const container = admin ? galleryAdmin : gallery;

	response.forEach((element) => {
		const figure = document.createElement("figure");
		const img = document.createElement("img");
		img.src = element.imageUrl;
		img.alt = element.title;

		if (!admin) {
			const figcaption = document.createElement("figcaption");
			figcaption.textContent = element.title;
			figure.append(figcaption, img);
		} else {
			const containeImgAdmin = document.createElement("div");
			const trash = document.createElement("button");
			trash.classList.add("trash");
			containeImgAdmin.dataset.id = element.id;
			const i = document.createElement("i");
			i.classList.add("fa-solid", "fa-trash-can", "trash-icon");
			trash.appendChild(i);
			containeImgAdmin.append(trash, img);
			figure.appendChild(containeImgAdmin);
			deleteImage(containeImgAdmin, figure);
		}

		container.appendChild(figure);
	});
}

function deleteImage(containeImgAdmin, figure) {
	const trashButton = containeImgAdmin.querySelector(".trash");
	trashButton.addEventListener("click", async (event) => {
		event.preventDefault();
	});
	trashButton.addEventListener("click", async (event) => {
		event.preventDefault();
		const image = trashButton.parentNode.querySelector("img");
		await fetch(`${MODE}/works/${containeImgAdmin.dataset.id}`, {
			method: "DELETE",
			headers: { accept: "*/*", Authorization: `Bearer ${JWTtoken}` },
		}).then((response) => {
			// console.log(response);
			if (response.status === 200) {
				event.preventDefault();
				// figure.remove();
				// displayImages(responseWorks, (admin = true));
			} else {
				console.log("error");
			}
		});

		// Vous pouvez ajouter ici le code pour gérer la suppression, si nécessaire.
	});
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
			const elementFilterise = responseWorks.filter(function (element) {
				if (filter.textContent === "Tous") {
					return element;
				}
				return element.category.name === filterName;
			});
			displayImages(elementFilterise);
		}
	});
});
if (gallery !== null) {
	displayImages(responseWorks);
}

//connection

const email = document.querySelector(".email-connection");
const password = document.querySelector(".password-connection");
const buttonConnection = document.querySelector(".connection");
const error = document.querySelector(".error-connection");

if (buttonConnection !== null) {
	buttonConnection.addEventListener("click", async (event) => {
		event.preventDefault();
		const emailValue = email.value;
		const passwordValue = password.value;
		fetch(`${MODE}/users/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: emailValue, password: passwordValue }),
		}).then(async (response) => {
			const token = await response.json().then((data) => data.token);
			if (response.status === 200) {
				window.location.href = "index.html";
				localStorage.setItem("token", token);
			} else {
				error.classList.add("active");
			}
		});
	});
}

//modal amdin

const HomeModal = document.querySelector(".home-modal");
const body = document.querySelector("body");

// HomeModal.showModal();
// displayImages(response, true);

editionModeButton.forEach((button) => {
	button.addEventListener("click", (event) => {
		const closeModal = document.querySelector(".close-modal");
		displayImages(responseWorks, true);
		HomeModal.showModal();
		body.style.overflow = "hidden";
		event.stopPropagation();
		closeModal.addEventListener("click", () => {
			console.log("close");
			galleryAdmin.innerHTML = "";
			HomeModal.close();
			body.style.overflow = "auto";
		});
	});
});
