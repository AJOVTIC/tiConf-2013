var speakers = [
	{
		title: 'Boydlee Pollentine',
		subtitle: 'Titan, TCAD, Author of Appcelerator Titanium Smartphone Cookbook',
		image: '/img/speakers/folio_pic1.png',
		description: "Boydlee has spent the last 10+ years working for large corporations and government departments in Australia, as well as successfully running a software development company for a number of years. He now owns and runs a small digital and mobile agency based in Norwich called Tipsy & Tumbler with his partner, Hannah. An early adoptor of Titanium, he is also a Titan, TCAD and has spoken at numerous events including Mobile Monday and London Titanium.He's even written a book about Titanium development (available from Amazon, Packt Publishing and all good book stores and online retailers!)."
	},
	{
		title: 'Ketan Majmudar',
		subtitle: 'Titan, TCAD',
		image: '/img/speakers/ket.png',
		description: "Ket has been freelancing as a web developer/designer for 10yrs, with experience in accessible HTML & staying on top of the growing trends in web design, he moved into mobile app development in late 2010 and has used Titanium to code the SCI-FI-LONDON film festival app and the Surrey Police app (which is a social media engagement tool) . He is a Titan, and runs the London Titanium User Group."
	},
	{
		title: 'Xavier Lacot',
		subtitle: 'Co-Founder, JoliCode',
		image: '/img/speakers/DSC_8277.JPG',
		description: "Xavier is the co-founder of JoliCode, a French Web- and Mobile- expertise company which focuses on improving the quality of Web projects. Xavier is interested in technologies related to PHP frameworks, the Semantic Web and mobile solutions. Since February 2012, he is the President of AFUP, the French PHP Users Association. He uses Titanium since 0.7, and has contributed some code to the community. He is in particular the author of joli.js, a lightweight yet powerful ORM for Titanium."
	},
	{
		title: 'Joe Maffia',
		subtitle: 'Titan, TCAD',
		image: '/img/speakers/joem.jpg',
		description: "Web, Mobile and Application Developer, Apple maniac, DJ - Producer, Sound engineer, music lover and a general full-time geek! Joe is a regular contributer and speaker to London Titanium."
	},
	{
		title: 'Ivan Škugor',
		subtitle: 'Top 10 Q&A Contributor',
		image: '/img/speakers/ivan.png',
		description: "Ivan is a Titanium mobile developer from Split/Croatia, currently working for Tipsy & Tumbler Limited. He is in the top 10 Q&A contributors on the Appcelerator website and writes a popular blog about his techniques and experiences with Titanium mobile framework: http://zenborgium.blogspot.com/"
	},
	{
		title: 'Dan Tamas',
		subtitle: 'Titan, TCAD',
		image: '/img/speakers/dan_tamas_alt.jpg',
		description: "Dan is obsessed by mobile development. Since the first iPhone was released into the wild, he started to play with building various apps and slightly moved completely to the mobile world. Dan got hooked up by Appcelerator mainly because the syntax of objectiveC seemed really scarry for a lazy beginner and has never looked back since."
	},
	{
		title: 'Trevor Ward',
		subtitle: 'TCE, Titan, TCAD',
		image: '/img/speakers/tward_profile.png',
		description: "Trevor havs been developing software for over 20 years, initially using Cobol before going into web development in the late 90′s using Perl, HTML, JavaScript and Oracle. In 2007 he started to use Ruby on Rails and Adobe Flex, before moving into mobile application development in early 2011, using the Appcelerator Titanium framework exclusively. Trevor runs numerous workshops and is the only current certified BNAPP trainer in the UK. You can reach him via http://www.thewarpedcoder.net"
	},
	{
		title: 'Liz Myers',
		subtitle: 'Co-Founder: London-Titanium, BlackBerry Elite Member',
		image: '/img/speakers/myers.png',
		description: "Liz is a UX/UI Designer and Creative Technologist with more than 18 years experience working for blue chip companies such as: Adobe, Amazon, Microsoft, and Vodafone. After a decade focused primarily on web-based applications, Liz made the switch to mobile in 2004 whilst working on a break-thru project with the Windows Mobile Group at Microsoft and has never looked back.  During the past 18 months, she has used both Titanium and BlackBerryWebWorks to publish her app, 2Scoops, on 3 platforms."
	},
	{
		title: 'Javier Rayón',
		subtitle: 'Titan, TCAD',
		image: '/img/speakers/javier.jpeg',
		description: "Freelance full-time Titanium developer and creator of myZings app, Friend Screener for iPad, TitanTricks and theBand template for Titanium. After more than 10 years creating software, he can assure everyone that JavaScript is most amazing language ever! (in case you decide to really learn it). Passionate guitarist and enthusiastic photographer. Javier used to write blog posts about Titanium in spanish on www.criteriastudio.com. Now he is living in Valencia (Spain), where he prepares some of the best mojitos in the city!"
	},
	{
		title: 'Dave Mackintosh',
		subtitle: 'Titan, TCAD, TCMD',
		image: '/img/speakers/davem.png',
		description: ""
	},,
	{
		title: 'Olivier Morandi',
		subtitle: 'Titan, TCAD, TCMD',
		image: '/img/speakers/olivier.png',
		description: "Olivier is a software engineer working as a freelance consultant from his home at the feet of the North-Western Italy Alps. He spent a good part of the last decade doing academic research on technologies for high-speed network processing and writing compilers, before reinventing himself as a mobile and front-end developer. Olivier has used Titanium Mobile since version 0.7 and, when needed, enjoys breaking into native code for extending the framework. He's particularly interested in analyzing the performance limits of a cross platform solution like Titanium, so created TiProfiler. He also blogs at http://titaniumninja.com"
	},
	{
		title: 'Grant Smith',
		subtitle: '',
		image: '/img/speakers/GrantSmith.jpg',
		description: "Grant has been a software developer for almost two decades, working in large firms. His current projects include Zapper Scan and Visual-IDE - a visual interface designer and builder for Titanium mobile projects."
	},
	{
		title: 'Sharry Stowell',
		subtitle: 'Titan, runs LearningTitanium.com',
		image: '/img/speakers/183472_6693685371_2437_n.jpg',
		description: "Sharry is based near Norfolk, UK and is a senior web/mobile developer who currently works for a social enterprise creating applications for the Police & County Councils. He is a Titanium Titan who runs LearningTitanium.com & BuiltWithTitanium.com, involved in several Ti events & the TideSDK project."
	},
	{
		title: 'Bob Sims',
		subtitle: 'TCAD',
		image: '/img/speakers/bobsims.png',
		description: "Bob Sims is an American military officer who has served as an Information Systems Manager for 7 years at several international locations. He has developed and been an advocate for multiple projects using open source solutions such as eZpublish, Drupal, and Titanium Mobile.  Bob maintains several organizational web and mobile app projects as part of his current assignment at the NATO Joint Force Training Centre (JFTC) in Bydgoszcz, Poland."
	}
];

var Dpd = require('Dpd');

var Speaker = new Dpd(Alloy.CFG.baseUrl + 'speakers/');

// alert(Alloy.CFG.baseUrl);

// var Speakers = new Dpd(Alloy.CFG'')

var SpeakersModule = {
	get: function(callback) {
		if (callback) {
			callback(speakers);
		}
	}
}

module.exports = Speaker;