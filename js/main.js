const ext = window.browser || window.chrome;
const currentTab = (open = true) => new Promise((res, rej) => ext.tabs.query({
	active: true,
	currentWindow: true,
	url: "https://*.roblox.com/games/*/*"
}, tabs => {
	if(!tabs[0]) {
		if(open) ext.tabs.create({url:
			"https://web.roblox.com/games/" + 
			"?SortFilter=default&TimeFilter=0" + 
			"&utm_source=guestplay&utm_medium=organic&utm_content=plugin"});
		return rej()
	}
	res(parseInt(new URL(tabs[0].url).pathname.split("/")[2]))
}));
const list = new window.GuestPlayDatabase();
const play = () => (async () => {
	if(document.getElementById("play").disabled) return;
	document.getElementById("play").setAttribute('active', 1);
	
	let placeId = await currentTab();
	await list.ready;

	if(~list.blacklist.indexOf(placeId) &&
		window.confirm &&
		!window.confirm((window.browser || window.chrome).
		i18n.getMessage("blacklisted"))
	) throw new Error("This game is blacklisted");

	await window.startGame(placeId, 0)
})().catch(err => {
	console.error(err);
	document.getElementById("play").removeAttribute('active');
	alert(err.code ? err.message : ext.i18n.getMessage("launchFailed"));
});

document.getElementById("play").title = ext.i18n.getMessage("play");
document.getElementById("play").addEventListener("click", play);

document.querySelectorAll(".link[href]").forEach(v => v.
	addEventListener("click", e => ext.tabs.create({url: e.target.getAttribute("href")})
));

document.querySelectorAll("a[data-target]").forEach(v => v.
	addEventListener("click", e => document.
		getElementById(e.target.getAttribute("data-target")).
			classList.toggle("visible")
));

document.querySelectorAll("[data-setting]").forEach(v => {
	let i = v.getAttribute("data-setting");
	v.firstElementChild.addEventListener("change", () => {
		window.storage[i] = v.firstElementChild.checked;
		setTimeout(() => location.reload(), 200)
	});
	window.storage[i].then(s => {v.firstElementChild.checked = s});
});

document.getElementById("mailto").href = 
	'mailto:45tanaa@gmail.com?subject=GuestPlay%20' + 
	encodeURIComponent(`[${ext.i18n.getUILanguage().toUpperCase()}]`) + 
	'&body=' +
	encodeURIComponent(ext.i18n.getMessage("contactUsMessage"));

document.getElementById("version").innerText =
	ext.runtime.getManifest().version_name;

window.storage.autolaunch.then(async v => {
	if(!v) return;
	await currentTab(false);
	document.getElementById("play").dispatchEvent(new InputEvent("click"))
}).catch(() => {});

console.log("%cRoblox GuestPlay", `
	color: #FFF;
	font-size: 6em;
	font-family: Sans-serif;
	padding: .2em .5em;
	text-align: center;
	font-weight: 700;
	text-stroke: 5px #000;
	background: linear-gradient(135deg,
		rgba(33,150,243,1) 0,
		rgba(33,150,243,.93) 15%,
		rgba(72,70,70,.83) 35%,
		rgba(72,70,70,.75) 50%,
		rgba(72,70,70,.83) 65%,
		rgba(219,33,243,.93) 85%,
		rgba(219,33,243,1) 100%
	)`);
console.log(`%cEND OF LIFE: 13.02.2019`, 'color:#F00;text-align:center;font-size:x-large');
console.log(`Github: https://github.com/45Green/GuestPlay (not maintained)
Our discord server: https://discord.gg/zBrmTwu

Brought to you with ❤️ by GuestPlay Team.
Roblox and the Roblox logo are registered trademarks of Roblox Corporation.`);