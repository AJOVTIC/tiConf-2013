var ui = require('ui'),
	// Status = require('Status'),
	// User = require('User'),
	// Cloud = require('ti.cloud'),
	currentBlob = null;

var Twitter = require('TwitterPost')
	
$.loading = Alloy.createController('loading');

//Bubble focus event
$.post.on('focus', function(e) {
	$.trigger('focus', e);
});

$.post.on('blur', function(e) {
	$.trigger('blur', e);
});

//Expose TextArea focus
$.focus = function() {
	$.post.focus();
};

$.blur = function() {
	$.post.blur();
};

//Handle image attachment
$.camera.on('click', function() {
	//for now, need to disable "choose from gallery" for android
	var options = [L('camera')];
	if (OS_IOS) {
		options.push(L('photoGallery'));
	}
	options.push(L('cancel'));
	
	var od = Ti.UI.createOptionDialog({
		options:options,
		cancel:options.length > 2 ? 2 : 1,
		title:L('attachPhoto')
	});
	
	od.addEventListener('click', function(e) {
		var callbacks = {
			success: function(e) {
				currentBlob = e.media;
				$.preview.image = currentBlob;
				$.camera.animate({
					opacity:0,
					duration:250
				}, function() {
					$.imagePreview.visible = true;
					$.imagePreview.animate({
						opacity:1,
						duration:250
					});
					updateCount();
				});
			},
			error: function(e) {
				alert(L('mediaErrorText'));
			}
		};
		
		//decide which media API to call
		if (e.index === 0) {
			Ti.Media.showCamera(callbacks);
		}
		else if (e.index === 1 && options.length > 2) {
			Ti.Media.openPhotoGallery(callbacks);
		}
	});

	if (OS_IOS) {
		od.show({
			view: $.camera
		});
	}
	else {
		od.show();
	}

});

$.deleteButton.on('click', function() {
	$.imagePreview.animate({
		opacity:0,
		duration:250
	}, function() {
		$.camera.animate({
			opacity:1,
			duration:250
		}, function() {
			$.imagePreview.visible = false;
			$.preview.image = '';
			currentBlob = null;
			updateCount();
		});
	});
});

//Track character count
var tag = ' ' + L('hashtag');
var tagCount = tag.length;
var count = 140 - tagCount; //tweet minus hashtag
var startNumber = count;

function updateCount() {
	count = startNumber - $.post.value.length;
	if (count <= 15) {
		$.characters.color = (count >= 0) ? '#000' : '#f00';
		$.characters.text = count;
	}
	else {
		$.characters.text = '';
	}
}

$.post.on('change', updateCount);

//track social post status, don't be done til these come back
$.submit.on('click', function() {
	var val = $.post.value;
	if (val) {
		
		//exit if content is not valid - TODO: put in better validation and feedback
		if (count < 0) {
			alert(L('tooLongMessage'));
			return;
		}
		
		var tweet = val + tag;

		Ti.API.info('Tweet: ' + tweet);

		$.postContainer.add($.loading.getView());
		$.loading.start();

		Twitter.tweet(
			tweet,
			function(success) {
				$.loading.stop();
				$.postContainer.remove($.loading.getView());
				if (success) {
					$.trigger('success');
					alert('Tweeted succesfully!');
				}
				else {
					alert('Error happend, sorry!');
				}
			},
			currentBlob
		);
	}
});

//Reset UI for next post
/*$.reset = function() {
	//reset social
	fbOn = false;
	$.facebook.backgroundImage = '/img/post/btn-facebook-off.png';
	twitterOn = false;
	$.twitter.backgroundImage = '/img/post/btn-twitter-off.png';
	
	//reset post
	$.post.value = '';
	count = 140;
	$.characters.text = count;
	$.characters.visible = false;
	
	//reset image
	currentBlob = null;
	$.imagePreview.visible = false;
	$.imagePreview.opacity = 0;
	$.preview.image = '';
	$.camera.opacity = 1;
};*/

