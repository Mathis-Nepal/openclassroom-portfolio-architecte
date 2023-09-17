import { MODE } from "./config.js";
import { createElementWithClassesAndText } from "./utils.js";
import { ViewAdmin } from "./utils.js";
import { createFirstModal } from "./utils.js";
import { createSecondModal } from "./utils.js";
import { createCustomInputFile } from "./utils.js";

console.log(MODE);

let responseWorks = await fetch(`${MODE}/works`).then((response) => response.json());
const JWTtoken = sessionStorage.getItem("token");
let createModalBool = true;

ViewAdmin(handleEditionModeClick);

//get all the images from the server and display them
const gallery = document.querySelector(".gallery");
let galleryAdmin = document.querySelector(".admin-gallery");

async function displayImages(response, admin = false) {
	response = await fetch(`${MODE}/works`).then((response) => response.json());
	if (galleryAdmin === null) {
		galleryAdmin = createElementWithClassesAndText("div", ["admin-gallery"]);
	}
	const container = admin ? galleryAdmin : gallery;

	// gallery.innerHTML = "";
	container.innerHTML = "";
	response.forEach((element) => {
		const figure = document.createElement("figure");
		const img = document.createElement("img");
		img.src = element.imageUrl;
		img.alt = element.title;

		if (!admin) {
			const figcaption = document.createElement("figcaption");
			figcaption.textContent = element.title;
			figure.append(img, figcaption);
		} else {
			const trash = document.createElement("button");
			trash.classList.add("trash");
			figure.dataset.id = element.id;
			const i = document.createElement("i");
			i.classList.add("fa-solid", "fa-trash-can", "trash-icon");
			trash.appendChild(i);
			figure.append(trash, img);
			deleteImage(figure);
		}

		container.appendChild(figure);
	});
}

function deleteImage(figure) {
	const trashButton = figure.querySelector(".trash");
	trashButton.addEventListener("click", async (event) => {
		event.preventDefault();
		await fetch(`${MODE}/works/${figure.dataset.id}`, {
			method: "DELETE",
			headers: { accept: "*/*", Authorization: `Bearer ${JWTtoken}` },
		}).then(displayImages(responseWorks));
		figure.remove();
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

function connection() {
	const email = document.querySelector(".email-connection");
	const password = document.querySelector(".password-connection");
	const buttonConnection = document.querySelector(".connection");
	const error = document.querySelector(".error-connection");

	if (buttonConnection !== null) {
		buttonConnection.addEventListener("click", async (event) => {
			event.preventDefault();
			const emailValue = email.value;
			const passwordValue = password.value;
			await fetch(`${MODE}/users/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: emailValue, password: passwordValue }),
			}).then(async (response) => {
				const token = await response.json().then((data) => data.token);
				if (response.status === 200) {
					window.location.href = "index.html";
					sessionStorage.setItem("token", token);
				} else {
					error.classList.add("active");
				}
			});
		});
	}
}
connection();

//modal amdin

let closeModalButtons = document.querySelectorAll(".close-modal");
let homeModal = document.querySelector(".container-modal");
let modalContent = document.querySelectorAll(".modal-content");
let firstModalContent = document.querySelector(".modal-content.first");
let secondModalContent = document.querySelector(".modal-content.second");
let bodyElement = document.querySelector("body");
let buttonAddImage = document.querySelector(".button.modal");
let inputFile = null;

function handleEditionModeClick(event) {
	if (createModalBool === true) {
		createModal();
		createModalBool = false;
	}
	displayImages(responseWorks, true);

	closeModalButtons = document.querySelectorAll(".close-modal");
	homeModal = document.querySelector(".container-modal");
	modalContent = document.querySelectorAll(".modal-content");
	firstModalContent = document.querySelector(".modal-content.first");
	secondModalContent = document.querySelector(".modal-content.second");
	bodyElement = document.querySelector("body");
	buttonAddImage = document.querySelectorAll(".button.modal");

	homeModal.classList.remove("hidden");
	firstModalContent.classList.remove("hidden");
	secondModalContent.classList.add("hidden");
	homeModal.showModal();

	bodyElement.style.overflow = "hidden";
	event.stopPropagation();

	homeModal.addEventListener("click", closingModal);

	modalContent.forEach((modal) => {
		modal.addEventListener("click", (event) => {
			event.stopPropagation();
		});
	});
	closeModalButtons.forEach((button) => {
		button.addEventListener("click", closingModal);
	});

	buttonAddImage[0].addEventListener("click", () => {
		firstModalContent.classList.add("hidden");
		secondModalContent.classList.remove("hidden");
	});

	// formulaire d'ajout d'image

	if (secondModalContent !== null) {
		const formulaire = secondModalContent.querySelector("form");
		inputFile = formulaire.querySelector("#file");
		const customInputFile = formulaire.querySelector(".button-file .container");
		const input = formulaire.querySelector("#title");
		const select = formulaire.querySelector("#categories");

		input.addEventListener("input", verifyChampCompleted);
		select.addEventListener("input", verifyChampCompleted);
		inputFile.addEventListener("input", verifyChampCompleted);

		function verifyChampCompleted() {
			try {
				if (inputFile.files.length > 0 && input.value !== "" && select.value !== "") {
					buttonAddImage[1].classList.remove("disabled");
				} else {
					buttonAddImage[1].classList.add("disabled");
				}
			} catch (error) {
				console.log(error);
			}
		}

		buttonAddImage[1].addEventListener("click", async (event) => {
			if (buttonAddImage[1].classList.contains("disabled")) {
				return;
			}
			// event.preventDefault();
			const formData = new FormData(formulaire);
			const select = formulaire.querySelector("#categories");
			const optionElement = select.querySelector(`option[value="${select.value}"]`);

			formData.append("category", optionElement.dataset.id);

			await fetch(`${MODE}/works`, {
				method: "POST",
				headers: { Authorization: `Bearer ${JWTtoken}` },
				body: formData,
			});

			// formData.forEach((data) => {
			// 	formData.delete(data);
			// });
		});

		inputFile.addEventListener("change", () => {
			customInputFile.innerHTML = "";

			// Obtient les fichiers sélectionnés par l'utilisateur
			const files = inputFile.files;

			// Vérifie s'il y a au moins un fichier sélectionné
			if (files.length > 0) {
				// Crée un objet FileReader pour lire le contenu du fichier
				const reader = new FileReader();

				// Crée un élément image
				const image = document.createElement("img");
				image.classList.add("preview-image"); // Ajoute une classe pour le style CSS
				customInputFile.appendChild(image);

				// Ajoute un écouteur d'événement pour lire le fichier lorsqu'il est chargé
				reader.addEventListener("load", () => {
					// Affecte la source de l'image à la donnée lue depuis le fichier
					image.src = reader.result;
				});

				// Lit le contenu du fichier en tant que données URL
				reader.readAsDataURL(files[0]);
			} else {
				createCustomInputFile(customInputFile);
			}
		});
	}
}

function createModal() {
	const dialog = createElementWithClassesAndText("dialog", ["container-modal", "hidden"]);
	createFirstModal(dialog, galleryAdmin);
	createSecondModal(dialog, responseWorks);
	document.body.appendChild(dialog);
}

function closingModal() {
	galleryAdmin.innerHTML = "";

	homeModal.classList.add("hidden");
	homeModal.close();
	bodyElement.style.overflow = "auto";
}
