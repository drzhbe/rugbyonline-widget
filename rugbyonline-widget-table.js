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
	this.owner = options.owner; // если виджет используется на сайте клуба - можно выделить свою команду

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

rugbyOnline.Widgets.Table.prototype.style = "#ro-w-table { \
	width: 250px; \
} \
#ro-w-table h3 { \
	text-align: center; \
	background: rgb(40,40,40); \
    color: white; \
    font-size: 20px; \
    padding-top: 5px; \
    margin: 0px; \
    min-height: 32px; \
} \
#ro-w-table table { \
	width: 250px; \
} \
#ro-w-table tr { \
	text-align: left; \
} \
#ro-w-table th, \
#ro-w-table td { \
	text-align: left; \
} \
#ro-w-table .ro-even { \
	background: #eee; \
} \
#ro-w-table .ro-owner { \
	font-weight: bold; \
}";

rugbyOnline.Widgets.Table.prototype.createAndAppendStyle = function() {
    var css = this.style,
        head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
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

	this.createAndAppendStyle();

	var i,
		row,
		table = document.createElement('table'),
		wrapper = document.getElementById('ro-w-table'), // widget will be added to <div id='ro-w-table'></div> element
		wrapperAppended = false;
		headers = { // headers for the table
			'team': 'Команда',
			'g': 'И',
			'pt': 'О'
		};

	if (wrapper) {
		wrapperAppended = true;
	} else {
		wrapper = document.createElement('div');
		wrapper.id = 'ro-w-table';
	}

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

	wrapper.appendChild(header);
	wrapper.appendChild(table);

	if (!wrapperAppended) {
		document.body.appendChild(wrapper);
	}
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
		this.addClass(tr, 'ro-even'); // differ odd and even rows

	this.addTd(tr, 'index', i, isHeader); // add index field
	for (key in data) if (data.hasOwnProperty(key)) {
		if (this.visibleColumns.indexOf(key) == -1) continue;
		this.addTd(tr, key, data[key], isHeader);
	}
	
	if (data.team == this.owner) {
	    this.addClass(tr, 'ro-owner');
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

rugbyOnline.Widgets.Table.prototype.addClass = function(element, className) {
    var classes = element.className ? element.className.split(' ') : [];
    classes.push(className);
    element.className = classes.join(' ');
};
