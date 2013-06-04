(function(exports) {
    var widthElement = document.getElementById('widget-width'),
        codeElement = document.getElementById('widget-code');
    exports.addWidget = function() {
        var width = widthElement.value,
            code = '';

        code += 'rugbyOnline.Widgets.News({'
            + (width ? 'width: ' + width : '') +
        '});';
        codeElement.value = code;

        rugbyOnline.Widgets.News({width: width});
    };
})(window);