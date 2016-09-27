// tell lunr our data model
const articles = lunr(function construct() {
  this.field('title', { boost: 10 });
  this.field('author');
  this.field('article');
  this.ref('id');
});

// store is a key value storage to get articles in O(1) time
const store = {};

// if the search fields input changes (i.e. someone typed in it)
$('#searchfield')
  .on('keyup change', () => {
    // if the value is empty, clear and show the original list
    if ($('#searchfield').val() === '') {
      $('#article_list').empty();
      // for...in lets us iterate over an enumerable property
      // this is because store isn't an array (due to wanting to access in O(1))
      for (const article in store) {
        // for in guard
        if ({}.hasOwnProperty.call(store, article)) {
          // append the article list with each entry
          $('#article_list').append(
          `<a href="/browse/${store[article].id}" class="list-group-item">
          <h4 class="list-group-item-heading">${store[article].title}</h4>
          <p class="list-group-item-text">By ${store[article].author}</p>
          </a>`
          );
        }
      }
    } else {
      $('#article_list').empty();
      // lunr will search all articles for the current search value
      const res = articles.search($('#searchfield').val());
      // for each search result
      res.forEach((result) => {
        // append the article list with each entry
        $('#article_list').append(
        `<a href="/browse/${store[result.ref].id}" class="list-group-item">
        <h4 class="list-group-item-heading">${store[result.ref].title}</h4>
        <p class="list-group-item-text">By ${store[result.ref].author}</p>
        </a>`
        );
      });
    }
  });

// this ajax request gets all the knowledge base articles from salesforce
// see routes for /json for how
$.ajax({
  url: '/json', // This URL is for Json file
  type: 'GET',
  dataType: 'json',
  // post returns all entries from kb
  success(data) {
    // for each kb entry
    data.forEach((entry) => {
      // add each entry into the lunr engine for tokenisation and indexing
      articles.add({
        id: entry.id,
        title: entry.title,
        author: entry.author,
        article: entry.article,
      });
      // to be able to get O(1) lookup, add each entry to store object with id
      // means if we know id from lunr, can go store[id] to get entry instantly
      store[entry.id] = {
        id: entry.id,
        title: entry.title,
        author: entry.author,
        article: entry.article,
        time: entry.time,
      };
    });
  },
  error() {
        // hopefully nothing here :)
  },
});
