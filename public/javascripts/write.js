morn.ready(function(){
    morn("#submit-post").click(function(){
        var title = morn("#new-title").get(0).value;
        var content = morn("#content-editor").get(0).innerText;
        morn("#new-content").get(0).value = content;
        morn("#new-post").get(0).submit();
    });
});
