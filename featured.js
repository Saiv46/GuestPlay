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

const parseQuery = query => {
	let obj = {};
	query.split("&").map(v => v.split("=")).forEach(v => {
		obj[v[0]] = v[1]
	});
	return obj;
};

let featured = [],
	blacklist = [];

fetchDb().then(data => {
	featured = data.featured || featured;
	blacklist = data.blacklist || blacklist;
	console.debug("[GuestPlay] Ready", data);
	let placeId = (location.pathname.match(/\/games\/(\d+)\/.+/i) || [])[1];
	if(placeId && !isNaN(placeId) && ~featured.indexOf(placeId)) {
		document.getElementById("game-detail-page").classList.add("featured");
	}
});

document.querySelectorAll(".game-cards").forEach(list => new MutationObserver(mutations => {
	mutations.forEach(mutation => mutation.addedNodes.forEach(v => {
		if(!v.classList.contains('game-card') || !v.querySelector('.game-card-link')) return;
		let placeId = parseInt(parseQuery(v.querySelector('.game-card-link').href).PlaceId);
		if(~featured.indexOf(placeId)) v.classList.add("featured");
		if(~blacklist.indexOf(placeId)) v.classList.add("blacklist");
	}));
}).observe(list, {
	childList: true
}))