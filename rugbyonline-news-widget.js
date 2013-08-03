/* Cross origin not allowed. */
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
rugbyOnline.Utils.extend = function(to, from) {
    for (var key in from) if (from.hasOwnProperty(key)) {
        to[key] = from[key];
    }
};

rugbyOnline.Widgets.headerStyle = {
    backgroundColor: 'rgb(40,40,40)',
    color: 'white',
    fontSize: '20px',
    paddingTop: '5px',
    paddingLeft: '11px',
    margin: '0px',
    minHeight: '32px'
};

rugbyOnline.Widgets.News = function(options) {
    return new rugbyOnline.Widgets._News(options);
};

rugbyOnline.Widgets._News = function(options) {
    this.wrapperId = options.wrapperId || 'rugbyOnline-news-widget',

    this.width = options.width || '500px';
    this.width += this.width.indexOf('px') === -1 ? 'px' : '';

    this.border = options.border || '';

    this.amount = options.amount || 5;
    this.amount = options.amount > 20 ? 20 : this.amount;
    this.amount = options.amount == 0 ? 5 : this.amount;

    this.getDataAndInit();
};

// rugbyOnline.Widgets._News.prototype.url = 'http://rugbyonline.ru/api/news/json';
rugbyOnline.Widgets._News.prototype.url = 'http://rugbyonline.ru/test.json';

rugbyOnline.Widgets._News.prototype.getDataAndInit = function() {
    var xhr,
        that = this;

    xhr = rugbyOnline.Utils.xhr();
    xhr.open('GET', this.url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                that.init(JSON.parse(xhr.responseText));
            }
        }
    };
    xhr.send(null);
};

rugbyOnline.Widgets._News.prototype.init = function(data) {
    var wrapper, title;

    wrapper = document.getElementById(this.wrapperId);
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = this.wrapperId;
        document.body.appendChild(wrapper);
    }
    wrapper.style.width = this.width;
    wrapper.style.border = this.border;

    title = document.createElement('h3');
    title.innerHTML = data.rss.channel.title;
    rugbyOnline.Utils.extend(title.style, rugbyOnline.Widgets.headerStyle); // set header styles

    wrapper.appendChild(title);

    this.list(data, wrapper);
};

rugbyOnline.Widgets._News.prototype.list = function(data, wrapper) {
    var ul = document.createElement('ul'),
        items = data.rss.channel.item;

    ul.style.listStyle = 'none';
    ul.style.marginLeft = '-30px';
    ul.style.marginTop = '0px';
    ul.style.marginBottom = '0px';

    for (var i = 0; i < this.amount; i++) {
        this.item(items[i], ul);
    }
    wrapper.appendChild(ul);
};

rugbyOnline.Widgets._News.prototype.item = function(data, ul) {
    var li = document.createElement('li'),
        date = document.createElement('span'),
        delimeter = document.createElement('span'),
        link = document.createElement('a');

    li.style.marginTop = '10px';

    li.appendChild(date);
    li.appendChild(delimeter);
    li.appendChild(link);
    date.innerHTML = data.pubDate;
    delimeter.innerHTML = ' | ';
    link.innerHTML = data.title;
    link.href = data.link;
    ul.appendChild(li);
};
