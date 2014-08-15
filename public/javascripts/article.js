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

    morn(".icon-link").get(0).innerHTML = window.location.href;
});