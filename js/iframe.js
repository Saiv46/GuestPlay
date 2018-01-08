$(() => {
	$('#roblox').on('load', () => {
		var placeId = new URL($('#roblox').contents().get(0).location.href).pathname.split("/")[2];
		if(placeId){
			GuestPlay.get((data) => GuestPlay.play(data.id, data.gender, placeId));
		}
    });
	$('#roblox').attr('src', 'https://web.roblox.com/games/?SortFilter=default&TimeFilter=0');
});