var articles = lunr(function () {
    this.field('title', {boost: 10})
    this.field('author')
    this.field('article')
    this.ref('id')
  });

var store = {};
var results = {};

$('#searchfield')
  .on('keyup change', function() {

    var res = articles.search($('#searchfield').val());
    $('#article_list').empty();
    res.map((result) => {
      console.log(store[result.ref]);
      $("#article_list").append(`<li><a href="/browse/${store[result.ref].id}">${store[result.ref].title}</a></li>`);
    });
  });

$.ajax({
    url: "/json", //This URL is for Json file
    type:"GET",
    dataType: "json",
    success: function(data) {
      data.forEach((entry) => {
        articles.add({
          id: entry.id,
          title: entry.title,
          author: entry.author,
          article: entry.article
        });

        store[entry.id] = {
          id: entry.id,
          title: entry.title,
          author: entry.author,
          article: entry.article
        };

      });
    },
    error: function() {
        //Do alert is error
    }
});
