$(function(){
  function buildHTML(message) {
    var html = `<div class="messages__message" data-message-id=${message.id}>
    <div class="messages__message__user">
    <div class="messages__message__user__name">
    ${message.user}
    </div>
    <div class="messages__message__user__time">
    ${message.time}
    </div>
    </div>
    <div class="messages__message__text">
    ${message.text}
    </div>`;
    if (message.image){
      html  += `<img class="messages__message__image" src=${message.image}>
      </div>`
    } else {
      html += `</div>`
    };
    return html;
  }
  
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action')
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.main-chat__messages').append(html);
      $('.main-chat__messages').animate({ scrollTop: $('.main-chat__messages')[0].scrollHeight});
      $('#new_message')[0].reset();
      $('.form__box__submit').prop('disabled', false);
    })
    .fail(function(){
      alert("メッセージ送信に失敗しました");
      $('.form__box__submit').prop('disabled', false);
    })
  })
  
  var reloadMessages = function() {
    var last_message_id = $('.messages__message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0 ){
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.main-chat__messages').append(insertHTML);
        $('.main-chat__messages').animate({ scrollTop: $('.main-chat__messages')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
})