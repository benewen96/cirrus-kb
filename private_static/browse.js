// tell lunr our data model
const articles = lunr(function construct() {
  this.field('title', { boost: 10 });
  this.field('category', { boost: 7 });
  this.field('author');
  this.field('article');
  this.ref('id');
});

// store is a key value storage to get articles in O(1) time
const store = {};


showCategories();

// this ajax request gets the most popular articles in the kb from salesforce
// see routes for /popular for how
function showCategories() {
  $('#article_list').empty();
  $.ajax({
    url: '/json',
    type: 'GET',
    dataType: 'json',

    success(data) {
      // data is the popular articles
      // for each popular article...
      for (const category in data.categories) {
      // for in guard
        if ({}.hasOwnProperty.call(data.categories, category)) {
          $('#article_list').append(`
          <div class="panel panel-default">
            <div class="panel-heading">${category}</div>
            <div class="list-group" id='${category}_articles'>
            </div>
          </div>
          `);

          $.ajax({
            url: `/category/${category}`,
            type: 'GET',
            dataType: 'json',

            success(results) {
              results.forEach((article) => {
                $(`#${category}_articles`).append(
                `<a href="/browse/${article.id}" class="list-group-item">
                <h4 class="list-group-item-heading">${article.title}</h4>
                <p class="list-group-item-text">By ${article.author}</p>
                <p class="list-group-item-text"><i>${article.category}</i></p>
                </a>`
                );
              });
            },
          });
        }
      }

      // for each kb entry
      data.articles.forEach((entry) => {
        // add each entry into the lunr engine for tokenisation and indexing
        articles.add({
          id: entry.id,
          title: entry.title,
          author: entry.author,
          article: entry.article,
          category: entry.category,
        });
        // to be able to get O(1) lookup, add each entry to store object with id
        // means if we know id from lunr, can go store[id] to get entry instantly
        store[entry.id] = {
          id: entry.id,
          title: entry.title,
          author: entry.author,
          article: entry.article,
          time: entry.time,
          category: entry.category,
        };
      });
    },
    error() {
          // hopefully nothing here :)
    },
  });
}

// if the search fields input changes (i.e. someone typed in it)
$('#searchfield')
  .on('keyup change', () => {
    // if the value is empty, clear and show the original list
    if ($('#searchfield').val() === '') {
      showCategories();
    } else {
      $('#article_list').empty();
      // lunr will search all articles for the current search value
      const res = articles.search($('#searchfield').val());
      // for each search result
      res.forEach((result) => {
        // append the article list with each entry
        $('#article_list').append(
        `<a id="${store[result.ref].id}"href="/browse/${store[result.ref].id}" class="list-group-item">
        <h4 class="list-group-item-heading">${store[result.ref].title}</h4>
        <p class="list-group-item-text"><i>${store[result.ref].category}</i></p>
        <p class="list-group-item-text">By ${store[result.ref].author}</p>
        </a>`
        );
      });
    }
  });
