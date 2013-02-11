
function showError() {
	alert(L('loginErrorText'));
}

$.firstName.hintText = L('firstName');
$.lastName.hintText = L('lastName');
$.email.hintText = L('email');

//iOS needs a little extra space on field focus for logins to dodge the sw keyboard...
//Alloy will actually optimize this out at compile time for Android and mobile web...
if (OS_IOS) {

	var isAnimated = false;

	function doScroll(val) {
		if (!Alloy.isTablet) {
			if (!isAnimated) {
				$.index.animate({
					top: $.index.getRect().y + val,
					duration: 300
				});
			}
		}
	}
	
	function moveScrollerUp() {
		doScroll(-180);
		isAnimated = true;
	}
	
	function moveScrollerDown() {
		isAnimated = false;
		doScroll(180);
	}
	
	if(Ti.Platform.displayCaps.platformHeight > 480){
		$.index.backgroundImage = '/img/login/login-568h@2x.png'
	}
	
	$.firstName.on('focus', moveScrollerUp);
	$.firstName.on('return', moveScrollerDown);
	$.lastName.on('focus', moveScrollerUp);
	$.lastName.on('return', moveScrollerDown);
	$.email.on('focus', moveScrollerUp);
	$.email.on('return', moveScrollerDown);
	
}