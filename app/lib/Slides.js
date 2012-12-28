/*var Slides = [
	{
		title: 'Slides 1',
		author: 'Author 1',
		slides: [ '/img/venue/venue-3rd-floor.png', '/img/venue/venue-4th-floor.png', '/img/venue/venue-3rd-floor.png', '/img/venue/venue-4th-floor.png' ]
	},
	{
		title: 'Slides 2',
		author: 'Author 2',
		slides: [ '/img/venue/venue-3rd-floor.png', '/img/venue/venue-4th-floor.png', '/img/venue/venue-3rd-floor.png', '/img/venue/venue-4th-floor.png' ]
	},
	{
		title: 'Slides 3',
		author: 'Author 3',
		slides: [ '/img/venue/venue-3rd-floor.png', '/img/venue/venue-4th-floor.png', '/img/venue/venue-3rd-floor.png', '/img/venue/venue-4th-floor.png' ]
	}
];*/

var Dpd = require('Dpd');

var Slides = new Dpd(Alloy.CFG.baseUrl + 'slides/');

module.exports = Slides;