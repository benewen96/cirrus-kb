/*
  eslint-env browser
  exported save
*/

// create a new markdown editor
const simplemde = new SimpleMDE({
  element: $('#mdeditor')[0],
  autosave: {
    enabled: false,
  },
});

// called when user hits save button
const save = () => {
  // get markdown from editor
  const markdown = simplemde.value();
  // wrap user input into json
  const jsonData = {
    markdown,
    author: $('#author').val(),
    title: $('#article_title').val(),
  };
  // make sure we had some markdown to add
  if (markdown) {
    // update save button and disable it until user edits
    $('#save').text('Thanks!');
    $('#save').attr('class', 'btn btn-success btn-block disabled');
    // send ajax request to /create see routes for more info
    $.ajax({
      // our endpoint in routes for creating a new record
      url: '/create',
      type: 'POST',
      // data is a JSON object that will contain our markdown
      data: jsonData,
      // post request returns success object from jsforce that contains id of record
      success(data) {
        // now we know record id, redirect user to their article
        window.location.replace(`/browse/${data.id}`);
      },
      error(data) {
        // hopefully nothing here :)
        console.log(data);
      },
    });
  }
};

$(document).ready(() => {
  $('#salesforce').on('click', () => {
    window.open($('#url').text());
  });

  // if the markdown has been edited, allow the user to save
  simplemde.codemirror.on('change', () => {
    $('#save').text('Save');
    $('#save').attr('class', 'btn btn-success btn-block');
  });
  // save event listener
  $('#save').click(() => {
    save();
  });
});
