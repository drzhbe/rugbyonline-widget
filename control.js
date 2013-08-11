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

        code += 'rugbyOnline.Widgets.news({' + options + '});';
        codeElement.value = code;

        rugbyOnline.Widgets.news({width: width, amount: amount});
    };
    exports.removeWidget = function() {
        var widgetElement = document.getElementById('ro-w-news');
        if (widgetElement) {
            document.body.removeChild(widgetElement);
        }
    };

    exports.addTable = function() {
        removeTable();
        rugbyOnline.Widgets.table({
            tournamentNumber: 29,
            title: 'Дыня торпеда оле-оле',
            titleBgColor: '#999',
            width: 250
        });
    };
    exports.removeTable = function() {
        var widgetElement = document.getElementById('ro-table-widget');
        if (widgetElement && widgetElement.parentNode)
            widgetElement.parentNode.removeChild(widgetElement);
    };
})(window);