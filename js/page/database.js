const databaseUrl = "https://asbmw-service.appspot.com/v1/list";

window.GuestPlayDatabase = class GuestPlayDatabase {
	constructor() {
		this.ready = fetch(databaseUrl).then(async res => {
			if(!res.ok) {
				throw new Error('[GuestPlay] Something went wrong');
			}
			return Object.entries(await res.json())
				.forEach(v => this[v[0]] = v[1])
		}, () => ({}))
	}
}