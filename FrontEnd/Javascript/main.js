import { MODE } from "./config.js";

//session plutot que local storage
// const responseWorks = JSON.parse(localStorage.getItem("response"));
const responseWorks = await fetch(`${MODE}/works`).then((response) => response.json());

// async function BackEndRessources(newData = false) {
// 	try {
// 		if (newData) {
// 			responseWorks = null;
// 		}
// 		if (responseWorks === null) {
// 			console.log("affect response to localStorage");
// 			const response = await fetch(`${MODE}/works`).then((response) => response.json());
// 			localStorage.setItem("response", JSON.stringify(response));
// 			responseWorks = localStorage.getItem("response");
// 		} else {
// 			console.log("already existing in localStorage");
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// }

// await BackEndRessources();

let createModalBool = true;

const createElementWithClasses = (tag, classes) => {
	const element = document.createElement(tag);
	element.classList.add(...classes);
	return element;

	// element.id.add(...id);
};

// Fonction pour créer un élément avec des classes et un éventuel texte
const createElementWithClassesAndText = (tag, classes, text) => {
	const element = document.createElement(tag);
	element.classList.add(...classes);
	if (text) {
		element.textContent = text;
	}
	return element;
};

const listFilter = document.querySelector(".list-filter");
const editionMode = document.querySelector(".edition-mode");
const editionModeButton = document.querySelectorAll(".edition-mode-button");
// localStorage.removeItem("token");
// localStorage.removeItem("response");
const JWTtoken = sessionStorage.getItem("token");

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
let galleryAdmin = document.querySelector(".admin-gallery");

function displayImages(response, admin = false) {
	if (galleryAdmin === null) {
		galleryAdmin = createElementWithClasses("div", ["admin-gallery"]);
	}
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

let indexElementDelete = [];
function deleteImage(figure) {
	const trashButton = figure.querySelector(".trash");
	trashButton.addEventListener("click", (event) => {
		event.preventDefault();
		indexElementDelete.push(figure.dataset.id);
		figure.remove();
	});
	// BackEndRessources(true);
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
				sessionStorage.setItem("token", token);
			} else {
				error.classList.add("active");
			}
		});
	});
}

//modal amdin

// displayImages(response, true);

// homeModal.showModal();
// homeModal.classList.remove("hidden");
// firstModalContent.classList.add("hidden");
// secondModalContent.classList.remove("hidden");

// const homeModal = document.querySelector(".container-modal");
let closeModalButtons = document.querySelectorAll(".close-modal");
let homeModal = document.querySelector(".container-modal");
let modalContent = document.querySelectorAll(".modal-content");
let firstModalContent = document.querySelector(".modal-content.first");
let secondModalContent = document.querySelector(".modal-content.second");
let bodyElement = document.querySelector("body");
let buttonAddImage = document.querySelector(".button.modal");

editionModeButton.forEach((button) => {
	button.addEventListener("click", handleEditionModeClick);
});

function handleEditionModeClick(event) {
	if (createModalBool === true) {
		console.log("create modal");
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
	buttonAddImage = document.querySelector(".button.modal");

	homeModal.classList.remove("hidden");
	firstModalContent.classList.remove("hidden");
	secondModalContent.classList.add("hidden");
	homeModal.showModal();

	// openHomeModal();

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

	buttonAddImage.addEventListener("click", () => {
		firstModalContent.classList.add("hidden");
		secondModalContent.classList.remove("hidden");
	});
}

function createModal() {
	console.log("create modal ici ");
	const dialog = createElementWithClasses("dialog", ["container-modal", "hidden"]);
	createFirstModal(dialog);
	createSecondModal(dialog);
	document.body.appendChild(dialog);
}

// function openHomeModal() {
// 	homeModal.classList.remove("hidden");
// 	firstModalContent.classList.remove("hidden");
// 	secondModalContent.classList.add("hidden");
// 	homeModal.showModal();

function closingModal() {
	galleryAdmin.innerHTML = "";
	homeModal.classList.add("hidden");
	homeModal.close();
	bodyElement.style.overflow = "auto";
	indexElementDelete.forEach(async (index) => {
		await fetch(`${MODE}/works/${index}`, {
			method: "DELETE",
			headers: { accept: "*/*", Authorization: `Bearer ${JWTtoken}` },
		});
	});
	indexElementDelete = [];
}

// formulaire d'ajout d'image

if (secondModalContent !== null) {
	const formulaire = secondModalContent.querySelector("form");
	const inputFile = formulaire.querySelector("#file");
	const customInputFile = formulaire.querySelector(".button-file .container");

	//when user seleet file

	inputFile.addEventListener("change", () => {
		customInputFile.innerHTML = "";
		const file = inputFile.files;
		const reader = new FileReader();
		const image = document.createElement("img");
		image.src = file[0];
		console.log(file[0]);
		customInputFile.appendChild(image);
		reader.addEventListener("load", () => {});
	});
}

//créer le premier modal

function createFirstModal(dialog) {
	console.log("create first modal dans le first create modal");

	const modalContent = createElementWithClasses("div", ["modal-content", "first"]);
	const i = createElementWithClasses("i", ["fa-solid", "fa-xmark", "close-modal"]);
	const titleModal = createElementWithClasses("span", ["title-modal"], "Galerie photo");
	if (galleryAdmin !== null) {
		// const adminGallery = createElementWithClasses("div", ["admin-gallery"]);
		galleryAdmin.classList.add("admin-gallery");
	} else {
		galleryAdmin = createElementWithClasses("div", ["admin-gallery"]);
	}
	const separator = createElementWithClasses("span", ["separator"]);
	const buttonModal = createElementWithClassesAndText("button", ["button", "modal"], "Ajouter une photo");
	modalContent.append(i, titleModal, galleryAdmin, separator, buttonModal);
	console.log(modalContent);
	dialog.appendChild(modalContent);
	// document.body.appendChild(dialog);
}

function createSecondModal(dialog) {
	const formStyleElement = createElementWithClassesAndText("div", ["modal-content", "second", "hidden"]);
	formStyleElement.id = "form-style";

	// Créer et ajouter les éléments du formulaire au div form-style
	formStyleElement.append(createElementWithClassesAndText("i", ["fa-solid", "fa-xmark", "close-modal"]), createElementWithClassesAndText("span", ["title-modal"], "Ajout photo"));

	// Créer le formulaire
	const formElement = createElementWithClassesAndText("form", [], null);
	formElement.action = "#"; // Spécifiez l'URL de l'action du formulaire ici

	formElement.append(
		createElementWithClassesAndText("button", ["button-file"], null),
		createElementWithClassesAndText("label", [], "+ Ajouter photo"),
		createElementWithClassesAndText("input", [], null),
		createElementWithClassesAndText("label", [], "Titre"),
		createElementWithClassesAndText("input", ["shadow"], null),
		createElementWithClassesAndText("label", [], "Categorie")
	);

	// Créer le menu déroulant
	const categoriesSelectElement = createElementWithClassesAndText("select", ["shadow"], null);
	categoriesSelectElement.id = "categories";

	const categories = ["Objets", "Appartements", "Hôtels & restaurants"];

	categories.forEach((category) => {
		const optionElement = createElementWithClassesAndText("option", [], category);
		optionElement.value = category;
		categoriesSelectElement.appendChild(optionElement);
	});
	const button = createElementWithClassesAndText("input", ["button", "modal", "disabled"]);
	button.value = "Ajouter";
	formElement.append(categoriesSelectElement, createElementWithClassesAndText("span", ["separator"], null), button);

	formStyleElement.appendChild(formElement);
	dialog.appendChild(formStyleElement);
}
