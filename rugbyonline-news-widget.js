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

rugbyOnline.Widgets.News = function(options) {
    return new rugbyOnline.Widgets._News(options);
};

rugbyOnline.Widgets._News = function(options) {
    this.wrapperId = options.wrapperId || 'rugbyOnline-news-widget',
    this.width = options.width || 500;

    this.getDataAndInit();
};

rugbyOnline.Widgets._News.prototype.getDataAndInit = function() {
    var xhr,
        that = this;

    xhr = rugbyOnline.Utils.xhr();
    xhr.open('GET', 'http://rugbyonline.ru/test.json', true);
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
    var wrapper, title, xhr;

    wrapper = document.getElementById(this.wrapperId);
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = this.wrapperId;
        document.body.appendChild(wrapper);
    }
    wrapper.style.width = this.width + 'px';

    title = document.createElement('h3');
    title.innerHTML = data.rss.channel.title;
    title.style.backgroundColor = 'rgb(40,40,40)';
    title.style.color = 'white';
    title.style.fontSize = '20px';
    title.style.paddingTop = '5px';
    title.style.paddingLeft = '11px';
    title.style.margin = '0px';
    title.style.minHeight = '32px';

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

    for (var i = 0; i < items.length; i++) {
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
