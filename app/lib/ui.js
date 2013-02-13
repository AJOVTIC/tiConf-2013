var Alloy = require('alloy');


/*
 * Smallish shared UI helper libraries
 */
var _ = require('alloy/underscore'),
	Backbone = require('alloy/backbone'),
	moment = require('moment');

//Display a localized alert dialog
exports.alert = function(titleid, textid) {
	if (OS_IOS) {
		Ti.UI.createAlertDialog({
			title:L(titleid),
			message:L(textid)
		}).show();
	}
	else {
		Ti.UI.createNotification({
			message:L(textid),
			duration:Ti.UI.NOTIFICATION_DURATION_LONG
		}).show();
	}
};

//Zoom a view and dissipate it
exports.zoom = function(view, callback) {
	var matrix = Ti.UI.create2DMatrix({ 
		scale:1.5 
	});

	view.animate({ 
		transform:matrix, 
		opacity:0.0, 
		duration:250 
	}, function() {
    	callback && callback();
	});
};

//undo the zoom effect
exports.unzoom = function(view, callback) {
	var matrix = Ti.UI.create2DMatrix({ 
		scale:1 
	});

	view.animate({ 
		transform:matrix, 
		opacity:1, 
		duration:250 
	}, function() {
    	callback && callback();
	});
};

function FauxShadow() {
	return Ti.UI.createView({
		bottom:0,
		height:'1dp',
		backgroundColor:'#9a9a9a'
	});
}
exports.FauxShadow = FauxShadow;

/*
 * Create a reusable filter header for insertion into a view hierarchy
 * Example:
 * var header = new ui.HeaderView({
 *     title:'localizationIdString',
 *     optionWidth:90, //converted to dp
 *     options: [
 *         'optionOneKey',
 *         'optionTwoKey'
 *     ],
 *     viewArgs: {
 * 	       //object properties for View proxy, if desired
 *     }
 * });
 * 
 * //e.selection contains the option key value that was selected by the user
 * header.on('change', function(e) {
 *     
 * })
 * 
 */

 //TODO Rewrite as Alloy controller
exports.HeaderView = function(options) {
	var self = Ti.UI.createView(_.extend({
		backgroundColor:'#fff',
		height:'35dp'
	}, options.viewArgs || {}));
	
	var fauxShadow = new FauxShadow();
	self.add(fauxShadow);
	
	var indicator = Ti.UI.createView({
		top:0,
		right:(options.optionWidth*(options.options.length-1))+'dp',
		bottom:'1dp',
		width:options.optionWidth+'dp',
		backgroundColor:'#ffce00'
	});
	self.add(indicator);
	
	var title = Ti.UI.createLabel({
		text:L(options.title),
		color:'#373e47',
		left:'10dp',
		width:Ti.UI.SIZE,
		height:Ti.UI.SIZE,
		font: {
			fontFamily:'Quicksand-Bold',
			fontSize:'14dp'
		}
	});
	self.add(title);
	
	//Create a styled menu option
	function option(t,idx) {
		var rightOffset = (options.optionWidth*(Math.abs(idx-(options.options.length-1))))+'dp';
		
		var v = Ti.UI.createView({
			width:options.optionWidth+'dp',
			right:rightOffset
		});
		
		var l = Ti.UI.createLabel({
			text:L(t),
			color:'#0574bf',
			height:Ti.UI.SIZE,
			width:Ti.UI.SIZE,
			font: {
				fontFamily:'Quicksand-Bold',
				fontSize:'14dp'
			}
		});
		v.add(l);
		
		//option selection
		v.addEventListener('click', function() {
			indicator.animate({
				right:rightOffset,
				duration:250
			}, function() {
				self.fireEvent('change',{
					selection:t
				});
			});
		});
		
		return v;
	}
	
	//Create menu options for each option requested
	for (var i=0, l=options.options.length; i<l; i++) {
		self.add(option(options.options[i], i));
	}
	
	//Add common shortcut to addEventListener
	self.on = function(ev,cb) {
		self.addEventListener(ev,cb);
	};
	
	//Shift indicator to desired index
	self.goTo = function(idx) {
		var rightOffset = (options.optionWidth*(Math.abs(idx-(options.options.length-1))))+'dp';
		indicator.right = rightOffset;
	};
	
	return self;
};

function StatusView(status) {
	var created = moment(status.created_at);
	
	var self = Ti.UI.createView({
		height:status.photo ? '365dp' : '130dp',
		backgroundColor:'#fff',
		bottom:'10dp'
	});
	
	var divider = Ti.UI.createView({
		backgroundColor:'#cdcdcd',
		bottom:'60dp',
		left:'5dp',
		right:'5dp',
		height:'1dp'
	});
	self.add(divider);
	
	var avatar = Ti.UI.createImageView({
		image:status.custom_fields.avatar,
		defaultImage:'/img/profile/no-profile-pic.png',
		height:'44dp',
		width:'44dp',
		left:'5dp',
		bottom:'8dp',
		borderRadius:'3dp'
	});
	self.add(avatar);
	
	var name = Ti.UI.createLabel({
		text:status.custom_fields.name,
		color:'#000',
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
		left:'55dp',
		bottom:'37dp',
		font: {
			fontWeight:'bold',
			fontSize:'14dp'
		}
	});
	self.add(name);
	
	var org = Ti.UI.createLabel({
		text:status.custom_fields.org,
		color:'#0574bf',
		height:Ti.UI.SIZE,
		width:Ti.UI.SIZE,
		left:'55dp',
		bottom:'25dp',
		font: {
			fontSize:'12dp',
			fontWeight:'bold'
		}
	});
	self.add(org);
	
	var createdLabel = Ti.UI.createLabel({
		bottom:'40dp',
		right:'5dp',
		color:'#787878',
		text:created.fromNow(),
		font: {
			fontSize:'10dp'
		}
	});
	self.add(createdLabel);
	
	self.add(Ti.UI.createLabel({
		text:status.message,
		bottom:'70dp',
		left:'5dp',
		right:'5dp',
		height:'60dp',
		color:'#000',
		font: {
			fontSize:'14dp'
		}
	}));
	
	if (status.photo) {
		self.add(Ti.UI.createImageView({
			image:status.photo.urls.medium_500,
			bottom:'140dp',
			height:'220dp'
		}));
	}
	
	return self;
} 
exports.StatusView = StatusView;

//Create a status update row
function StatusRow(status) {
	var self = Ti.UI.createTableViewRow({
		height:status.photo ? '375dp' : '140dp',
		selectedBackgroundColor:'#fff',
		className:status.photo ? 'photoRow' : 'statusRow'
	});
	self.statusObject = status;
	
	var content = new StatusView(status);
	self.add(content);
	
	var fauxShadow = new FauxShadow();
	fauxShadow.bottom = '10dp';
	self.add(fauxShadow);
	
	return self;
}
exports.StatusRow = StatusRow;




