$(function(){
  function buildHTML(message) {
    var html = `<div class="messages__message">
                  <div class="messages__message__user">
                    <div class="messages__message__user__name">
                      ${message.user.name}
                    </div>
                    <div class="messages__message__user__time">
                      ${message.time}
                    </div>
                  </div>
                  <div class="messages__message__text">
                    ${message.text}`
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
    $('.form__box__top__text').val('');
    $('.form__box__top__image').val('');
    $('.form__submit').prop('disabled', false);
  })
  .fail(function(){
    alert('error');
  })
})
})


