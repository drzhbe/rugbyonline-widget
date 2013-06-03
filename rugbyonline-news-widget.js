(function(exports) {
    var script = document.createElement('script');
    // script.src = 'http://rugbyonline.ru/rss?callback=recieveRugby';
    script.type = 'application/rss+xml';
    document.body.appendChild(script);
    exports.recieveRugby = function(data) {
        console.log( 'data', data );
    }
})(window);




/* Cross origin not allowed. */
(function(exports) {
    function getXmlHttp() {
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
    }

    var xhr = getXmlHttp();
    xhr.open('GET', 'file:///home/stanislav/prj/rugby/data.json', true);
    // xhr.open('GET', 'http://rugbyonline.ru/rss', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(xhr.responseText);
            }
        }
    };
    xhr.send(null);

})(window);