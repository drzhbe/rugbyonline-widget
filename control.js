(function(exports) {
    var widthElement = document.getElementById('widget-width'),
        // borderWidthElement = document.getElementById('widget-border-width'),
        // borderStyleElement = document.getElementById('widget-border-style'),
        // borderColorElement = document.getElementById('widget-border-color'),
        amountElement = document.getElementById('widget-amount'),
        codeElement = document.getElementById('widget-code');
    exports.addWidget = function() {
        removeWidget();

        var width = widthElement.value,
            // border = borderElement.value,
            amount = amountElement.value,
            code = '',
            options = '',
            properties = {},
            propertiesLength = 0,
            name;

        width && (properties.width = width) && propertiesLength++;
        // border && (properties.border = border) && propertiesLength++;
        amount && (properties.amount = amount) && propertiesLength++;

        if (propertiesLength) {
            for (name in properties) if (properties.hasOwnProperty(name)) {
                options += '\n    ' + name + ': "' + properties[name] + '"';
                propertiesLength--;
                options += propertiesLength ? ', ' : '\n';
            }
        }

        code += 'rugbyOnline.Widgets.News({' + options + '});';
        codeElement.value = code;

        rugbyOnline.Widgets.News({width: width, amount: amount});
    };
    exports.removeWidget = function() {
        var widgetElement = document.getElementById('rugbyOnline-news-widget');
        document.body.removeChild(widgetElement);
    };

    exports.addTable = function() {
        removeTable();
        rugbyOnline.Widgets.Table();
    };
    exports.removeTable = function() {
        var widgetElement = document.getElementById('ro-table-widget');
        if (widgetElement && widgetElement.parentNode)
            widgetElement.parentNode.removeChild(widgetElement);
    };
})(window);