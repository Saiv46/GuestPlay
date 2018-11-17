const parsePlaceId = query => {
	if(!query) return 0;
	return parseInt(query.split("&").
		filter(v => !v.indexOf("PlaceId"))[0].split("=")[1])
};

(async () => {
	console.debug("[GuestPlay] Fetching storage");

	let featuredEnabled = await window.guestPlayStorage.featured,
	blacklistEnabled = await window.guestPlayStorage.blacklist;

	if(!featuredEnabled && !blacklistEnabled) return;

	console.debug("[GuestPlay] Fetching database");
	let list = new window.GuestPlayDatabase();
	await list.ready;
	let{featured, blacklist} = list;
	
	console.debug("[GuestPlay] Fetching database");

	document.querySelectorAll("#game-detail-page").forEach(v => {
		let id = parseInt(v.getAttribute("data-place-id"));
		if(featuredEnabled && ~featured.indexOf(id)) {
			v.classList.add("featured");
		}
		if(blacklistEnabled && ~blacklist.indexOf(id)) {
			v.classList.add("blacklist");
		}
	});

	document.querySelectorAll(".game-cards").
		forEach(el => new MutationObserver(mutations => {
			mutations.forEach(mutation => mutation.addedNodes.forEach(v => {
				if(
					!v.classList.contains('game-card') ||
					!v.querySelector('.game-card-link')
				) return;
				let id = parsePlaceId(v.querySelector('.game-card-link').href);
				if(!id) return;
				if(featuredEnabled && ~featured.indexOf(id)) {
					v.classList.add("featured");
				}
				if(blacklistEnabled && ~blacklist.indexOf(id)) {
					v.classList.add("blacklist");
				}
			}));
		}).observe(el, {childList: true}))
})();