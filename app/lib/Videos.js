/*var Videos = [
	{
		title: 'Videos 1',
		author: 'Author 1',
		video: 'http://vimeo.com/35841568'
	},
	{
		title: 'Videos 2',
		author: 'Author 2',
		video: 'http://vimeo.com/35841568'
	},
	{
		title: 'Videos 3',
		author: 'Author 3',
		video: 'http://vimeo.com/35841568'
	}
];*/

var Dpd = require('Dpd');

var Videos = new Dpd(Alloy.CFG.baseUrl + 'videos/');

module.exports = Videos;