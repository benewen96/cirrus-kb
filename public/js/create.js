var simplemde = new SimpleMDE({
	element: $("#mdeditor")[0],
	autosave: {
		enabled: false
	}
});

var save = function() {
	var markdown = simplemde.value();

	if(markdown) {
		console.log(markdown);
		$.ajax({
			url: "/create",   //our endpoint in routes for creating a new record
			type: 'POST',
			dataType: "json",
			//data is a JSON object that will contain our markdown
			data: {
				'markdown' : markdown
			}
		});
	}
}
