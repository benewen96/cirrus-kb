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
    category: $('#category').val(),
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

function split(val) {
  return val.split(/,\s*/);
}
function extractLast(term) {
  return split(term).pop();
}


function getCategories(handleData) {
  $.ajax({
  // our endpoint in routes for creating a new record
    url: '/json',
    type: 'GET',
  // data is a JSON object that will contain our markdown
  // post request returns success object from jsforce that contains id of record
    success(data) {
      handleData(data.categories);
    },
    error(data) {
    // hopefully nothing here :)
      console.log(data);
    },
  });
}
getCategories((categories) =>
  return categories;
});

$('#category')
  // don't navigate away from the field on tab when selecting an item
  .on('keydown', function (event) {
    console.log('tedf');
    if (event.keyCode === $.ui.keyCode.TAB &&
        $(this).autocomplete('instance').menu.active) {
      event.preventDefault();
    }
  })
  .autocomplete({
    minLength: 0,
    source(request, response) {
      // delegate back to autocomplete, but extract the last term
      response($.ui.autocomplete.filter(
        cats, extractLast(request.term)));
    },
    focus() {
      // prevent value inserted on focus
      return false;
    },
    select(event, ui) {
      const terms = split(this.value);
      // remove the current input
      terms.pop();
      // add the selected item
      terms.push(ui.item.value);
      // add placeholder to get the comma-and-space at the end
      terms.push('');
      this.value = terms.join(', ');
      return false;
    },
  });
