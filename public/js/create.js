var simplemde = new SimpleMDE({
	element: $("#mdeditor")[0],
	autosave: {
		enabled: false
	}
});
$( document ).ready(function() {
	simplemde.codemirror.on("change", function(){
		$('#save').text('Save')
		$('#save').attr('class', 'btn btn-normal btn-block');
	});
});

var save = function() {
	var markdown = simplemde.value();

	if(markdown) {
		$('#save').text('Thanks!')
		$('#save').attr('class', 'btn btn-success btn-block disabled');
		console.log(markdown);
		$.ajax({
			url: "/create",   //our endpoint in routes for creating a new record
			type: 'POST',
			dataType: "json",

			//data is a JSON object that will contain our markdown
			data: {
				'markdown' : markdown
			},
			success: function () {
				console.log('success!');

    	}
		});
	}
}
