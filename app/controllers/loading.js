$.loader.images = [];

$.setImages = function(){
	if($.loader.images.length == 0){
	   for(var i = 1; i <= 10; i++){
		 Ti.API.info('Adding loading image: ' + '/img/spinner/'  + i.toString() + '.png');
		 $.loader.images.push('/img/spinner/'  + i.toString() + '.png');
	   }
	}
};

$.start = function() {
	$.loader.start();
};

$.stop = function() {
	$.loader.stop();
};

$.setMessage = function(key) {
	$.message.text = L(key);
};
