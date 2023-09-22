import { MODE } from "./config.js";
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
