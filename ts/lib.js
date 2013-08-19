var lib;
(function (lib) {
    var StringBuilder = (function () {
        function StringBuilder(value) {
            this.strings = [''];
            this.append(value);
        }
        StringBuilder.prototype.append = function (value) {
            if (value !== null) {
                this.strings.push(value);
            }
        };

        StringBuilder.prototype.clear = function () {
            this.strings.length = 1;
        };

        StringBuilder.prototype.toString = function () {
            return this.strings.join('');
        };
        return StringBuilder;
    })();
    lib.StringBuilder = StringBuilder;

    //implement array.map
    function map(ar, fun, extra) {
        var i, len, res = [], item;
        if (ar) {
            if (typeof (ar.map) === 'function') {
                res = ar.map(fun, extra);
            } else {
                for (i = 0, len = ar.length; i < len; i += 1) {
                    item = fun.call(extra, ar[i], i, ar);
                    if (item) {
                        res.push(item);
                    }
                }
            }
            return res;
        }
    }
    lib.map = map;

    //Returns the found element or null
    function find(ar, fun, extra) {
        var res;
        if (typeof (ar.filter) === 'function') {
            res = ar.filter(fun, extra);
        } else {
            res = lib.map(ar, function (value, index, array) {
                return fun.call(extra, value, index, array) ? value : null;
            }, extra);
        }
        return res.length > 0 ? res[0] : null;
    }
    lib.find = find;

    function exists(ar, fun, extra) {
        var i, len, item;
        if (ar) {
            if (typeof (ar.some) === 'function') {
                return ar.some(fun, extra);
            } else {
                for (i = 0, len = ar.length; i < len; i += 1) {
                    if (fun.call(extra, ar[i], i, ar)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    lib.exists = exists;
})(lib || (lib = {}));
//# sourceMappingURL=lib.js.map
