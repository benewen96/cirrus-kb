// tell lunr our data model
const articles = lunr(function construct() {
  this.field('title', { boost: 10 });
  this.field('category', { boost: 7 });
  this.field('author');
  this.field('article');
  this.ref('id');
});

const store = {};
const categories = [];
// *** PRELOADER ***
let loadingStatus = 0;
$(document)
  .ajaxStart(() => {
    console.log('ajaxing...');
    // $('#mainContainer').hide();
    $('[id$=_articles]').hide();
  })
  .ajaxStop(() => {
    console.log('ajaxed!');
    $('#loadingbar').attr('style', 'width: 100%');
    $('#loading').slideUp(600, () => {
      // $('#mainContainer').fadeIn('slow');

    });
  })
  .ajaxComplete(() => {
    loadingStatus += 20;
    console.log(loadingStatus);
    $('#loadingbar').attr('style', `width: ${loadingStatus}%`);
  });
//* * END **/

getKnowledgeBase();


function getCategory(callback, category) {
  $.ajax({
    url: `/category/${category}`,
    type: 'GET',
    dataType: 'json',

    success(data) {
      callback(data);
      $('[id$=_articles]').fadeIn('slow');
    },
  });
}

function renderCategories() {
  console.log(categories);
  $('#article_list').empty();
  categories.forEach((category) => {
    $('#article_list').append(`
       <div class="panel panel-default">
         <div class="panel-heading">${category}</div>
         <div class="list-group" id='${category}_articles'>
         </div>
       </div>
       `);

    getCategory((data) => {
      data.forEach((article) => {
        $(`#${article.category}_articles`).append(
         `<a href="/browse/${article.id}" class="list-group-item">
           <h4 class="list-group-item-heading">${article.title}</h4>
           <p class="list-group-item-text">By ${article.author}</p>
           <p class="list-group-item-text"><i>${article.category}</i></p>
         </a>`
         );
        $(`#${article.category}_articles`).hide();
      });
    }, category);
  });
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
      for (const category in data.categories) {
        categories.push(category);
      }
      renderCategories();
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
      console.log('empty!');
      renderCategories();
    } else {
      rerender();
    }
  });
