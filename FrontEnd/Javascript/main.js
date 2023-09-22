/**
 * Import des modules nécessaires depuis les fichiers spécifiés.
 * @typedef {import("./config.js").MODE} MODE
 * @typedef {import("./utils.js").ViewAdmin} ViewAdmin
 * @typedef {import("./utils.js").createFirstModal} createFirstModal
 * @typedef {import("./utils.js").createSecondModal} createSecondModal
 * @typedef {import("./utils.js").createCustomInputFile} createCustomInputFile
 */

import "./connection.js";
import "./modal_popup.js";
import { MODE } from "./config.js";
import { ViewAdmin, createFirstModal, createSecondModal, createCustomInputFile, createCustomElement } from "./utils.js";

export let responseWorks = await fetch(`${MODE}/works`).then((response) => response.json());
export const JWTtoken = sessionStorage.getItem("token");

const gallery = document.querySelector(".gallery");
export let galleryAdmin = document.querySelector(".admin-gallery");
/**
 * Affiche toutes les images provenant du serveur.
 * @async
 * @param {*} response - La réponse du serveur.
 * @param {boolean} [admin=false] - Indique si l'utilisateur est un administrateur.
 */
export async function displayImages(response, admin = false, filter = false) {
	if (!filter) {
		response = await fetch(`${MODE}/works`).then((response) => response.json());
	}

	if (galleryAdmin === null) {
		galleryAdmin = createCustomElement({ tag: "div", classes: ["admin-gallery"] });
	}
	const container = admin ? galleryAdmin : gallery;

	container.innerHTML = "";
	response.forEach((element) => {
		const figure = createCustomElement({ tag: "figure" });
		const img = createCustomElement({ tag: "img", src: element.imageUrl, alt: element.title });

		if (!admin) {
			const figcaption = createCustomElement({ tag: "figcaption", text: element.title });
			figure.append(img, figcaption);
		} else {
			const trash = createCustomElement({ tag: "button", classes: ["trash"] });
			figure.dataset.id = element.id;
			const i = createCustomElement({ tag: "i", classes: ["fa-solid", "fa-trash-can", "trash-icon"] });
			trash.appendChild(i);
			figure.append(trash, img);
			deleteImage(figure);
		}

		container.appendChild(figure);
	});
}

if (gallery !== null) {
	displayImages(responseWorks);
}

filter();

// function

/**
 * Supprime une image du serveur.
 * @param {HTMLElement} figure - La figure de l'image à supprimer.
 */
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

/**
 * Fonctionnement des fitlres
 **/
function filter() {
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
				displayImages(elementFilterise, false, true);
			}
		});
	});
}
