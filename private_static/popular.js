// this ajax request gets all the popular articles from salesforce
// see routes for /json for how
$.ajax({
  url: '/popular', // This URL is for Json file
  type: 'GET',
  dataType: 'json',

  success(data) {
    data.forEach((article) => {
      $('#popular').append(
      `<dd class='nav-item'><a href='/browse/${article.id}'</a>${article.title}</dd>`
      );
    });
  },
  error() {
        // hopefully nothing here :)
  },
});
