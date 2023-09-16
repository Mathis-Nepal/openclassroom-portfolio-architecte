export const createElementWithClassesAndText = (tag, classes, text) => {
	const element = document.createElement(tag);
	element.classList.add(...classes);
	if (text) {
		element.textContent = text;
	}
	return element;
};

export function ViewAdmin(editionModeButton) {
	const JWTtoken = sessionStorage.getItem("token");
	console.log(JWTtoken);
	const admin = JWTtoken !== null;
	const listFilter = document.querySelector(".list-filter");
	const editionMode = document.querySelector(".edition-mode");
	const loginButton = document.querySelector(".login-button");
	if (listFilter !== null && editionMode !== null && editionModeButton !== null) {
		if (admin) {
			listFilter.classList.add("hidden");
			editionMode.classList.remove("hidden");
			editionModeButton.forEach((button) => {
				button.classList.remove("hidden");
			});
			loginButton.innerHTML = "logout";
			// loginButton.classList.add("logout-button");
			console.log(`admin ${admin}`);
			loginButton.addEventListener("click", (event) => {
				event.preventDefault();
				console.log("logout");
				sessionStorage.removeItem("token");
				ViewAdmin(editionModeButton);
			});
		} else {
			listFilter.classList.remove("hidden");
			editionMode.classList.add("hidden");
			editionModeButton.forEach((button) => {
				button.classList.add("hidden");
			});
			loginButton.innerHTML = "login";
			loginButton.addEventListener("click", (event) => {
				location.href = "./connection.html";
			});
		}
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
