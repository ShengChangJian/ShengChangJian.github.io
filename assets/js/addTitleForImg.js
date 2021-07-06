  $("img").each(function () {
    var title = $(this).attr("title");
    if (title != undefined) {
      var boardp_style = "style='display: block; text-align: center; color: #969696;padding: 10px;border-bottom: 1px solid #d9d9d9;margin: 0 auto;" +
        "width: " + ($(this).width() * 0.8) + "px;" +
        "height: 28px;" +
        "'>";
      var boardp = "<p " + boardp_style + title + "</p";
      $(this).after(boardp);
    }
  });
