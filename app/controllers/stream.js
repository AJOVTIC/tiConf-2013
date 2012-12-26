var Stream = require('twitter_stream');

$.loading = Alloy.createController('loading');

function createRow(data) {

	if (!data) {
		return;
	}

    var row = Alloy.createController('stream_row', data);


    return row.getView();
}

function createRows(results, showMoreRow) {
	
	var rows = [];

	if (!results) {
		return rows;
	}
	
	for (var i = 0; i < results.length; ++i) {
		rows[i] = createRow(results[i]);
	}
	if (showMoreRow) {
		rows[i] = createMoreRow();
	}
	
	return rows;
}

function createMoreRow() {
	return Ti.UI.createTableViewRow({ title: 'Load more ...', height: 75, _isLoadMore: true });
}

function showActivityIndicator() {
	$.index.add($.loading.getView());
	$.loading.start();
}

function hideActivityIndicator() {
	$.loading.stop();
	$.index.remove($.loading.getView());
}

function fetchTwitterStream(refreshOrAppend) {

	showActivityIndicator();

	if (refreshOrAppend) {

		Stream.fetch(function(data) {
			if (data && data.results) {
				$.table.setData(createRows(data.results, !!Stream.next_page));
			}
			hideActivityIndicator();
		}, hideActivityIndicator);
	}
	else {

		$.table.deleteRow($.table.data[0].rows.length - 1);

		Stream.next(function(data) {
			if (data && data.results) {
				$.table.appendRow(createRows(data.results, !!Stream.next_page));
			}
			hideActivityIndicator();
		}, hideActivityIndicator);
		
	}
}

$.table.on('click', function(e) {
	if (e.row._isLoadMore) {
		fetchTwitterStream(false);
	}
});

$.on('focus', function() {
	$.table.scrollToTop(0);
	fetchTwitterStream(true);
});

$.refresh.on('click', function() {
	$.table.scrollToTop(0);
	fetchTwitterStream(true);
});
