var socket = io();

function scrollToBottom() {
  //scroll bottom with animation
  jQuery('#messages').animate({ scrollTop: jQuery('#messages').prop("scrollHeight") }, 1000);
}

socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
    else {
      //submit click event listener
      jQuery('#message-form').on('submit', function (e) {
        e.preventDefault();

        socket.emit('createMess', {
          from: params.userName,
          text: jQuery("[name=message]").val(),
          chat: params.roomName
        });
        //empty the text right after sending the message
        jQuery("[name=message]").val('');
      });
    }
  });


});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users){
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user){
    ol.append(jQuery(`<li> ${user} </li>`))
  });
  jQuery('#users').html(ol);
});

socket.on('newMess', function (message) {
  var params = jQuery.deparam(window.location.search);
  console.log('newMessage', message);
  var time = message.createdAt;
  //create li object for messages
  if(message.from === params.userName || message.from === "Admin"){
    var li = jQuery(`<li class="message sent"> <span id="sender-name">${message.from}</span> <br> ${message.text} <span class="metadata"> <span class="time">${time}</span></sapn> </li> <br style="clear:both" />`);
  }
  else{
    var li = jQuery(`<li class="message received"> <span id="sender-name">${message.from}</span> <br> ${message.text} <span class="metadata"> <span class="time">${time}</span></sapn> </li> <br style="clear:both" />`);
  }
  //save it and parse it to the client
  jQuery('#messages').append(li);
  //scroll on new message
  scrollToBottom();
});