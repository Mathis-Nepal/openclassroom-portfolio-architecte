//jsdoc
/**
 * Crée un élément HTML avec des classes et du texte.
 * @param {string} tag - Le tag HTML de l'élément.
 * @param {Array.<string>} classes - Les classes de l'élément.
 * @param {string} text - Le texte de l'élément.
 * @param {string} id - L'id de l'élément.
 * @param {string} value - La valeur de l'élément.
 * @param {string} type - Le type de l'élément.
 * @param {string} name - Le nom de l'élément.
 * @param {string} placeholder - Le placeholder de l'élément.
 * @param {string} action - L'action de l'élément.
 * @param {string} accept - L'accept de l'élément.
 * @param {boolean} required - Le required de l'élément.
 * @param {string} labelFor - Le for de l'élément.
 *
 * @returns {HTMLElement} L'élément HTML.
 * @example
 * createCustomElement(tag : "div", classes : ["class1", "class2"], text : "text", id : "id", value : "value", type : "type", name : "name", placeholder : "placeholder");
 **/
export const createCustomElement = ({ tag: tag, classes: classes, text: text, id: id, value: value, type: type, name: name, placeholder: placeholder, action: action, accept: accept, required: required, labelFor: labelFor, src: src, alt: alt }) => {
	const element = document.createElement(tag);
	if (classes) element.classList.add(...classes);
	if (text) element.textContent = text;
	if (id) element.id = id;
	if (type) element.type = type;
	if (value) element.value = value;
	if (name) element.name = name;
	if (placeholder) element.placeholder = placeholder;
	if (action) element.action = action;
	if (accept) element.accept = accept;
	if (required) element.required = required;
	if (labelFor) element.for = labelFor;
	if (src) element.src = src;
	if (alt) element.alt = alt;
	return element;
};

/**
 * Vue du site en mode administrateur ou classique.
 *
 * @export
 * @param {Function} handleEditionModeClick - Fonction de gestion du clic en mode administrateur.
 */
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

	/**
	 * Gère la déconnexion de l'administrateur.
	 *
	 * @param {Event} event - L'événement de clic.
	 */
	function handleLogout(event) {
		event.preventDefault();
		sessionStorage.removeItem("token");
		ViewAdmin();
	}

	/**
	 * Masque le mode édition et les boutons associés.
	 */
	function hideEditionModeAndButtons() {
		if (editionMode !== null) {
			editionMode.remove();
		}
		editionModeButton.forEach((button) => {
			button.remove();
		});
	}
}

/**
 * Crée le premier modal.
 *
 * @param {HTMLElement} dialog - L'élément du dialogue modal.
 * @param {HTMLElement} galleryAdmin - L'élément de la galerie en mode administrateur.
 */
export function createFirstModal(dialog, galleryAdmin) {
	// const modalContent = createCustomElement({ tag:"div", ["modal-content", "first"]);
	const modalContent = createCustomElement({ tag: "div", classes: ["modal-content", "first"] });
	const i = createCustomElement({ tag: "i", classes: ["fa-solid", "fa-xmark", "close-modal"] });
	const titleModal = createCustomElement({ tag: "span", classes: ["title-modal"], text: "Galerie photo" });
	if (galleryAdmin !== null) {
		galleryAdmin.classList.add("admin-gallery");
	} else {
		galleryAdmin = createCustomElement({ tag: "div", classes: ["admin-gallery"] });
	}
	const separator = createCustomElement({ tag: "span", classes: ["separator"] });
	const buttonModal = createCustomElement({ tag: "button", classes: ["button", "modal"], text: "Ajouter une photo" });
	modalContent.append(i, titleModal, galleryAdmin, separator, buttonModal);
	dialog.appendChild(modalContent);
}

/**
 * Crée le second modal.
 *
 * @param {HTMLElement} dialog - L'élément du dialogue modal.
 * @param {Array.<Object>} responseWorks - La réponse des travaux.
 */
export function createSecondModal(dialog, responseWorks) {
	const formStyleElement = createCustomElement({ tag: "div", classes: ["modal-content", "second", "hidden"], id: "form-style" });

	// Créer et ajouter les éléments du formulaire au div form-style

	formStyleElement.append(createCustomElement({ tag: "i", classes: ["fa-solid", "fa-xmark", "close-modal"] }), createCustomElement({ tag: "i", classes: ["fa-solid", "fa-arrow-left", "back-modal"] }), createCustomElement({ tag: "span", classes: ["title-modal"], text: "Ajout photo" }));

	// Créer le formulaire
	const formElement = createCustomElement({ tag: "form", action: "#" });

	const buttonFile = createCustomElement({ tag: "button", classes: ["button-file"], type: "button" });
	createCustomInputFile(buttonFile);
	const inputTitle = createCustomElement({ tag: "input", classes: ["shadow"], type: "text", id: "title", name: "title", placeholder: "Abajour Tahina" });
	formElement.append(buttonFile, createCustomElement({ tag: "label", text: "Titre" }), inputTitle, createCustomElement({ tag: "label", text: "Categorie" }));

	// Créer le menu déroulant
	const categoriesSelectElement = createCustomElement({ tag: "select", classes: ["shadow"], id: "categories" });

	const categories = responseWorks.map((element) => element.category.name);
	const categoriesUnique = [...new Set(categories)];

	const optionElement = createCustomElement({ tag: "option", value: "" });
	categoriesSelectElement.appendChild(optionElement);
	let counterCategories = 1;
	categoriesUnique.forEach((category) => {
		const optionElement = createCustomElement({ tag: "option", text: category });
		optionElement.dataset.id = counterCategories;
		optionElement.value = category;
		categoriesSelectElement.appendChild(optionElement);
		counterCategories++;
	});

	const button = createCustomElement({ tag: "input", classes: ["button", "modal", "disabled"], type: "submit", value: "Ajouter" });
	button.type = "submit";
	button.value = "Ajouter";
	formElement.append(categoriesSelectElement, createCustomElement({ tag: "span", classes: ["separator"] }), button);

	formStyleElement.appendChild(formElement);
	dialog.appendChild(formStyleElement);
}

/**
 * Crée un champ de fichier d'entrée personnalisé.
 *
 * @param {HTMLElement} buttonFile - Le bouton pour ajouter une photo.
 */

export function createCustomInputFile(buttonFile) {
	buttonFile.innerHTML = "";
	const container = createCustomElement({ tag: "div", classes: ["container"] });
	const label = createCustomElement({ tag: "label", text: "+ Ajouter une photo", labelFor: "file" });
	container.append(createCustomElement({ tag: "i", classes: ["fa-solid", "fa-image"] }), label, createCustomElement({ tag: "span", text: "jpg, png : 4mo max" }));
	const input = createCustomElement({ tag: "input", type: "file", id: "file", name: "image", accept: "image/png, image/jpeg", required: true });
	buttonFile.append(container, input);
}

/**
 * Crée un bouton de mode édition.
 *
 * @param {string} text - Le texte du bouton.
 * @returns {HTMLElement} Le bouton du mode édition.
 */
function createEditionModeButton(text) {
	const button = createCustomElement({ tag: "button", classes: ["edition-mode-button"], text: text });
	const i = createCustomElement({ tag: "button", classes: ["fa-regular", "fa-pen-to-square"] });
	button.append(i);
	return button;
}

/**
 * Crée le conteneur du mode édition.
 */
function createContainerEditionMode() {
	const editionMode = createCustomElement({ tag: "div", classes: ["edition-mode"] });
	editionMode.append(createEditionModeButton("Mode édition"));
	document.body.prepend(editionMode);
}
