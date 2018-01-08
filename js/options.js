$(() => GuestPlay.get(data => {
	$("#formula").val(data.formula);
	$("#formula").change(() => GuestPlay.set({formula: $(this).val()}));
	$("#reset").click(GuestPlay.resetDefaults);
	$('#versionText').text(GuestPlay.currentVersion);
	Materialize.updateTextFields();
}));