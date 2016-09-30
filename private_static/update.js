$('#salesforce').on('click', () => {
  window.open('{{url}}');
});

$('#edit').on('click', () => {
  $('#edit').hide();
  $('#article').empty();
  $('#article').removeAttr('class');

  $('#article').html(
  `<div class='row'>
		<div class="col-md-6" style='padding-bottom:20px'>
      <input type="text"  id='article_title' class="form-control" value='{{name}}'>
    </div>
		<div class="col-md-6" style='padding-bottom:20px'>
      <input type="text"  id='author' class="form-control" value="{{author}}">
    </div>
  </div>


		<!--Text area for markdown editor -->
		<textarea id='mdeditor'></textarea>


		<div class='' style='width:20%;float:right;'>
			<!--Save button -->
			<button id='save' type="button" class="btn btn-normal btn-block">Save</button>
		</div>
  `
  );
  // create a new markdown editor
  const simplemde = new SimpleMDE({
    element: $('#mdeditor')[0],
    autosave: {
      enabled: false,
    },
  });
  console.log();
  simplemde.value('{{rawArticle}}');
});
