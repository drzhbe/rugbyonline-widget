if (typeof rugbyOnline !== 'object') rugbyOnline = {};
if (!rugbyOnline.Utils) rugbyOnline.Utils = {};
if (!rugbyOnline.Widgets) rugbyOnline.Widgets = {};

rugbyOnline.Widgets.Table = function(options) {
	return new rugbyOnline.Widgets._Table(options);
};

rugbyOnline.Widgets._Table = function(options) {
	this.getDataAndInit();
	// this.init(tableData);
};

rugbyOnline.Widgets._Table.prototype.visibleColumns = ['team', 'g', 'pt']; // team, games and points
rugbyOnline.Widgets._Table.prototype.url = 'http://rugbyonline.ru/api/tournaments/table/1/1/1/1/json';
rugbyOnline.Widgets._Table.prototype.getDataAndInit = function() {
    var xhr,
        that = this;

    xhr = rugbyOnline.Utils.xhr();
    xhr.open('GET', that.url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                that.init(JSON.parse(xhr.responseText));
            }
        }
    };
    xhr.send(null);
};
rugbyOnline.Widgets._Table.prototype.init = function(data) {
	if (!data || !data.data) throw new Error('rugbyOnline.Widgets.Table failed to init for lack of fetched data from ' + this.url);
	data = data.data;

	var i,
		row,
		table = document.createElement('table'),
		wrapper = document.createElement('div'),
		headers = { // headers for the table
			'team': 'Команда',
			'g': 'И',
			'pt': 'О'
		};

	row = this.createRow(headers, '', true); // Add headers to the table and pass empty string as index
	table.appendChild(row);

	for (i = 0; i < data.length; i++) {
		row = this.createRow(data[i], i + 1);
		table.appendChild(row);
	}

	var header = document.createElement('h3');
	header.innerHTML = 'Регби Онлайн Турниры';
	rugbyOnline.Utils.extend(header.style, rugbyOnline.Widgets.headerStyle); // set header styles

	wrapper.id = 'ro-table-widget';
	wrapper.appendChild(header);
	wrapper.appendChild(table);
	document.body.appendChild(wrapper);
};
/**
 * Creates tr filled with td's or th's.
 * @param {Object} data
 * @param {Number} i - index of row, starts with 1, not 0.
 * @param {Boolean} isHeader - should we crate row of th, or row of td.
 * @return {DOM}
 */
rugbyOnline.Widgets._Table.prototype.createRow = function(data, i, isHeader) {
	var key,
		td,
		tr = document.createElement('tr');

	if ( typeof i == 'number' && !(i % 2) )
		tr.className = ' ro-even'; // differ odd and even rows

	this.addTd(tr, 'index', i, isHeader); // add index field
	for (key in data) if (data.hasOwnProperty(key)) {
		if (this.visibleColumns.indexOf(key) == -1) continue;
		this.addTd(tr, key, data[key], isHeader);
	}

	return tr;
};
/**
 * Add td or th to passed tr.
 * @param {DOM} tr
 * @param {String} key - used in className
 * @param {String} value
 * @param {Boolean} isHeader
 */
rugbyOnline.Widgets._Table.prototype.addTd = function(tr, key, value, isHeader) {
	var td,
		tdOrTh = isHeader ? 'th' : 'td';
	td = document.createElement(tdOrTh);
	td.className = 'ro-table-' + key;
	td.innerHTML = value;

	tr.appendChild(td);
};
