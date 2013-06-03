(function(exports) {
    var widthElement = document.getElementById('widget-width');
    exports.addWidget = function() {
        rugbyOnline.Widgets.News({width: widthElement.value});
    };
})(window);