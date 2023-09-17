export const createElementWithClassesAndText = (tag, classes, text) => {
	const element = document.createElement(tag);
	element.classList.add(...classes);
	if (text) {
		element.textContent = text;
	}
	return element;
};

export function ViewAdmin(handleEditionModeClick) {
	const JWTtoken = sessionStorage.getItem("token");
	console.log(JWTtoken);
	const admin = JWTtoken !== null;
	const listFilter = document.querySelector(".list-filter");
	let editionMode = document.querySelector(".edition-mode");
	let editionModeButton = document.querySelectorAll(".edition-mode-button");
	const loginButton = document.querySelector(".login-button");
	const containerPortflio = document.querySelector(".container-button-portfolio");

	if (listFilter !== null) {
		if (admin) {
			listFilter.classList.add("hidden");
			createContainerEditionMode();
			containerPortflio.append(createEditionModeButton("Modifier"));
			editionMode = document.querySelector(".edition-mode");
			editionModeButton = document.querySelectorAll(".edition-mode-button");
			editionMode.classList.remove("hidden");
			editionModeButton.forEach((button) => {
				button.classList.remove("hidden");
				button.addEventListener("click", handleEditionModeClick);
			});

			loginButton.innerHTML = "logout";
			loginButton.addEventListener("click", handleLogout);
			console.log(`admin ${admin}`);
		} else {
			hideEditionModeAndButtons();
			listFilter.classList.remove("hidden");
			editionModeButton.forEach((button) => {
				button.classList.add("hidden");
			});

			loginButton.innerHTML = "login";
			loginButton.addEventListener("click", () => {
				location.href = "./connection.html";
			});
		}
	}

	function handleLogout(event) {
		event.preventDefault();
		sessionStorage.removeItem("token");
		ViewAdmin();
	}

	function hideEditionModeAndButtons() {
		if (editionMode !== null) {
			editionMode.remove();
		}
		editionModeButton.forEach((button) => {
			button.remove();
		});
	}
}

export function createFirstModal(dialog, galleryAdmin) {
	const modalContent = createElementWithClassesAndText("div", ["modal-content", "first"]);
	const i = createElementWithClassesAndText("i", ["fa-solid", "fa-xmark", "close-modal"]);
	const titleModal = createElementWithClassesAndText("span", ["title-modal"], "Galerie photo");
	if (galleryAdmin !== null) {
		galleryAdmin.classList.add("admin-gallery");
	} else {
		galleryAdmin = createElementWithClassesAndText("div", ["admin-gallery"]);
	}
	const separator = createElementWithClassesAndText("span", ["separator"]);
	const buttonModal = createElementWithClassesAndText("button", ["button", "modal"], "Ajouter une photo");
	modalContent.append(i, titleModal, galleryAdmin, separator, buttonModal);
	dialog.appendChild(modalContent);
}

export function createSecondModal(dialog, responseWorks) {
	const formStyleElement = createElementWithClassesAndText("div", ["modal-content", "second", "hidden"]);
	formStyleElement.id = "form-style";

	// Créer et ajouter les éléments du formulaire au div form-style
	formStyleElement.append(createElementWithClassesAndText("i", ["fa-solid", "fa-xmark", "close-modal"]), createElementWithClassesAndText("span", ["title-modal"], "Ajout photo"));

	// Créer le formulaire
	const formElement = createElementWithClassesAndText("form", [], null);
	formElement.action = "#"; // Spécifiez l'URL de l'action du formulaire ici

	const buttonFile = createElementWithClassesAndText("button", ["button-file"], null);
	buttonFile.type = "button";
	createCustomInputFile(buttonFile);
	const inputTitle = createElementWithClassesAndText("input", ["shadow"], null);
	inputTitle.type = "text";
	inputTitle.id = "title";
	inputTitle.name = "title";
	inputTitle.placeholder = "Abajour Tahina";
	formElement.append(buttonFile, createElementWithClassesAndText("label", [], "Titre"), inputTitle, createElementWithClassesAndText("label", [], "Categorie"));

	// Créer le menu déroulant
	const categoriesSelectElement = createElementWithClassesAndText("select", ["shadow"], null);
	categoriesSelectElement.id = "categories";

	const categories = responseWorks.map((element) => element.category.name);
	const categoriesUnique = [...new Set(categories)];

	const optionElement = createElementWithClassesAndText("option", [], "");
	optionElement.value = "";
	categoriesSelectElement.appendChild(optionElement);
	let counterCategories = 1;
	categoriesUnique.forEach((category) => {
		const optionElement = createElementWithClassesAndText("option", [], category);
		optionElement.dataset.id = counterCategories;
		optionElement.value = category;
		categoriesSelectElement.appendChild(optionElement);
		counterCategories++;
	});

	const button = createElementWithClassesAndText("input", ["button", "modal", "disabled"]);
	button.type = "submit";
	button.value = "Ajouter";
	formElement.append(categoriesSelectElement, createElementWithClassesAndText("span", ["separator"], null), button);

	formStyleElement.appendChild(formElement);
	dialog.appendChild(formStyleElement);
}

export function createCustomInputFile(buttonFile) {
	const container = createElementWithClassesAndText("div", ["container"]);
	const label = createElementWithClassesAndText("label", [], "+ Ajouter une photo");
	label.for = "file";
	container.append(createElementWithClassesAndText("i", ["fa-solid", "fa-image"]), label, createElementWithClassesAndText("span", [], "jpg, png : 4mo max"));
	const input = createElementWithClassesAndText("input", [], null);
	input.type = "file";
	input.id = "file";
	input.name = "image";
	input.accept = "image/png, image/jpeg";
	input.required = true;
	buttonFile.append(container, input);
}

function createEditionModeButton(text) {
	const button = createElementWithClassesAndText("button", ["edition-mode-button"], text);
	const i = createElementWithClassesAndText("button", ["fa-regular", "fa-pen-to-square"]);
	button.append(i);
	return button;
}

function createContainerEditionMode() {
	const editionMode = createElementWithClassesAndText("div", ["edition-mode"]);
	editionMode.append(createEditionModeButton("Mode édition"));
	document.body.prepend(editionMode);
}
