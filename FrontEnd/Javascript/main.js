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

const listFilter = document.querySelector(".list-filter");
const editionMode = document.querySelector(".edition-mode");
const editionModeButton = document.querySelectorAll(".edition-mode-button");
// localStorage.removeItem("token");
// localStorage.removeItem("response");
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
	trashButton.addEventListener("click", async () => {
		await fetch(`${MODE}/works/${figure.dataset.id}`, {
			method: "DELETE",
			headers: { accept: "*/*", Authorization: `Bearer ${JWTtoken}` },
		}).then(() => {});
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
				localStorage.setItem("token", token);
			} else {
				error.classList.add("active");
			}
		});
	});
}

//modal amdin

// displayImages(response, true);

const homeModal = document.querySelector(".container-modal");
const modalContent = document.querySelectorAll(".modal-content");
const firstModalContent = document.querySelector(".modal-content.first");
const secondModalContent = document.querySelector(".modal-content.second");
const bodyElement = document.querySelector("body");
const buttonAddImage = document.querySelector(".button.modal");

// homeModal.showModal();
// homeModal.classList.remove("hidden");
// firstModalContent.classList.add("hidden");
// secondModalContent.classList.remove("hidden");

editionModeButton.forEach((button) => {
	button.addEventListener("click", handleEditionModeClick);
});

function handleEditionModeClick(event) {
	const closeModalButtons = document.querySelectorAll(".close-modal");
	displayImages(responseWorks, true);

	openHomeModal();

	bodyElement.style.overflow = "hidden";
	event.stopPropagation();

	homeModal.addEventListener("click", closingModal);
	modalContent.forEach((content) => {
		content.addEventListener("click", (event) => {
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

function openHomeModal() {
	secondModalContent.classList.add("hidden");
	homeModal.classList.remove("hidden");
	firstModalContent.classList.remove("hidden");
	homeModal.showModal();
}

function closingModal() {
	galleryAdmin.innerHTML = "";
	homeModal.classList.add("hidden");
	homeModal.close();
	bodyElement.style.overflow = "auto";
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
