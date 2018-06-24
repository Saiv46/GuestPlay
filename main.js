window.chrome = window.chrome || window.browser;

(function(func){(document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") ? func() : document.addEventListener('DOMContentLoaded', func)})(function(){
	function getRobloxPlayerURI(placeId, userId, gender){
		return 'roblox-player:1+launchmode:play+gameinfo:' + Array(264).fill(0).map(function(){return Math.floor(Math.random() * 16).toString(16).toUpperCase()}).join("") + '+launchtime:' + Date.now() + '+placelauncherurl:https%3A%2F%2Fassetgame.roblox.com%2Fgame%2FPlaceLauncher.ashx%3Frequest%3DRequestGame%26browserTrackerId%3D' + userId + '%26gender%3D' + gender + '%26placeId%3D' + placeId + '%26isPartyLeader%3Dfalse+browsertrackerid:' + userId
	}
	
	function play(){
		chrome.tabs.query({active: true, currentWindow: true, url: "https://*.roblox.com/games/*/*"}, (tabs) => {
			if(!tabs[0]) return chrome.tabs.create({url: 'https://web.roblox.com/games/'});
		
			let ifrm = document.createElement("iframe");
			ifrm.setAttribute("src", getRobloxPlayerURI(new URL(tabs[0].url).pathname.split("/")[2] || '0', Math.floor(Math.random() * 9999999999), document.querySelector("main").getAttribute("gender") || 1));
			ifrm.style.display = "none";
			document.body.appendChild(ifrm);
		})
	}
	
	function postinit(){
		chrome.storage.local.get(null, data => {
			if(!data.gender) return chrome.storage.local.set({gender: 0}, postinit);
			document.body.setAttribute("gender", data.gender);
			document.getElementById("play").title = chrome.i18n.getMessage("play") || "Play as Guest";
		})
	}
	
	document.getElementById("play").onclick = play;
	document.getElementById("mailto").onclick = function(){chrome.tabs.create({url: 'mailto:45tanaa@gmail.com?subject=GuestPlay%20%5B' + chrome.i18n.getUILanguage().toUpperCase() + '%5D&body='+ encodeURIComponent(chrome.i18n.getMessage("contactUsMessage"))})};
	
	var genders = ["genderDefault", "genderMale", "genderFemale"];
	document.querySelectorAll("#gender li").forEach(function(a){
		var genderId = parseInt(a.getAttribute('gender'));
		a.onclick = function(){chrome.storage.local.set({gender: genderId}, function(){chrome.runtime.lastError ? alert(chrome.i18n.getMessage("saveFailed") || "Failed to save your preferences, please reload this page or contact dev about this problem.") : document.body.setAttribute("gender", genderId)})};
		a.title = chrome.i18n.getMessage(genders[genderId - 1]);
	});
	delete genders;
	
	document.getElementById("version").innerText = chrome.runtime.getManifest().version_name;
	postinit()
})