// this ajax request gets all the knowledge base articles from salesforce
// see routes for /json for how
$.ajax({
  url: '/contributors', // This URL is for Json file
  type: 'GET',
  dataType: 'json',
  // get returns all entries from kb
  success(data) {
    console.log(data);
    for (const cont in data) {
      if ({}.hasOwnProperty.call(data, cont)) {
        $('#contributors').append(
        `<tr>
          <td>${cont}</td>
          <td>${data[cont]}</td>
        </tr>`
        );
      }
    }
    $('#top_cont').DataTable({
      order: [1, 'desc'],
      sDom: '',
    });
  },
  error() {
        // hopefully nothing here :)
  },
});


$.ajax({
  url: '/popular', // This URL is for Json file
  type: 'GET',
  dataType: 'json',

  success(data) {
    console.log(data);
    data.forEach((article) => {
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
