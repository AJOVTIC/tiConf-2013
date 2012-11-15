
//TODO
/*Ti.Android || (window.opacity = 0, 
    window.transform = Ti.UI.create2DMatrix().scale(0));*/

/*var view = Ti.UI.createView({
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
    backgroundColor: "#52D3FE",
    border: 10,
    borderColor: "#52D3FE",
    borderRadius: 10,
    borderWidth: 4,
    zIndex: -1
});*/

/*var closeLabel = Ti.UI.createButton({
    font: {
        fontSize: 11,
        fontWeight: "bold"
    },
    backgroundColor: "#52D3FE",
    borderColor: "#52D3FE",
    color: "#fff",
    style: 0,
    borderRadius: 6,
    title: "X",
    top: 8,
    right: 8,
    width: 30,
    height: 30
});

closeLabel.addEventListener("click", function() {
	window.close();
});*/

// window.open();

$.close.on("click", function() {
    $.getView().close();
});

$.getView().open();

/*window.add(view),
window.add(closeLabel);
*/

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