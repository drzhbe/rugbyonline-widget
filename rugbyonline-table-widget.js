if (typeof rugbyOnline !== 'object') rugbyOnline = {};
if (!rugbyOnline.Utils) rugbyOnline.Utils = {};
if (!rugbyOnline.Widgets) rugbyOnline.Widgets = {};

rugbyOnline.Utils.xhr = function() {
    var xhr;
    try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xhr = false;
        }
    }
    if (!xhr && typeof XMLHttpRequest!='undefined') {
        xhr = new XMLHttpRequest();
    }
    return xhr;
};

rugbyOnline.Widgets.table = function(options) {
	return new rugbyOnline.Widgets.Table(options);
};

rugbyOnline.Widgets.Table = function(options) {
	if (!options.tournamentNumber) {
		throw new Error('You should pass tournamentNumber to rugbyOnline.Widgets.Table');
	}
	this.tournamentNumber = options.tournamentNumber;
	this.title = options.title || 'Регби Онлайн Турниры';

	if (options.titleBgColor) {
		this.titleBgColor = options.titleBgColor;
	}

	if (options.width && options.width > 250) { // Min width is 250px
		this.width = options.width;
	}

	this.url = 'http://rugbyonline.ru/api/tournaments/table/' + this.tournamentNumber + '/json';

	this.getDataAndInit();
	// this.init(tableData);
};

rugbyOnline.Widgets.Table.prototype.visibleColumns = ['team', 'g', 'pt']; // team, games and points
rugbyOnline.Widgets.Table.prototype.getDataAndInit = function() {
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
rugbyOnline.Widgets.Table.prototype.init = function(data) {
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

	if (this.width) {
		table.style.width = this.width + 'px';
		wrapper.style.width = this.width + 'px';
	}

	row = this.createRow(headers, '', true); // Add headers to the table and pass empty string as index
	table.appendChild(row);

	for (i = 0; i < data.length; i++) {
		row = this.createRow(data[i], i + 1);
		table.appendChild(row);
	}

	var header = document.createElement('h3');
	header.innerHTML = this.title;
	if (this.titleBgColor) {
		header.style.backgroundColor = this.titleBgColor;
	}
	// rugbyOnline.Utils.extend(header.style, rugbyOnline.Widgets.headerStyle); // set header styles

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
rugbyOnline.Widgets.Table.prototype.createRow = function(data, i, isHeader) {
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
rugbyOnline.Widgets.Table.prototype.addTd = function(tr, key, value, isHeader) {
	var td,
		tdOrTh = isHeader ? 'th' : 'td';
	td = document.createElement(tdOrTh);
	td.className = 'ro-table-' + key;
	td.innerHTML = value;

	tr.appendChild(td);
};
