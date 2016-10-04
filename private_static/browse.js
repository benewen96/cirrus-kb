// tell lunr our data model
const articles = lunr(function construct() {
  this.field('title', { boost: 10 });
  this.field('category', { boost: 7 });
  this.field('author');
  this.field('article');
  this.ref('id');
});

const store = {};

// *** PRELOADER ***
let loadingStatus = 0;
$(document)
  .ajaxStart(() => {
  })
  .ajaxStop(() => {
    $('#loadingbar').attr('style', 'width: 100%');
    $('#loading').slideUp(600, () => {
    });
  })
  .ajaxComplete(() => {
    loadingStatus += 20;
    $('[id$=_articles]').fadeIn('slow');
    $('#loadingbar').attr('style', `width: ${loadingStatus}%`);
  });
//* * END **/

getKnowledgeBase();

function renderCategories(categories) {
  $('#article_list').empty();

  for (const category in categories) {
    $('#article_list').append(`
     <div class="panel panel-default">
       <div class="panel-heading">${category}</div>
       <div class="list-group" id='${category}_articles'>
       </div>
     </div>
     `);
    categories[category].forEach((articleId) => {
      $(`#${category}_articles`).append(
           `<a href="/browse/${store[articleId].id}" class="list-group-item">
             <h4 class="list-group-item-heading">${store[articleId].title}</h4>
             <p class="list-group-item-text">By ${store[articleId].author}</p>
             <p class="list-group-item-text"><i>${store[articleId].category}</i></p>
           </a>`
           );
      $(`#${store[articleId].category}_articles`).hide();
    });
  }
}

function getKnowledgeBase() {
  $.ajax({
    url: '/json',
    type: 'GET',
    dataType: 'json',

    success(data) {
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
      renderCategories(data.categories);
    },
    error() {
          // hopefully nothing here :)
    },
  });
}


function rerender() {
  $('#article_list').empty();
  // data is the popular articles
  // for each popular article...


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

// if the search fields input changes (i.e. someone typed in it)
$('#searchfield')
  .on('keyup', () => {
    if ($('#searchfield').val() === '') {
      renderCategories();
    } else {
      rerender();
    }
  });
