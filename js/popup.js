$(() => GuestPlay.get(data => {
	$("#id_simple").change(() => {
		$("#id").val(parseInt((data.formula).replace(/x/gi, $("#id_simple").val())));
		Materialize.updateTextFields();
	});
	
	$("#playButton").click(() => {
		GuestPlay.play(parseInt($("#id").val()), parseInt($("#gender").val()));
		$("#saveSettings").click();
		$('main').hide();
		$('#preloader').show();
	});
	
	$("#saveSettings").click(() => GuestPlay.set({
			id: parseInt($("#id").val()),
			gender: parseInt($("#gender").val())
		}, () => {
			$("#saveSettings").parent().addClass(browser.runtime.lastError ? "red" : "green");
			setTimeout(() => $("#saveSettings").parent().removeClass("green red"), 500);
	}));
	
	$("#resetSettings").click(() => {
		resetDefaults(() => $("#resetSettings").parent().addClass(browser.runtime.lastError ? "red" : "green"));
		setTimeout(() => window.location.reload(), 500);
	});
	
	$("#mailto").click(GuestPlay.mailto);
	
	$("#id").val(data.id);
	$("#gender").val(data.gender);
	Materialize.updateTextFields();
	
	$('select').material_select();
	$('#versionText').text(GuestPlay.currentVersion);
	$('.fixed-action-btn.toolbar').openToolbar();
	
	$('#preloader').hide();
	$('main').show();
}));