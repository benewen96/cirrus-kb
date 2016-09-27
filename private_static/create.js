/*
  eslint-env browser
  exported save
*/

const simplemde = new SimpleMDE({
  element: $('#mdeditor')[0],
  autosave: {
    enabled: false,
  },
});

const save = () => {
  const markdown = simplemde.value();
  const jsonData = {
    markdown,
    author: $('#author').val(),
    title: $('#article_title').val(),
    tags: $('#tags').val(),
  };

  if (markdown) {
    $('#save').text('Thanks!');
    $('#save').attr('class', 'btn btn-success btn-block disabled');
    $.ajax({
      // our endpoint in routes for creating a new record
      url: '/create',
      type: 'POST',
      // data is a JSON object that will contain our markdown
      data: jsonData,
      success(data) {
        window.location.replace(`/browse/${data.id}`);
      },
      error(data) {
        console.log(data);
      },
    });
  }
};


$(document).ready(() => {
  simplemde.codemirror.on('change', () => {
    $('#save').text('Save');
    $('#save').attr('class', 'btn btn-normal btn-block');
  });
  // save event listener
  $('#save').click(() => {
    save();
  });
});
