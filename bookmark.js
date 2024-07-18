var bookmark = (function(){
  list = [];
  //Event Saving to Local Storage
  function setBookmark(){
    localStorage.setItem('bookmark', JSON.stringify(list));
  }

  function loadBookmark() {
    list = JSON.parse(localStorage.getItem('bookmark'));
  }

  if (localStorage.getItem("bookmark") != null) {
    loadBookmark();
  }

  obj = {};
  //Clear Bookmark
  obj.clearALL = function() {
    list = [];
    setBookmark();
  }
  //Remove Bookmark    
  obj.removeThisItem = function(id) {
    for(var item in list) {
      if(list[item].id === id) {
        list.splice(item, 1);
        break;
      }
    }
    setBookmark();
  }
  return obj;
})();

function displayIt(){
  var getData = JSON.parse(localStorage.getItem('bookmark'));
  var hasBookmarks = getData && getData.length > 0;

  if (hasBookmarks) {
    // Sort bookmarks by updated date
    getData.sort(function(a, b) {
      var dateA = new Date(a.updated).getTime();
      var dateB = new Date(b.updated).getTime();
      return dateB - dateA;
    });

    // Bookmark is not empty, display bookmarks
    $('.showBookmark').show(); // Show the bookmark content
    $('.empty-bookmark').hide(); // Hide the empty bookmark message
    
    var structure = '';
    for(var i in getData){
      structure += '<article class="boxy">'
               + '<div id="'+getData[i].id+'" class="bsx">'
               + '<a href="'+getData[i].link+'" itemprop="url" title="'+getData[i].name+'">'+getData[i].name+'</a>'
               + '<div class="adds"><script expr:src=\'"/feeds/posts/summary/-/" + data:post.title + "?start-index=2&alt=json-in-script&callback=chapter&max-results=1\'></script></div>'
               + '<div class="typez"><span class="epx '+getData[i].type+'">'+getData[i].type+'</span></div>'
               + '<div class="bt"><span class="epx '+getData[i].status+'">'+getData[i].status+'</span></div>'
               + '<img src="'+getData[i].img+'" itemprop="image" title="'+getData[i].name+'" alt="'+getData[i].name+'"></div>'
               + '<div class="btnRemove" data-id="'+getData[i].id+'"><svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path fill="currentColor" d="M216 48h-36V36a28 28 0 0 0-28-28h-48a28 28 0 0 0-28 28v12H40a12 12 0 0 0 0 24h4v136a20 20 0 0 0 20 20h128a20 20 0 0 0 20-20V72h4a12 12 0 0 0 0-24ZM100 36a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v12h-56Zm88 168H68V72h120Zm-72-100v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0Zm48 0v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0Z"/></svg></div></article>';
    }
    $('.showBookmark').html(structure);
    $('#bookmarkedItemCount').show(); // Show the bookmark count
  } else {
    // Bookmark is empty, display a message
    $('.showBookmark').hide(); // Hide the bookmark content
    $('.empty-bookmark').show(); // Show the empty bookmark message
    $('#bookmarkedItemCount').hide(); // Hide the bookmark count
  }

  $('#bookmarkedItemCount').text('Bookmarked: ' + (getData ? getData.length : 0));
}
$('.clearAll').click(function(){
  bookmark.clearALL();
  displayIt();
});

$('.showBookmark').on("click", ".btnRemove", function(event) {
  bookmark.removeThisItem($(this).data('id'));
  displayIt();
});
displayIt();

// Chapter function
function chapter(e) {
  for (var t = 0; t < e.feed.entry.length; t++) {
    for (var n = 0; n < e.feed.entry[t].link.length; n++) {
      if ("alternate" == e.feed.entry[t].link[n].rel) {
        posturl = e.feed.entry[t].link[n].href;
        break;
      }
    }
    var title = e.feed.entry[t].title.$t;
    var chapterNumber = extractNumberFromTitle(title);
    var formattedChapter = "Chapter " + chapterNumber;
    var l = '<a class="fs-13 fw-500 adds" href="' + posturl + '">' + formattedChapter + "</a>";
    document.write(l);
  }
}

function extractNumberFromTitle(title) {
  var matches = title.match(/\d+/);
  if (matches && matches.length > 0) {
    return matches[0];
  }
  return "...";
}
