//code editor
let editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: 'javascript',
  lineNumbers: true,
  theme: "blackboard"
});
//variables
let socket = io.connect();
let play = document.getElementById('play');
let link = document.getElementById('link');
let run = document.getElementById('run');
let download = document.getElementById('download');
//when click on download
download.addEventListener('click', function () {
  window.open("http://localhost:3000/download");
});
//when click on run
run.addEventListener('click', function () {
  socket.emit('code', {
    code: editor.getValue()
  });
  

  window.open('http://localhost:3000/test');
  
});
//converting video into embeded link so that we can embed in modal
function createYouTubeEmbedLink(link) {
  embed = link.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
  return embed;
}
//modal code
$(function () {
  $(".video").click(function () {
    var theModal = $(this).data("target"),
      videoSRC = createYouTubeEmbedLink($('#link').val()),
      videoSRCauto = videoSRC + "?modestbranding=1&rel=0&controls=0&showinfo=0&html5=1&autoplay=1";
    $(theModal + ' iframe').attr('src', videoSRCauto);
    $(theModal + ' button.close').click(function () {
      $(theModal + ' iframe').attr('src', videoSRC);
    });
  });
});
//when we click on play to playyoutube video
play.addEventListener('click', function () {
  socket.emit('url', {
    url: link.value
  })
});
//sockets
socket.on('url', function (data) {
  $('#link').val(data.url);
  $('.video').click();
});
socket.on('refresh', function (data) {
  editor.setValue(data.body); 
});
socket.on('change', function (data) {
  console.log(data);
  editor.replaceRange(data.text, data.from, data.to);
});
editor.on('change', function (i, op) {
  console.log(op);
  socket.emit('change', op);
  socket.emit('refresh', editor.getValue());
});