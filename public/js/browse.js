const articles = lunr(function () {
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

      const res = articles.search($('#searchfield').val());
      res.forEach((result) => {
        $('#article_list').append(
        `<a href="/browse/${store[result.ref].id}" class="list-group-item">
        <h4 class="list-group-item-heading">${store[result.ref].title}</h4>
        <p class="list-group-item-text">By ${store[result.ref].author}</p>
        </a>`
        );
      });
    }
  });

$.ajax({
  url: '/json', // This URL is for Json file
  type: 'GET',
  dataType: 'json',
  success(data) {
    data.forEach((entry) => {
      articles.add({
        id: entry.id,
        title: entry.title,
        author: entry.author,
        article: entry.article,
      });

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
        // Do alert is error
  },
});
