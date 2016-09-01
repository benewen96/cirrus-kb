var getRecord(kbId) {
  jQuery.ajax({
      url: "/create" + kbId, //This URL is for Json file
      type:"GET",
      dataType: "html",
      success: function(data) {
          iterateJson(data);
      },
      error: function() {
          //Do alert is error
      }
  });
}
