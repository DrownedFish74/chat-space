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
    })
  })
  
  var reloadMessages = function() {
    //カスタムデータ属性を利用し、ブラウザに表示されている最新メッセージのidを取得
    var last_message_id = $('.messages__message:last').data("message-id");
    $.ajax({
      //ルーティングで設定した通り/groups/id番号/api/messagesとなるよう文字列を書く
      url: "api/messages",
      //ルーティングで設定した通りhttpメソッドをgetに指定
      type: 'get',
      dataType: 'json',
      //dataオプションでリクエストに値を含める
      data: {id: last_message_id}
    })
    .done(function(messages) {
      //追加するHTMLの入れ物を作る
      if (messages.length !== 0 ){
        var insertHTML = '';
        //配列messagesの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        //メッセージが入ったHTMLに、入れ物ごと追加
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