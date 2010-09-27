/*global jQuery, $, alert*/
$(document).ready(function () {

    var example4AsJSONdata = {
        dataid: "An optional sourcetable identifier",
        columns: [
        { colvalue: "Month ", coltext: "Month ", header: "Month ", sortbycol: "Month ", groupbyrank: null, pivot: true, result: false },
        { colvalue: "Subject ", coltext: "Subject ", header: "Subject ", sortbycol: "Subject ", groupbyrank: 2, pivot: false, result: false },
        { colvalue: "Student ", coltext: "Student ", header: "Student ", sortbycol: "Student ", dataid: "An optional id.", groupbyrank: 1, pivot: false, result: false },
        { colvalue: "Score ", coltext: "Score ", header: "Score ", sortbycol: "Score ", groupbyrank: null, pivot: false, result: true}],
        rows: [
        { "Month ": "January", "Subject ": "English", "Student ": "Elisa", "Score ": "8.7" },
        { "Month ": "January ", "Subject ": "Maths ", "Student ": "Elisa ", "Score ": "6.5 " },
        { "Month ": "January ", "Subject ": "Science ", "Student ": "Elisa ", "Score ": "5.8 " },
        { "Month ": "January ", "Subject ": "Art ", "Student ": "Elisa ", "Score ": "8.9 " },
        { "Month ": "January ", "Subject ": "History ", "Student ": "Elisa ", "Score ": "8.1 " },
        { "Month ": "January ", "Subject ": "French ", "Student ": "Elisa ", "Score ": "6.2 " },
        { "Month ": "February ", "Subject ": "English ", "Student ": "Elisa ", "Score ": "5.1 " },
        { "Month ": "February ", "Subject ": "Maths ", "Student ": "Elisa ", "Score ": "7.2 " },
        { "Month ": "February ", "Subject ": "Science ", "Student ": "Elisa ", "Score ": "8.9 " },
        { "Month ": "February ", "Subject ": "Art ", "Student ": "Elisa ", "Score ": "8.3 " },
        { "Month ": "February ", "Subject ": "History ", "Student ": "Elisa ", "Score ": "8.4 " },
        { "Month ": "February ", "Subject ": "French ", "Student ": "Elisa ", "Score ": "5.7 " },
        { "Month ": "March ", "Subject ": "English ", "Student ": "Elisa ", "Score ": "4.1 " },
        { "Month ": "March ", "Subject ": "Maths ", "Student ": "Elisa ", "Score ": "7.1 " },
        { "Month ": "March ", "Subject ": "Science ", "Student ": "Elisa ", "Score ": "4.1 " },
        { "Month ": "March ", "Subject ": "Art ", "Student ": "Elisa ", "Score ": "9.2 " },
        { "Month ": "March ", "Subject ": "History ", "Student ": "Elisa ", "Score ": "9.1 " },
        { "Month ": "March ", "Subject ": "French ", "Student ": "Elisa ", "Score ": "5.6 " },
        { "Month ": "January ", "Subject ": "english ", "Student ": "Mary ", "Score ": "8.7 " },
        { "Month ": "January ", "Subject ": "Maths ", "Student ": "Mary ", "Score ": "5.3 " },
        { "Month ": "January ", "Subject ": "Science ", "Student ": "Mary ", "Score ": "3.5 " },
        { "Month ": "January ", "Subject ": "Art ", "Student ": "Mary ", "Score ": "6.1 " },
        { "Month ": "January ", "Subject ": "History ", "Student ": "Mary ", "Score ": "5.8 " },
        { "Month ": "January ", "Subject ": "French ", "Student ": "Mary ", "Score ": "9.2 " },
        { "Month ": "February ", "Subject ": "english ", "Student ": "Mary ", "Score ": "6.8 " },
        { "Month ": "February ", "Subject ": "Maths ", "Student ": "Mary ", "Score ": "5.4 " },
        { "Month ": "February ", "Subject ": "Science ", "Student ": "Mary ", "Score ": "5.6 " },
        { "Month ": "February ", "Subject ": "Art ", "Student ": "Mary ", "Score ": "5.9 " },
        { "Month ": "February ", "Subject ": "History ", "Student ": "Mary ", "Score ": "6.1 " },
        { "Month ": "February ", "Subject ": "French ", "Student ": "Mary ", "Score ": "9.3 " },
        { "Month ": "March ", "Subject ": "english ", "Student ": "Mary ", "Score ": "4.1 " },
        { "Month ": "March ", "Subject ": "Maths ", "Student ": "Mary ", "Score ": "3.5 " },
        { "Month ": "March ", "Subject ": "Science ", "Student ": "Mary ", "Score ": "4.1 " },
        { "Month ": "March ", "Subject ": "Art ", "Student ": "Mary ", "Score ": "4.8 " },
        { "Month ": "March ", "Subject ": "History ", "Student ": "Mary ", "Score ": "6.7 " },
        { "Month ": "March ", "Subject ": "French ", "Student ": "Mary ", "Score ": "9.0 "}]
    };


    function dumpObj(obj, name, depth) {
        var indentTpl = "    ";
        var indent = "";
        depth = depth || 1;

        for (var i = 0; i < depth; i += 1) {
            indent += indentTpl;
        }

        var MAX_DUMP_DEPTH = 10;
        var propertyStrings = [];

        if (depth > MAX_DUMP_DEPTH) {
            return indent + name + ": <Maximum Depth Reached>\n";
        }
        if (typeof obj === "object") {
            var child = null;
            var output = indent + name + " : {\n";
            for (var item in obj) {
                if (obj.hasOwnProperty(item)) {
                    try {
                        child = obj[item];
                    } catch (e) {
                        child = "<Unable to Evaluate>";
                    }
                    if (typeof child === "object") {
                        propertyStrings.push(dumpObj(child, item, depth + 1));
                    } else {
                        propertyStrings.push(indent + indentTpl + item + ": " + (typeof child === "string" ? "'" + child + "'" : child));
                    }
                }
            }
            output += propertyStrings.join(', \n') + "}";
            return output;
        } else if (typeof obj === "string") {
            return "'" + obj + "'";
        } else {
            return obj;
        }
    }

    $('#example1').click(function () {
        $('table').hide();
        $('#res').pivot({
            source: $(this),
            formatFunc: function (n) { return jQuery.fn.pivot.formatUK(n, 2); },
            onResultCellClicked: function (data) { alert(dumpObj(data, "data")); }
        });
    });
    $('#example2').click(function () {
        $('table').hide();
        $('#res').pivot({
            source: $(this),
            formatFunc: function (n) { return jQuery.fn.pivot.formatDK(n, 2); },
            parseNumFunc: function (n) { return +((typeof n === "string") ? +n.replace('.', '').replace(',', '.') : n); },
            onResultCellClicked: function (data) { alert(dumpObj(data, "data")); }
        });
    });
    $('#example3').click(function () {
        $('table').hide();
        $('#res').pivot({
            source: $(this),
            formatFunc: function (n) { return jQuery.fn.pivot.formatDK(n, 2); },
            parseNumFunc: function (n) { return +((typeof n === "string") ? +n.replace('.', '').replace(',', '.') : n); },
            onResultCellClicked: function (data) { alert(dumpObj(data, "data")); }
        });
    });


    $('a.runexample').click(function () {
        var exampleId = $(this).attr('title');
        $('#' + exampleId).show();
        $('#res').html('');
        $('#demos').show();
        $('#doc').hide();

        if (exampleId === 'example4') {
            $('#res').pivot({
                source: example4AsJSONdata,
                formatFunc: function (n) { return jQuery.fn.pivot.formatUK(n, 2); },
                onResultCellClicked: function (data) { alert(dumpObj(data, "data")); }
            });
        }
    });


    $('#backToDoc').click(function () {
        $('#demos').hide();
        $('#doc').show();
    });
});