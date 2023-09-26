import { ViewAdmin, createFirstModal, createSecondModal, createCustomInputFile, createCustomElement } from "./utils.js";
import { responseWorks, displayImages, galleryAdmin, JWTtoken } from "./main.js";
import { MODE } from "./config.js";

let closeModalButtons = document.querySelectorAll(".close-modal");
let backModalButton = document.querySelector(".back-modal");
let homeModal = document.querySelector(".container-modal");
let modalContent = document.querySelectorAll(".modal-content");
let firstModalContent = document.querySelector(".modal-content.first");
let secondModalContent = document.querySelector(".modal-content.second");
let bodyElement = document.querySelector("body");
let buttonAddImage = document.querySelector(".button.modal");
let inputFile = null;
let createModalBool = true;
let verify = false;

ViewAdmin(handleEditionModeClick);
/**
 * Initialise la vue de l'administrateur et configure les événements.
 * @param {Event} event - L'événement de clic.
 */
function handleEditionModeClick(event) {
	if (createModalBool === true) {
		createModal();
		createModalBool = false;
	}
	displayImages(responseWorks, true);

	closeModalButtons = document.querySelectorAll(".close-modal");
	backModalButton = document.querySelector(".back-modal");
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
	backModalButton.addEventListener("click", backModal);

	buttonAddImage[0].addEventListener("click", () => {
		firstModalContent.classList.add("hidden");
		secondModalContent.classList.remove("hidden");
	});
	// checkForElement();
	if (secondModalContent != null) {
		const formulaire = secondModalContent.querySelector("form");
		inputFile = formulaire.querySelector("#file");
		const input = formulaire.querySelector("#title");
		const select = formulaire.querySelector("#categories");

		input.addEventListener("input", verifyChampCompleted);
		select.addEventListener("input", verifyChampCompleted);
		inputFile.addEventListener("input", verifyChampCompleted);

		secondModalSubmit();

		inputFile.addEventListener("change", async (event) => addImageForm(event));
	}
}

function addImageForm(event) {
	const formulaire = secondModalContent.querySelector("form");
	const customInputFile = formulaire.querySelector(".button-file .container");
	customInputFile.innerHTML = "";

	const files = inputFile.files;

	if (files.length > 1) {
		resetForm();
		alert("Vous ne pouvez ajouter qu'une seule image");
	} else if (files.length > 0) {
		const maxSize = 1024 * 1024 * 4; // 4 Mo
		if (event.target.files[0].size <= maxSize) {
			const reader = new FileReader();

			const image = createCustomElement({ tag: "img", classes: ["preview-image"] });
			customInputFile.appendChild(image);

			reader.addEventListener("load", () => {
				image.src = reader.result;
			});

			reader.readAsDataURL(files[0]);
		} else {
			if (files.length > 0) {
				resetForm();
				alert("Le fichier est trop volumineux");
			}
		}
	} else {
		createCustomInputFile(customInputFile);
	}
}

/**
 * Gère le clic sur le bouton de retour de la modal.
 **/
function backModal() {
	const formulaire = secondModalContent.querySelector("form");
	const input = formulaire.querySelector("#title");
	const select = formulaire.querySelector("#categories");
	const inputFile = formulaire.querySelector("#file");
	if (inputFile.files !== null || input.value !== "" || select.value !== "") {
		return;
	}
	if (input.value !== "" || select.value !== "" || inputFile.files.length > 0) {
		resetForm();
	} else {
		firstModalContent.classList.remove("hidden");
		secondModalContent.classList.add("hidden");
	}
}

/**
 * Gère l'évèneemnt submit du formulaire d'ajout d'image.
 */
function secondModalSubmit() {
	const formulaire = secondModalContent.querySelector("form");
	const buttonAddImage = document.querySelectorAll(".button.modal");
	formulaire.addEventListener("submit", async (event) => {
		event.preventDefault();
		if (buttonAddImage[1].classList.contains("disabled") || verify === false) {
			return;
		}
		if (verify) {
			verify = false;

			const formData = new FormData(formulaire);
			const select = formulaire.querySelector("#categories");
			const optionElement = select.querySelector(`option[value="${select.value}"]`);
			formData.append("category", optionElement.dataset.id);

			await fetch(`${MODE}/works`, {
				method: "POST",
				headers: { Authorization: `Bearer ${JWTtoken}` },
				body: formData,
			}).then(async (response) => {
				if (response.status === 201) {
					resetForm();
					await displayImages(responseWorks);
					closingModal();
				} else {
					console.log("Erreur lors de l'ajout de l'image");
				}
			});
			formData.forEach((data) => {
				formData.delete(data);
			});
		}
	});
}

/*
 * Vérifie si les champs sont remplis
 */
function verifyChampCompleted() {
	const formulaire = secondModalContent.querySelector("form");
	const buttonAddImage = document.querySelectorAll(".button.modal");
	const inputFile = formulaire.querySelector("#file");
	const input = formulaire.querySelector("#title");
	const select = formulaire.querySelector("#categories");
	try {
		if (inputFile.files.length > 0 && input.value !== "" && select.value !== "") {
			buttonAddImage[1].classList.remove("disabled");
			verify = true;
		} else {
			buttonAddImage[1].classList.add("disabled");
			verify = false;
		}
	} catch (error) {
		console.log(error);
	}
}

/**
 * Réinitialise le formulaire d'ajout d'image.
 */
function resetForm() {
	const formulaire = secondModalContent.querySelector("form");
	const customInputFile = formulaire.querySelector(".button-file .container");
	const customInputContainerFile = formulaire.querySelector(".button-file");
	const image = formulaire.querySelector(".preview-image");
	const inputFile = formulaire.querySelector("#file");

	if (customInputFile === null && inputFile.files === null && image === null) return;
	formulaire.reset();
	if (image !== null) image.src = "";
	// createCustomInputFile(customInputContainerFile);
}

/**
 * Crée et affiche la modal.
 */
function createModal() {
	const dialog = createCustomElement({ tag: "dialog", classes: ["container-modal", "hidden"] });
	createFirstModal(dialog, galleryAdmin);
	createSecondModal(dialog, responseWorks);
	document.body.appendChild(dialog);
}

/**
 * Ferme la modal.
 */
function closingModal() {
	const formulaire = secondModalContent.querySelector("form");
	const image = formulaire.querySelector(".preview-image");
	const customInputContainerFile = formulaire.querySelector(".button-file");
	if (formulaire !== null) {
		formulaire.reset();
		if (image !== null) image.src = "";
		createCustomInputFile(customInputContainerFile);
	}
	galleryAdmin.innerHTML = "";
	homeModal.classList.add("hidden");
	homeModal.close();
	bodyElement.style.overflow = "auto";
}
