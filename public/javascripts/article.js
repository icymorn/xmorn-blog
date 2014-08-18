/**
 * Created by v-jiangz on 8/15/2014.
 */
morn.ready(function(){
    morn(".icon-lock").click(function(){

    });

    morn(".icon-trash").click(function(e){
        if (confirm("Would you confirm to delete it?")) {

        } else {
            morn.event(e).preventDefault();
        }
    });
    var link = morn(".icon-link").get(0);
    if (link) {
        link.innerHTML = window.location.href;
    }
    morn("#comment-it").click(function(e){
        morn.event(e).preventDefault();

        morn.post('/api/comment/add/' + morn("#post-id").get(0).value, {
            username: morn("#comment-username").get(0).value,
            content: morn("#comment-content").get(0).value,
            email: morn("#comment-email").get(0).value
        }, function(data){

        });
    });

});