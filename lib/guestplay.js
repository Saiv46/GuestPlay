/**
 * GuestPlay JS Library
 * Version: 1.0 (extension version: 1.4)
 */
window.browser = window.browser || window.chrome;

window.GuestPlay = {
	currentVersion: browser.runtime.getManifest().version,
	
	resetDefaults: (callback) => {
		var defaultSettings = {
			id: Math.floor(Math.random() * 9999999999),
			gender: 0,
			formula: '1000X',
			version: GuestPlay.currentVersion,
			firstLaunch: true
		};
		GuestPlay.set(defaultSettings, callback ? () => callback(defaultSettings): null);
	},
	
	get: (callback) => browser.storage.local.get(null, (data) => ((data.length === 0) ? GuestPlay.resetDefaults(callback) : callback(data))),
	
	set: (settings, callback) => browser.storage.local.set(settings, () => (callback ? callback(!browser.runtime.lastError) : null)),
	
	playTab: (id, gender) => {
		browser.tabs.query({active: true, currentWindow: true, url: "https://*.roblox.com/games/*"}, (tabs) => {
			if(tabs[0]){
				GuestPlay.play(id, gender, new URL(tabs[0].url).pathname.split("/")[2] || '0');
			}else{
				browser.tabs.create({url: 'https://web.roblox.com/games/'});
			}
		})
	},
	
	play: (id, gender, placeId) => {
		if(!placeId && browser){
			GuestPlay.playTab(id, gender);
			return;
		}
		var ifrm = document.createElement("iframe");
		ifrm.setAttribute('src', 'roblox-player:1+launchmode:play+gameinfo:BED8D7FEDEA058C6B7413F6B7F43730E12CAE4FC55C197144F206360199DEFA28CD2869010E2931B23CA69DF1810380973007A1B1A63CFEB7F0096710875DD40512741C371E6005CE62876700E621347422E3C44F49A8941EF152074B5E1AEA8A3322CE2DBB1BF0A0C86AF783238EDFA65BFB9144678C4867714B4B38FBFD9F284A157DC+launchtime:1505275116493+placelauncherurl:https%3A%2F%2Fassetgame.roblox.com%2Fgame%2FPlaceLauncher.ashx%3Frequest%3DRequestGame%26browserTrackerId%3D'+id+'%26gender%3D'+gender+'%26placeId%3D'+placeId+'%26isPartyLeader%3Dfalse+browsertrackerid:'+id);
		ifrm.style.display = 'none';
		document.body.appendChild(ifrm);
	},
	
	mailto: () => browser.tabs.create({url: 'mailto:45tanaa@gmail.com?subject=GuestPlay%20bug%20report&body=Describe%20bug'})
};