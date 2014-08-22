/**
 * Created by v-jiangz on 8/15/2014.
 */
morn.ready(function(){
    morn("#article-toolkit .icon-lock").click(function(){

    });

    morn("#article-toolkit .icon-trash").click(function(e){
        if (confirm("Would you confirm to delete it?")) {

        } else {
            morn.event(e).preventDefault();
        }
    });
    var link = morn("article-toolkit .icon-link").get(0);
    if (link) {
        link.innerHTML = window.location.href;
    }
    morn("#comment-it").click(function(e){
        morn.event(e).preventDefault();

        var email = morn("#comment-email").get(0).value;
        if (! /[a-zA-Z0-9_]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?!([a-zA-Z0-9]*\.[a-zA-Z0-9]*\.[a-zA-Z0-9]*\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/.test(email)){
            alert('Email is incorrected.');
            return;
        }
        var content = morn("#comment-content").get(0).value;
        if (content === ''){
            alert('Content is empty.');
            return;
        }
        var username = morn("#comment-username").get(0).value;
        if (! /^[\w\d\s]*$/.test(username)){
            alert('Some unexpected characters appear in username');
            return;
        }
        morn.post('/api/comment/add/' + morn("#post-id").get(0).value, {
            username: username,
            content: content,
            email: email
        }, function(data){
            data = JSON.parse(data);
            var newComment = morn.createDom('<li class="comment"><img class="comment-header" src="http://www.gravatar.com/avatar/' + data.result.header + '"><div class="comment-user">' + data.result.username + '</div><div class="comment-content">' + data.result.content + '</div></li>');
            morn("#comment-list").append(newComment);
            alert(data.msg);
        });
    });

});