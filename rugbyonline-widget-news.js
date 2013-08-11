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

// rugbyOnline.Widgets.headerStyle = {
//     backgroundColor: 'rgb(40,40,40)',
//     color: 'white',
//     fontSize: '20px',
//     paddingTop: '5px',
//     paddingLeft: '11px',
//     margin: '0px',
//     minHeight: '32px'
// };

rugbyOnline.Widgets.news = function(options) {
    return new rugbyOnline.Widgets.News(options);
};

rugbyOnline.Widgets.News = function(options) {
    this.title = options.title || 'Регби Онлайн Новости';
    this.wrapperId = options.wrapperId || 'ro-w-news',

    this.width = options.width || '500px';
    this.width += typeof this.width == 'number' || this.width.indexOf('px') === -1 ? 'px' : '';

    this.border = options.border || '';

    this.amount = options.amount || 5;
    this.amount = options.amount > 20 ? 20 : this.amount;
    this.amount = options.amount == 0 ? 5 : this.amount;

    this.getDataAndInit();
};

rugbyOnline.Widgets.News.prototype.url = 'http://rugbyonline.ru/api/news/json';
// rugbyOnline.Widgets.News.prototype.url = 'http://rugbyonline.ru/test.json';

rugbyOnline.Widgets.News.prototype.classPrefix = 'ro-w-news-';

rugbyOnline.Widgets.News.prototype.monthes = [
    'Января',   // 0
    'Февраля',  // 1
    'Марта',    // 2
    'Апреля',   // 3
    'Мая',      // 4
    'Июня',     // 5
    'Июля',     // 6
    'Августа',  // 7
    'Сентября', // 8
    'Октября',  // 9
    'Ноября',   // 10
    'Декабря'   // 11
];

rugbyOnline.Widgets.News.prototype.getDataAndInit = function() {
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

rugbyOnline.Widgets.News.prototype.init = function(data) {
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
    title.innerHTML = this.title;

    wrapper.appendChild(title);

    this.list(data, wrapper);
};

rugbyOnline.Widgets.News.prototype.list = function(data, wrapper) {
    var ul = document.createElement('ul'),
        items = data,
        date;

    ul.style.listStyle = 'none';
    ul.style.marginLeft = '-30px';
    ul.style.marginTop = '0px';
    ul.style.marginBottom = '0px';

    for (var i = 0, l = items.length; i < this.amount && i  < l; i++) {
        date = new Date(items[i].created);
        this.insertDate(date, ul);
        this.item(items[i], date, ul);
    }
    wrapper.appendChild(ul);
};

rugbyOnline.Widgets.News.prototype.item = function(data, date, ul) {
    var li = document.createElement('li'),
        $date = document.createElement('span'),
        link = document.createElement('a');

    li.appendChild($date);
    li.appendChild(link);
    $date.innerHTML = date.getHours() + ':' + date.getMinutes();
    link.innerHTML = data.title;
    link.href = data.link;
    ul.appendChild(li);
};

/**
 * @param {Object} date
 *        {Number} date.month
 *        {Number} date.day
 * @return {Boolean}
 */
rugbyOnline.Widgets.News.prototype.isNextDay = function(date) {
    if (!this.lastDate) {
        this.lastDate = date;
        return true;
    }

    // incoming data sorted from last to first, so next element is always less than or equal to previous
    if (date.month <= this.lastDate.month && date.day < this.lastDate.day) { 
        this.lastDate = date;
        return true;
    }

    return false;
};

rugbyOnline.Widgets.News.prototype.todayOrYesterday = function(date) {
    var today = new Date();
    today = { month: today.getMonth(), day: today.getDate() };

    if ((this.yestarday && this.yestarday == date) ||
        (!this.yesterday && (today.month > date.month || today.day > date.day))) {

        this.yesterday = date;
        return 'Вчера, ';
    }
    if (today.month == date.month && today.day == date.day) {
        return 'Сегодня, ';
    }
    return '';
};

rugbyOnline.Widgets.News.prototype.insertDate = function(date, ul) {
    var month = date.getMonth(),
        day = date.getDate(),
        monthDay = { month: month, day: day },
        isNextDay = this.isNextDay(monthDay);

    if (!isNextDay) return;

    var todayOrYesterday = this.todayOrYesterday(monthDay),
        li = document.createElement('li');

    li.className = this.classPrefix + 'date';
    li.innerHTML = todayOrYesterday + day + ' ' + this.monthes[month];
    ul.appendChild(li);
};