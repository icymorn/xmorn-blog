/**
 * Created by v-jiangz on 8/15/2014.
 */
morn.ready(function(){
    morn("#submit-post").click(function(){
        var title = morn("#update-title").get(0).value;
        var content = morn("#content-editor").get(0).innerText;
        morn("#update-content").get(0).value = content;
        morn("#update-post").get(0).submit();
    });
});