var Stream = require('TwitterStream');

$.loading = Alloy.createController('loading');

function createRow(data) {

	if (!data) {
		return;
	}

    var row = Alloy.createController('streamRow', data);

    return row.getView();
}

function createRows(results, toCreateMoreRow) {
	
	var rows = [];

	if (!results) {
		return rows;
	}
	
	for (var i = 0; i < results.length; ++i) {
		rows[i] = createRow(results[i]);
	}
	if (toCreateMoreRow) {
		rows[i] = createMoreRow();
	}
	
	return rows;
}

function createMoreRow() {
	return Ti.UI.createTableViewRow({ title: 'Load more ...', height: 75, _isLoadMore: true, font: { fontSize: 14 } });
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

		if ($.table.data && $.table.data[0] && $.table.data[0].rows.length > 0) {
			Stream.refresh(function(data) {
				if (data && data.results && data.results.length > 0) {
					var rows = createRows(data.results, false);
					for (var i = 0; i < rows.length; ++i) {
						$.table.insertRowBefore(0, rows[i]);	
					}
				}
				hideActivityIndicator();
			}, hideActivityIndicator);
		}
		else {
			Stream.fetch(function(data) {
				if (data && data.results && data.results.length > 0) {
					$.table.setData(createRows(data.results, !!Stream.next_page));
				}
				hideActivityIndicator();
			}, hideActivityIndicator);
		}
		
	}
	else {

		$.table.deleteRow($.table.data[0].rows.length - 1);

		Stream.next(function(data) {
			if (data && data.results && data.results.length > 0) {
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
