
$.close.on("click", function() {
    $.getView().close();
});

if (!Ti.Android) {
    var tooBig = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix().scale(1.1),
        opacity: 1,
        duration: 350
    });

    var shrinkBack = Ti.UI.createAnimation({
        transform: Ti.UI.create2DMatrix(),
        duration: 400
    });
    tooBig.addEventListener("complete", function() {
        $.getView().animate(shrinkBack);
    }), $.getView().animate(tooBig);
}