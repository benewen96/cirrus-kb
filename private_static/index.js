// this ajax request gets all the top contributors to the kb from salesforce
// see routes for /contributors for how
$.ajax({
  url: '/contributors',
  type: 'GET',
  dataType: 'json',
  // get returns top contributors
  success(data) {
    // for each contributor...
    for (const cont in data) {
      // for in safe-guard
      if ({}.hasOwnProperty.call(data, cont)) {
        // append the list of contributors
        $('#contributors').append(
        `<tr>
          <td>${cont}</td>
          <td>${data[cont]}</td>
        </tr>`
        );
      }
    }
    // Now we have ajax, init datatable, sort by contributions
    $('#top_cont').DataTable({
      order: [1, 'desc'],
      sDom: '',
    });
  },
  error() {
        // hopefully nothing here :)
  },
});

// this ajax request gets the most popular articles in the kb from salesforce
// see routes for /popular for how
$.ajax({
  url: '/popular',
  type: 'GET',
  dataType: 'json',

  success(data) {
    // data is the popular articles
    // for each popular article...
    data.forEach((article) => {
      // append the list of popular articles
      $('#popular_articles').append(
      `<a href="/browse/${article.id}" class="list-group-item">
      <h4 class="list-group-item-heading">${article.title}</h4>
      <p class="list-group-item-text">By ${article.author}</p>
      </a>`
      );
    });
  },
  error() {
        // hopefully nothing here :)
  },
});
