const fetchEndpoint = async data => {
	try{
		let rawRes = await fetch("https://asbmw-service.appspot.com/v1/play", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if(!rawRes.ok) {
			let err = new Error("Network error");
			err.code = rawRes.status;
			throw err;
		}
		return rawRes.json()
	} catch(e) {
		let getMsg = (window.browser||window.chrome).i18n.getMessage;
		let err = new Error(
			getMsg(`error${e.code}`) || getMsg("launchFailed")
		);
		err.code = e.code;
		throw err;
	}
};

window.startGame = async (placeId, genderId) => {
	console.debug(
		`[GuestPlay] Starting game %i with gender %s`,
		placeId, genderId
	);
	let localToken = await window.storage[`replay${genderId}`];
	let{replayToken, gameLaunchUrl} = await fetchEndpoint({
		placeId, genderId,
		locale: navigator.userLanguage || "en_us",
		replayToken: localToken && localToken.expires < Date.now()
			? localToken.content : ""
	});
	window.storage[`replay${genderId}`] = replayToken;
	
	// LAUNCH
	let ifrm = document.createElement("iframe");
	ifrm.style.display = "none";
	ifrm.setAttribute("src", gameLaunchUrl);
	document.body.appendChild(ifrm);

	// DEBUG
	let devtools = /./;
	devtools.toString = () => {devtools.opened = true};
	console.log('%cDeveloper console opened', devtools);
	setTimeout(() => {!devtools.opened && window.close()}, 5000);
};