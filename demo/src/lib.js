var Jquerypivot;
(function (Jquerypivot) {
    (function (Lib) {
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
        Lib.StringBuilder = StringBuilder;

        function map(ar, fun, extra) {
            var i, len, res = [], item;
            if (ar) {
                 {
                    for (i = 0, len = ar.length; i < len; i += 1) {
                        item = fun.call(extra, ar[i], i, ar);
                        if (item !== null) {
                            res.push(item);
                        }
                    }
                }
                return res;
            }
        }
        Lib.map = map;

        function find(ar, fun, extra) {
            var res;
            if (typeof (ar.filter) === 'function') {
                res = ar.filter(fun, extra);
            } else {
                res = Lib.map(ar, function (value, index, array) {
                    return fun.call(extra, value, index, array) ? value : null;
                }, extra);
            }
            return res.length > 0 ? res[0] : null;
        }
        Lib.find = find;

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
        Lib.exists = exists;
    })(Jquerypivot.Lib || (Jquerypivot.Lib = {}));
    var Lib = Jquerypivot.Lib;
})(Jquerypivot || (Jquerypivot = {}));
//# sourceMappingURL=lib.js.map
