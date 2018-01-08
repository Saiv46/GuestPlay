function i18n_translate(){
	let getMessage = (window.browser || window.chrome).i18n.getMessage;
	document.querySelectorAll("*[i18n]").forEach((elem) => {
		elem.textContent = getMessage(elem.getAttribute("i18n")) || elem.textContent;
	});
}
(document.attachEvent ? "complete" === document.readyState : "loading" !== document.readyState) ? i18n_translate() : document.addEventListener("DOMContentLoaded", i18n_translate);