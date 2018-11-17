const nav = window.browser || window.chrome,
defaultSettings = {
	gender: 0,
	autolaunch: false,
	compact: false,
	featured: true,
	blacklist: true
};
window.guestPlayStorage = new Proxy(nav.storage.local, {
	get(target, name) {
		return new Promise(res => target.get([name], data => res(data[name])))
	},
	set(target, name, value) {
		target.set({[name]: value}, () => {
			if(!nav.runtime.lastError) return;
			console.error(nav.runtime.lastError);
			alert(nav.i18n.getMessage("saveFailed"))
		})
		return true
	}
});
window.guestPlayStorage.firstrun.then(v => {
	if(v) return;
	console.log(
		"[GuestPlay] First launch, run `%s` to clear data",
		(window.browser ? "browser" : "chrome") + ".storage.local.clear()"
	);
	Object.entries(defaultSettings).
		forEach(s => {window.guestPlayStorage[s[0]] = s[1]});
	window.guestPlayStorage.firstrun = 1;
});
if(location.protocol !== "https:") window.storage = window.guestPlayStorage;