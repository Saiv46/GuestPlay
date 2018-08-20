const fetchUrl = "https://raw.githubusercontent.com/45Green/GuestPlay/master/datebase.json";
const processJson = response => {
	console.debug("[GuestPlay] Got response", response);
	if(!response.ok) throw new Error('[GuestPlay] Something went wrong with network');
	return response.json();
};
const fetchDb = (fallback = true) => fetch(fetchUrl).then(processJson).catch(err => {
	if(!fallback) throw err;
	console.warn("[GuestPlay] Failed to fetch latest data from GitHub, using local datebase instead");
	return fetch(chrome.runtime.getURL("datebase.json")).then(processJson)
});
let blacklist = [];
fetchDb().then(data => {
	blacklist = data.blacklist || blacklist;
	console.debug("[GuestPlay] Ready", data);
	let placeId = (location.pathname.match(/\/games\/(\d+)\/.+/i) || [])[1];
	if(placeId && !isNaN(placeId) && ~featured.indexOf(placeId)) {
		document.getElementById("game-detail-page").classList.add("featured");
	}
});
window.GuestPlay = {
	start: (placeId, userId, gender) => {
		if(~blacklist.indexOf(placeId) && window.confirm && !window.confirm(chrome.i18n.getMessage("blacklisted"))) return;
		document.getElementById("play").setAttribute('active', null);
		document.getElementById("play").onclick = () => {};
		let ifrm = document.createElement("iframe");
		ifrm.setAttribute("src", `roblox-player:1+launchmode:play+gameinfo:${Array(264).fill(0).map(() => Math.floor(Math.random() * 16).toString(16).toUpperCase()).join("")}+launchtime:${Date.now()}+placelauncherurl:https%3A%2F%2Fassetgame.roblox.com%2Fgame%2FPlaceLauncher.ashx%3Frequest%3DRequestGame%26browserTrackerId%3D${userId}%26gender%3D${gender+1}%26placeId%3D${placeId}%26isPartyLeader%3Dfalse+browsertrackerid:${userId}`);
		ifrm.style.display = "none";
		document.body.appendChild(ifrm);
	},
	play: async (forceId) => Promise.all([forceId || GuestPlay.currentTab, GuestPlay.id, GuestPlay.gender]).then(data => GuestPlay.start(...data)), get currentTab() {
		return new Promise((res, rej) => chrome.tabs.query({
			active: true,
			currentWindow: true,
			url: "https://*.roblox.com/games/*/*"
		}, tabs => {
			if(!tabs[0]) return rej(GuestPlay.currentTab = true);
			res(parseInt(new URL(tabs[0].url).pathname.split("/")[2]))
		}))
	}, set currentTab(analytics) {
		return chrome.tabs.create({
			url: analytics ? "https://web.roblox.com/games/?SortFilter=default&TimeFilter=0&utm_source=guestplay&utm_medium=organic&utm_campaign=play&utm_content=plugin" : "https://web.roblox.com/games/"
		})
	}, get gender() {
		return new Promise((res, rej) => chrome.storage.local.get(['gender'], data => {
			data.gender !== undefined ? res(data.gender) : rej()
		}));
	}, set gender(value) {
		return new Promise((res, rej) => chrome.storage.local.set({
			gender: value
		}, () => {
			chrome.runtime.lastError ? rej(chrome.runtime.lastError) : res(value)
		})).then(value => document.body.setAttribute("gender", value) || value, err => {
			console.error(err);
			alert(chrome.i18n.getMessage("saveFailed") || "Failed to save your preferences, please reload this page or contact developers about this problem.");
		})
	}, get id() {
		return new Promise((res, rej) => chrome.storage.local.get(['id'], data => {
			data.id !== undefined ? res(data.id) : rej()
		}));
	}, set id(value) {
		return new Promise((res, rej) => chrome.storage.local.set({
			id: value
		}, () => {
			chrome.runtime.lastError ? rej(chrome.runtime.lastError) : res(value)
		})).catch(err => {
			console.error(err);
			alert(chrome.i18n.getMessage("saveFailed") || "Failed to save your preferences, please reload this page or contact developers about this problem.");
		})
	}, init() {
		document.getElementById("play").onclick = () => GuestPlay.play();
		document.getElementById("mailto").onclick = () => chrome.tabs.create({
			url: `mailto:45tanaa@gmail.com?subject=${encodeURIComponent('GuestPlay ['+ chrome.i18n.getUILanguage().toUpperCase() +']')}&body=${encodeURIComponent(chrome.i18n.getMessage("contactUsMessage"))}`
		});
		document.getElementById("version").innerText = chrome.runtime.getManifest().version_name;
		let genders = ["genderDefault", "genderMale", "genderFemale"];
		document.querySelectorAll("#gender li").forEach(a => {
			let genderId = parseInt(a.getAttribute('gender'));
			a.title = chrome.i18n.getMessage(genders[genderId]);
			a.onclick = () => {
				GuestPlay.gender = genderId
			};
		});
		document.getElementById("play").title = chrome.i18n.getMessage("play") || "Play as Guest";
		GuestPlay.id.catch(() => {
			GuestPlay.id = Math.floor(Math.random() * 9999999999)
		});
		GuestPlay.gender.then(gender => document.body.setAttribute("gender", gender), () => {
			GuestPlay.gender = 0
		});
	}
};
(f => {
	(document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") ? f(): document.addEventListener('DOMContentLoaded', f)
})(GuestPlay.init);