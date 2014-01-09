var jquerypivot;
(function (jquerypivot) {
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

        function map(ar, fun, extra) {
            var i, len, res = [], item;
            if (ar) {
                 {
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
    })(jquerypivot.lib || (jquerypivot.lib = {}));
    var lib = jquerypivot.lib;
})(jquerypivot || (jquerypivot = {}));
var jquerypivot;
(function (jquerypivot) {
    function sortgroupbys(rowA, rowB) {
        var a = +rowA.groupbyrank, b = +rowB.groupbyrank;

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

    function trim(oIn) {
        if (typeof oIn === 'string' || oIn === null) {
            return $.trim(oIn);
        } else {
            return oIn;
        }
    }

    var TreeNode = (function () {
        function TreeNode() {
            this.children = [];
            this.pivotvalues = [];
        }
        TreeNode.prototype.visible = function () {
            return this.parent === undefined || (!this.parent.collapsed && (!this.parent.visible || this.parent.visible()));
        };
        return TreeNode;
    })();
    jquerypivot.TreeNode = TreeNode;

    var Adapter = (function () {
        function Adapter() {
            this.alGroupByCols = [];
            this.pivotCol = null;
            this.resultCol = null;
            this.bInvSort = false;
            this.tree = new TreeNode();
            this.uniquePivotValues = [];
            this.dataid = null;
            this.sortPivotColumnHeaders = true;
        }
        Adapter.prototype.sortTree = function (treeNode) {
            var i, datatype;
            if (treeNode.children && treeNode.children.length > 0) {
                for (i = 0; i < treeNode.children.length; i += 1) {
                    this.sortTree(treeNode.children[i]);
                }

                datatype = this.findCell(this.alGroupByCols, treeNode.children[0].colindex).datatype;
                treeNode.children.sort(this.getcomparer(this.bInvSort)[datatype]);
            }
        };

        Adapter.prototype.findCell = function (arCells, colIndex) {
            return jquerypivot.lib.find(arCells, function (item, index) {
                return item.colindex == this;
            }, colIndex);
        };

        Adapter.prototype.getcomparer = function (bInv) {
            function comp(f) {
                return function (rowA, rowB) {
                    var out = (f(rowA.sortby) < f(rowB.sortby)) ? -1 : (f(rowA.sortby) > f(rowB.sortby)) ? 1 : 0;
                    return bInv ? -out : out;
                };
            }

            return {
                'string': comp(function (s) {
                    return s;
                }),
                'number': comp(function (i) {
                    return +i;
                })
            };
        };

        Adapter.prototype.parseJSONsource = function (data) {
            var cellIndex, cellcount, rowIndex, rowcount, i, sourcecol, treecol, curNode, newObj, groupbyValue, groupbyText, sortbyValue, pivotValue, pivotSortBy, result, newPivotValue, rowitem, row;

            this.dataid = data.dataid;

            for (cellIndex = 0, cellcount = data.columns.length; cellIndex < cellcount; cellIndex += 1) {
                sourcecol = data.columns[cellIndex];
                treecol = {
                    colvalue: sourcecol.colvalue,
                    coltext: sourcecol.coltext,
                    text: sourcecol.header || sourcecol.coltext || sourcecol.colvalue,
                    colindex: cellIndex,
                    datatype: sourcecol.datatype || 'string',
                    sortbycol: sourcecol.sortbycol || sourcecol.coltext || sourcecol.colvalue,
                    dataid: sourcecol.dataid || sourcecol.colvalue,
                    groupbyrank: sourcecol.groupbyrank
                };

                if (typeof (treecol.groupbyrank) === 'number' && isFinite(treecol.groupbyrank)) {
                    this.alGroupByCols.push(treecol);
                } else if (sourcecol.pivot) {
                    this.pivotCol = treecol;
                } else if (sourcecol.result) {
                    this.resultCol = treecol;
                }
            }

            this.alGroupByCols.sort(sortgroupbys);

            function findGroupByFunc(item, index) {
                return item.groupbyValue == this;
            }
            function findPivotFunc(item, index) {
                return item.pivotValue == this;
            }

            for (rowIndex = 0, rowcount = data.rows.length; rowIndex < rowcount; rowIndex += 1) {
                row = data.rows[rowIndex];
                curNode = this.tree;

                for (i = 0; i < this.alGroupByCols.length; i += 1) {
                    groupbyValue = trim(row[this.alGroupByCols[i].colvalue]);
                    groupbyText = row[this.alGroupByCols[i].coltext];
                    sortbyValue = trim(row[this.alGroupByCols[i].sortbycol]);
                    newObj = jquerypivot.lib.find(curNode.children, findGroupByFunc, groupbyValue);
                    if (!newObj) {
                        newObj = new TreeNode();
                        newObj.groupbyValue = groupbyValue;
                        newObj.groupbyText = groupbyText;
                        newObj.colindex = this.alGroupByCols[i].colindex;
                        newObj.children = [];
                        newObj.sortby = sortbyValue;
                        newObj.parent = curNode;
                        newObj.dataid = this.alGroupByCols[i].dataid;
                        newObj.collapsed = true;
                        newObj.groupbylevel = i;
                        curNode.children.push(newObj);
                    }

                    curNode = newObj;
                }

                pivotValue = trim(row[this.pivotCol.colvalue]);
                pivotSortBy = trim(row[this.pivotCol.sortbycol]);
                result = trim(row[this.resultCol.colvalue]);
                newPivotValue = { pivotValue: pivotValue, result: result, sortby: pivotSortBy, dataid: this.pivotCol.dataid };
                curNode.pivotvalues.push(newPivotValue);
                if (!jquerypivot.lib.exists(this.uniquePivotValues, findPivotFunc, pivotValue)) {
                    this.uniquePivotValues.push(newPivotValue);
                }
            }

            this.sortTree(this.tree);
            if (this.sortPivotColumnHeaders) {
                this.uniquePivotValues.sort(this.getcomparer(this.bInvSort)[this.pivotCol.datatype]);
            }
        };

        Adapter.prototype.parseFromHtmlTable = function (sourceTable) {
            var cellIndex, cellcount, rowIndex, rowcount, el, eltext, col, cells, row, data = {
                dataid: sourceTable.data('pivot-dataid'),
                columns: [],
                rows: []
            }, rows = $('tbody > tr', sourceTable), columnNames = [];

            for (cellIndex = 0, cellcount = rows[0].cells.length; cellIndex < cellcount; cellIndex += 1) {
                el = $(rows[0].cells[cellIndex]);
                eltext = el.text();
                col = {
                    colvalue: el.data('pivot-colvalue') || eltext,
                    coltext: el.data('pivot-coltext') || eltext,
                    header: el.data('pivot-header') || el.text(),
                    datatype: el.data('pivot-datatype'),
                    sortbycol: el.data('pivot-sortbycol') || eltext,
                    dataid: el.data('pivot-dataid'),
                    groupbyrank: parseInt(el.data('pivot-groupbyrank'), 10),
                    pivot: el.data('pivot-pivot'),
                    result: el.data('pivot-result')
                };
                data.columns.push(col);
                columnNames.push(eltext);
            }

            for (rowIndex = 1, rowcount = rows.length; rowIndex < rowcount; rowIndex += 1) {
                cells = rows[rowIndex].cells;
                row = {};
                for (cellIndex = 0, cellcount = columnNames.length; cellIndex < cellcount; cellIndex += 1) {
                    eltext = cells[cellIndex].innerHTML;
                    row[columnNames[cellIndex]] = (data.columns[cellIndex].datatype === 'number') ? parseFloat(eltext) : eltext;
                }
                data.rows.push(row);
            }

            this.parseJSONsource(data);
        };
        return Adapter;
    })();
    jquerypivot.Adapter = Adapter;
})(jquerypivot || (jquerypivot = {}));
var jquerypivot;
(function (jquerypivot) {
    $ = jQuery;

    function calcsum(values) {
        var i, length;
        var total = 0.0;
        for (i = 0, length = values.length; i < length; i += 1) {
            total += values[i];
        }
        return total;
    }

    function formatDK(num, decimals) {
        return this.formatLocale(num, decimals, '.', ',');
    }
    function formatUK(num, decimals) {
        return this.formatLocale(num, decimals, ',', '.');
    }
    function formatLocale(num, decimals, kilosep, decimalsep) {
        var i, bNeg = num < 0, x = Math.round(num * Math.pow(10, decimals)), y = Math.abs(x).toString().split(''), z = y.length - decimals;

        if (z <= 0) {
            for (i = 0; i <= -z; i += 1) {
                y.unshift('0');
            }
            z = 1;
        }
        if (decimals > 0) {
            y.splice(z, 0, decimalsep);
        }
        while (z > 3) {
            z -= 3;
            y.splice(z, 0, kilosep);
        }
        if (bNeg) {
            y.splice(0, 0, '-');
        }
        return y.join('');
    }

    var jqueryPivotOptions = (function () {
        function jqueryPivotOptions(source, bTotals, bCollapsible, aggregatefunc, formatFunc, parseNumFunc, onResultCellClicked, noGroupByText, noDataText, sortPivotColumnHeaders) {
            if (typeof source === "undefined") { source = null; }
            if (typeof bTotals === "undefined") { bTotals = true; }
            if (typeof bCollapsible === "undefined") { bCollapsible = true; }
            if (typeof aggregatefunc === "undefined") { aggregatefunc = calcsum; }
            if (typeof formatFunc === "undefined") { formatFunc = function (n) {
                return n;
            }; }
            if (typeof parseNumFunc === "undefined") { parseNumFunc = function (n) {
                return +n;
            }; }
            if (typeof onResultCellClicked === "undefined") { onResultCellClicked = null; }
            if (typeof noGroupByText === "undefined") { noGroupByText = 'No value'; }
            if (typeof noDataText === "undefined") { noDataText = 'No data'; }
            if (typeof sortPivotColumnHeaders === "undefined") { sortPivotColumnHeaders = true; }
            this.source = source;
            this.bTotals = bTotals;
            this.bCollapsible = bCollapsible;
            this.aggregatefunc = aggregatefunc;
            this.formatFunc = formatFunc;
            this.parseNumFunc = parseNumFunc;
            this.onResultCellClicked = onResultCellClicked;
            this.noGroupByText = noGroupByText;
            this.noDataText = noDataText;
            this.sortPivotColumnHeaders = sortPivotColumnHeaders;
        }
        return jqueryPivotOptions;
    })();
    jquerypivot.jqueryPivotOptions = jqueryPivotOptions;

    var resultCellClickedInfoPivotInfo = (function () {
        function resultCellClickedInfoPivotInfo(dataidPivot, pivotvalue, pivotsortvalue) {
            this.dataidPivot = dataidPivot;
            this.pivotvalue = pivotvalue;
            this.pivotsortvalue = pivotsortvalue;
        }
        return resultCellClickedInfoPivotInfo;
    })();
    jquerypivot.resultCellClickedInfoPivotInfo = resultCellClickedInfoPivotInfo;

    var resultCellClickedInfoGroupByInfo = (function () {
        function resultCellClickedInfoGroupByInfo(dataidGroup, groupbyval) {
            this.dataidGroup = dataidGroup;
            this.groupbyval = groupbyval;
        }
        return resultCellClickedInfoGroupByInfo;
    })();
    jquerypivot.resultCellClickedInfoGroupByInfo = resultCellClickedInfoGroupByInfo;

    var resultCellClickedInfo = (function () {
        function resultCellClickedInfo(dataidTable, pivot, groups) {
            this.dataidTable = dataidTable;
            this.pivot = pivot;
            this.groups = groups;
        }
        return resultCellClickedInfo;
    })();
    jquerypivot.resultCellClickedInfo = resultCellClickedInfo;

    var groupbynodeStatus = (function () {
        function groupbynodeStatus(bDatabound, treeNode) {
            this.bDatabound = bDatabound;
            this.treeNode = treeNode;
        }
        return groupbynodeStatus;
    })();

    var pivot = (function () {
        function pivot(suppliedoptions) {
            var _this = this;
            this.resultCellClicked = function (e) {
                var el = $(e.target), adapter = el.closest('table.pivot').data('jquery.pivot.adapter'), aGroupBys = [], data = el.data('def'), curNode = data.treeNode, dataObj;

                if (_this.opts.onResultCellClicked) {
                    el.closest('table.pivot').find('.resultcell').removeClass('clickedResultCell');
                    el.addClass('clickedResultCell');

                    while (curNode.parent) {
                        aGroupBys.unshift(new resultCellClickedInfoGroupByInfo(curNode.dataid, curNode.groupbyValue));
                        curNode = curNode.parent;
                    }
                    dataObj = new resultCellClickedInfo(adapter.dataid, new resultCellClickedInfoPivotInfo(data.pivot.dataid, data.pivot.pivotValue, data.pivot.sortby), aGroupBys);
                    _this.opts.onResultCellClicked(dataObj, el);
                }
            };
            this.getResValue = function (treeNode, pivotValue) {
                var i, res, aggVals = [], pivotCells = jquerypivot.lib.map(treeNode.pivotvalues || [], function (item, index) {
                    return item.pivotValue === pivotValue ? item.result : null;
                });

                if (_this.opts.aggregatefunc) {
                    if (pivotCells.length >= 1) {
                        for (i = 0; i < pivotCells.length; i += 1) {
                            aggVals.push(_this.opts.parseNumFunc ? _this.opts.parseNumFunc(pivotCells[i]) : pivotCells[i]);
                        }
                    } else if (_this.opts.bTotals) {
                        for (i = 0; i < treeNode.children.length; i += 1) {
                            aggVals.push(_this.getResValue(treeNode.children[i], pivotValue));
                        }
                    }
                    res = _this.opts.aggregatefunc(aggVals);
                } else {
                    res = null;
                }

                return res;
            };
            this.appendChildRows = function (treeNode, belowThisRow, adapter) {
                var i, col, col1, sb, item, itemtext, result, resCell, aggVals, spanFoldUnfold, gbCols = adapter.alGroupByCols, pivotCols = adapter.uniquePivotValues, foldunfoldclass = _this.opts.bCollapsible ? 'foldunfold' : 'nonfoldunfold', foldunfoldclassSelector = '.' + foldunfoldclass, status;

                for (i = 0; i < treeNode.children.length; i += 1) {
                    sb = new jquerypivot.lib.StringBuilder();
                    item = treeNode.children[i];
                    itemtext = (item.groupbyText === undefined || item.groupbyText === null || item.groupbyText === '&nbsp;' || item.groupbyText === '') ? _this.opts.noGroupByText : item.groupbyText;
                    sb.append('<tr class="level');
                    sb.append(item.groupbylevel);
                    sb.append('">');
                    for (col = 0; col < gbCols.length; col += 1) {
                        sb.append('<th class="groupby level');
                        sb.append(col);
                        sb.append('">');
                        if (gbCols[col].colindex === item.colindex) {
                            if (item.children.length > 0) {
                                sb.append('<span class="');
                                sb.append(foldunfoldclass);
                                sb.append(' collapsed">');
                                sb.append(itemtext);
                                sb.append(' </span>');
                            } else {
                                sb.append(itemtext);
                            }
                        } else {
                            sb.append(' ');
                        }

                        sb.append('</th>');
                    }
                    sb.append('</tr>');
                    belowThisRow = $(sb.toString()).insertAfter(belowThisRow);
                    belowThisRow.find(foldunfoldclassSelector).data('status', new groupbynodeStatus(false, item));

                    aggVals = [];
                    for (col1 = 0; col1 < pivotCols.length; col1 += 1) {
                        result = _this.getResValue(item, pivotCols[col1].pivotValue);
                        if (_this.opts.bTotals) {
                            aggVals.push(result);
                        }
                        sb.clear();
                        sb.append('<td class="resultcell">');
                        sb.append(_this.opts.formatFunc(result));
                        sb.append('</td>');
                        resCell = $(sb.toString()).appendTo(belowThisRow);
                        resCell.data('def', { pivot: pivotCols[col1], treeNode: item });
                    }

                    if (_this.opts.bTotals) {
                        sb.clear();
                        sb.append('<td class="total">');
                        sb.append(_this.opts.formatFunc(_this.opts.aggregatefunc(aggVals)));
                        sb.append('</td>');
                        $(sb.toString()).appendTo(belowThisRow);
                    }

                    if (!_this.opts.bCollapsible) {
                        spanFoldUnfold = belowThisRow.find(foldunfoldclassSelector);
                        if (spanFoldUnfold.length > 0) {
                            status = spanFoldUnfold.removeClass('collapsed').data('status');
                            status.treeNode.collapsed = false;
                            status.bDatabound = true;
                            _this.appendChildRows(status.treeNode, belowThisRow, adapter);
                            belowThisRow = belowThisRow.nextUntil('.total').last();
                        }
                    }
                }
            };
            this.makeCollapsed = function (adapter, $obj) {
                var i, col, result, $pivottable, aggVals = [], sb = new jquerypivot.lib.StringBuilder('<table class="pivot">'), gbCols = adapter.alGroupByCols, pivotCols = adapter.uniquePivotValues;

                sb.append('<tr class="head">');
                for (i = 0; i < gbCols.length; i += 1) {
                    sb.append('<th class="groupby level');
                    sb.append(i);
                    sb.append('">');
                    sb.append(gbCols[i].text);
                    sb.append('</th>');
                }

                for (i = 0; i < pivotCols.length; i += 1) {
                    sb.append('<th class="pivotcol">');
                    sb.append(pivotCols[i].pivotValue);
                    sb.append('</th>');
                }

                if (_this.opts.bTotals) {
                    sb.append('<th class="total">Total</th>');
                }
                sb.append('</tr>');

                if (_this.opts.bTotals) {
                    sb.append('<tr class="total">');
                    sb.append('<th class="total" colspan="');
                    sb.append(gbCols.length);
                    sb.append('">Total</th>');
                    for (col = 0; col < pivotCols.length; col += 1) {
                        result = _this.getResValue(adapter.tree, pivotCols[col].pivotValue);
                        if (_this.opts.bTotals) {
                            aggVals.push(result);
                        }
                        sb.append('<td>');
                        sb.append(_this.opts.formatFunc(result));
                        sb.append('</td>');
                    }
                    sb.append('<td class="total">');
                    sb.append(_this.opts.formatFunc(_this.opts.aggregatefunc(aggVals)));
                    sb.append('</td>');
                    sb.append('</tr>');
                }
                sb.append('</table>');

                $obj.html('');
                $pivottable = $(sb.toString()).appendTo($obj);
                $pivottable.data('jquery.pivot.adapter', adapter);
                _this.appendChildRows(adapter.tree, $('tr:first', $pivottable), adapter);
            };
            this.foldunfoldElem = function (el) {
                var adapter = el.closest('table.pivot').data('jquery.pivot.adapter'), status = el.data('status'), parentRow = el.closest('tr'), visible = false, row, rowstatus, thisrowstatus;

                status.treeNode.collapsed = !status.treeNode.collapsed;

                if (status.treeNode.collapsed) {
                    el.addClass('collapsed');
                } else {
                    el.removeClass('collapsed');
                }

                if (!status.bDatabound) {
                    _this.appendChildRows(status.treeNode, parentRow, adapter);
                    status.bDatabound = true;
                } else {
                    row = parentRow;
                    rowstatus = status;
                    while ((row = row.next()).length > 0) {
                        thisrowstatus = row.find('.foldunfold').data('status');

                        if ((thisrowstatus && thisrowstatus.treeNode.groupbylevel <= status.treeNode.groupbylevel) || row.is('.total')) {
                            break;
                        }

                        if (thisrowstatus) {
                            rowstatus = thisrowstatus;
                            visible = rowstatus.treeNode.visible();
                        } else {
                            visible = rowstatus.treeNode.visible() && !rowstatus.treeNode.collapsed;
                        }

                        row.toggle(visible);
                    }
                }
            };
            this.foldunfold = function (e) {
                _this.foldunfoldElem($(e.target));
            };
            this.opts = $.extend({}, $.fn.pivot.defaults, suppliedoptions);
        }
        return pivot;
    })();
    jquerypivot.pivot = pivot;

    $.fn.pivot = function (options) {
        var p = new pivot(options);
        return this.each(function () {
            var item = $(this), adapter = new jquerypivot.Adapter(), opts = p.opts;

            adapter.sortPivotColumnHeaders = opts.sortPivotColumnHeaders;
            item.empty();
            if ((typeof opts.source === 'object' && opts.source.jquery) || opts.source.columns) {
                if (opts.source.jquery) {
                    if (opts.source.find('tr').length > 0) {
                        adapter.parseFromHtmlTable(opts.source);
                    }
                } else {
                    adapter.parseJSONsource(opts.source);
                }

                item.off('click.jquery.pivot');

                item.on('click.jquery.pivot', '.pivot .foldunfold', p.foldunfold);
                if (opts.onResultCellClicked) {
                    item.on('click.jquery.pivot', '.resultcell', p.resultCellClicked);
                }

                p.makeCollapsed(adapter, item);
            }

            if (item.html() === '') {
                item.html('<h1>' + opts.noDataText + '</h1>');
            }
        });
    };

    $.fn.pivot.defaults = new jqueryPivotOptions();
    $.fn.pivot.formatDK = formatDK;
    $.fn.pivot.formatUK = formatUK;
    $.fn.pivot.formatLocale = formatLocale;
})(jquerypivot || (jquerypivot = {}));
var example5JSONdata = {
    'dataid': 'An identifier for the table',
    'columns': [
        { 'colvalue': 'companyid ', 'coltext': 'companyid ', 'header': 'companyid ', 'datatype': 'number', 'sortbycol': 'companyid ', 'groupbyrank': 2, 'pivot': false, 'result': false },
        { 'colvalue': 'userid ', 'coltext': 'userid ', 'header': 'userid ', 'datatype': 'number', 'sortbycol': 'userid ', 'groupbyrank': 3, 'pivot': false, 'result': false },
        { 'colvalue': 'date ', 'coltext': 'date ', 'header': 'date ', 'sortbycol': 'date ', 'dataid': 'idforpivot', 'groupbyrank': null, 'pivot': true, 'result': false },
        { 'colvalue': 'regMinutes ', 'coltext': 'regMinutes ', 'header': 'regMinutes ', 'sortbycol': 'regMinutes ', 'groupbyrank': null, 'pivot': false, 'result': false },
        { 'colvalue': 'flexMinutes ', 'coltext': 'flexMinutes ', 'header': 'flexMinutes ', 'sortbycol': 'flexMinutes ', 'groupbyrank': null, 'pivot': false, 'result': false },
        { 'colvalue': 'correction ', 'coltext': 'correction ', 'header': 'correction ', 'sortbycol': 'correction ', 'groupbyrank': null, 'pivot': false, 'result': false },
        { 'colvalue': 'diffMinutes ', 'coltext': 'diffMinutes ', 'header': 'diffMinutes ', 'sortbycol': 'diffMinutes ', 'groupbyrank': null, 'pivot': false, 'result': true }
    ],
    'rows': [
        { 'companyid ': 2, 'userid ': 1, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '330 ', 'correction ': '0 ', 'diffMinutes ': '-330 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '330 ', 'correction ': '0 ', 'diffMinutes ': '-330 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
        { 'companyid ': 2, 'userid ': 1, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '480 ', 'correction ': '0 ', 'diffMinutes ': '-480 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 18, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 86, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 87, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
        { 'companyid ': 4, 'userid ': 88, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 89, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 90, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 91, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 92, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
        { 'companyid ': 4, 'userid ': 93, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '480 ', 'correction ': '0 ', 'diffMinutes ': '-480 ' },
        { 'companyid ': 4, 'userid ': 94, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 95, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
        { 'companyid ': 4, 'userid ': 121, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' }]
};

var htmlTableData = '<table id="htmlTableData" data-pivot-dataid="An optional sourcetable identifier" style="display: none;"> ' + '                <tr>                                                                                         ' + '                    <th data-pivot-pivot="true">Month </th>                                                  ' + '                    <th data-pivot-groupbyrank="2">Subject </th>                                             ' + '                    <th data-pivot-groupbyrank="1" data-pivot-dataid="An optional id.">Student </th>         ' + '                    <th data-pivot-result="true">Score </th>                                                 ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January</td>                                                                         ' + '                    <td>English</td>                                                                         ' + '                    <td>Elisa</td>                                                                           ' + '                    <td>8.7</td>                                                                             ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>Maths </td>                                                                          ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>6.5 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>Science </td>                                                                        ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>5.8 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>Art </td>                                                                            ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>8.9 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>History </td>                                                                        ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>8.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>French </td>                                                                         ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>6.2 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>English </td>                                                                        ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>5.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>Maths </td>                                                                          ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>7.2 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>Science </td>                                                                        ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>8.9 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>Art </td>                                                                            ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>8.3 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>History </td>                                                                        ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>8.4 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>French </td>                                                                         ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>5.7 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>English </td>                                                                        ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>4.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>Maths </td>                                                                          ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>7.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>Science </td>                                                                        ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>4.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>Art </td>                                                                            ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>9.2 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>History </td>                                                                        ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>9.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>French </td>                                                                         ' + '                    <td>Elisa </td>                                                                          ' + '                    <td>5.6 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>english </td>                                                                        ' + '                    <td>Mary </td>                                                                           ' + '                    <td>8.7 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>Maths </td>                                                                          ' + '                    <td>Mary </td>                                                                           ' + '                    <td>5.3 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>Science </td>                                                                        ' + '                    <td>Mary </td>                                                                           ' + '                    <td>3.5 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>Art </td>                                                                            ' + '                    <td>Mary </td>                                                                           ' + '                    <td>6.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>History </td>                                                                        ' + '                    <td>Mary </td>                                                                           ' + '                    <td>5.8 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>January </td>                                                                        ' + '                    <td>French </td>                                                                         ' + '                    <td>Mary </td>                                                                           ' + '                    <td>9.2 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>english </td>                                                                        ' + '                    <td>Mary </td>                                                                           ' + '                    <td>6.8 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>Maths </td>                                                                          ' + '                    <td>Mary </td>                                                                           ' + '                    <td>5.4 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>Science </td>                                                                        ' + '                    <td>Mary </td>                                                                           ' + '                    <td>5.6 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>Art </td>                                                                            ' + '                    <td>Mary </td>                                                                           ' + '                    <td>5.9 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>History </td>                                                                        ' + '                    <td>Mary </td>                                                                           ' + '                    <td>6.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>February </td>                                                                       ' + '                    <td>French </td>                                                                         ' + '                    <td>Mary </td>                                                                           ' + '                    <td>9.3 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>english </td>                                                                        ' + '                    <td>Mary </td>                                                                           ' + '                    <td>4.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>Maths </td>                                                                          ' + '                    <td>Mary </td>                                                                           ' + '                    <td>3.5 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>Science </td>                                                                        ' + '                    <td>Mary </td>                                                                           ' + '                    <td>4.1 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>Art </td>                                                                            ' + '                    <td>Mary </td>                                                                           ' + '                    <td>4.8 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>History </td>                                                                        ' + '                    <td>Mary </td>                                                                           ' + '                    <td>6.7 </td>                                                                            ' + '                </tr>                                                                                        ' + '                <tr>                                                                                         ' + '                    <td>March </td>                                                                          ' + '                    <td>French </td>                                                                         ' + '                    <td>Mary </td>                                                                           ' + '                    <td>9.0 </td>                                                                            ' + '                </tr>                                                                                        ' + '            </table>                                                                                         ';

if (typeof (jasmine.HtmlReporter) == 'function') {
    describe("Adapter", function () {
        var JSONdata = $.extend({}, example5JSONdata), rows = JSONdata.rows.slice(0, 100), maxMilliSeconds = 1000, i;

        JSONdata.rows = rows.slice(0);
        for (i = 1; i < 100; i = i + 1) {
            $.merge(JSONdata.rows, rows);
        }

        it("processes " + JSONdata.rows.length + " lines in less than " + maxMilliSeconds + " ms (Rough test that nothing has has broken performance)", function () {
            var sut, ticks;

            ticks = (new Date()).getTime();
            sut = new jquerypivot.Adapter();
            sut.parseJSONsource(JSONdata);
            ticks = (new Date()).getTime() - ticks;
            expect(ticks).toBeLessThan(maxMilliSeconds);
        });
    });
}

describe("Pivot from json", function () {
    var sut;

    beforeEach(function () {
        $('body').append('<div id="pivotdiv"></div>');
        sut = $('#pivotdiv').pivot({
            source: example5JSONdata,
            formatFunc: function (n) {
                return jQuery.fn.pivot.formatDK(n, 2);
            },
            parseNumFunc: function (n) {
                return +((typeof n === 'string') ? n.replace('.', '').replace(',', '.') : n);
            },
            bCollapsible: false
        });
    });

    afterEach(function () {
        $('#pivotdiv').remove();
    });

    describe("with format function and expand all", function () {
        it("shows the correct amount of groupby columns", function () {
            expect(sut.find('table.pivot tr.head th.groupby').length).toEqual(2);
        });

        it("shows the correct amount of sorted pivot columns headers", function () {
            var shouldbe = [
                '01-08-2009',
                '02-08-2009',
                '03-08-2009',
                '04-08-2009',
                '05-08-2009',
                '06-08-2009',
                '07-08-2009',
                '08-08-2009',
                '09-08-2009',
                '10-08-2009',
                '11-08-2009',
                '12-08-2009'];

            var res = sut.find('table.pivot tr.head th.pivotcol').map(function () {
                return $(this).text();
            }).get();
            expect(sut.find('table.pivot tr.head th.pivotcol').length).toEqual(12);
            expect(res).toEqual(shouldbe);
        });

        it("Has the right level0 groupby values", function () {
            var expectedLevelGroupByValues = ['2', '', '4', ''];
            var expectedSums = [
                '0,00', '0,00', '-330,00', '-300,00', '-300,00', '-300,00', '-300,00', '0,00', '0,00', '-330,00', '-300,00', '-300,00',
                '0,00', '0,00', '-5.040,00', '-5.040,00', '-5.130,00', '-4.650,00', '-4.380,00', '0,00', '0,00', '-5.040,00', '-5.040,00', '-5.130,00'];

            var levelGroupbyValues = $('table.pivot tr.level0 th').map(function () {
                return $.trim($(this).text());
            }).get();
            var rowSums = $('table.pivot tr.level0 td.resultcell').map(function () {
                return $(this).text();
            }).get();

            expect(expectedLevelGroupByValues).toEqual(levelGroupbyValues);
            expect(rowSums).toEqual(expectedSums);
        });

        it("Has the right level1 groupby values", function () {
            var expectedLevelGroupByValues = ["", "1", "", "18", "", "86", "", "87", "", "88", "", "89", "", "90", "", "91", "", "92", "", "93", "", "94", "", "95", "", "121"];
            var expectedSums = [
                '0,00', '0,00', '-330,00', '-300,00', '-300,00', '-300,00', '-300,00', '0,00', '0,00', '-330,00', '-300,00', '-300,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00',
                '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00',
                '-450,00', '0,00', '0,00', '-360,00', '-360,00', '-360,00', '-360,00', '-360,00', '0,00', '0,00', '-360,00', '-360,00', '-360,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00',
                '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00',
                '-450,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '0,00', '0,00', '-390,00', '-390,00', '-390,00',
                '-390,00', '-360,00', '0,00', '0,00', '-390,00', '-390,00', '-390,00', '0,00', '0,00', '-420,00', '-390,00', '-390,00', '0,00', '0,00', '0,00', '0,00', '-420,00', '-390,00',
                '-390,00', '0,00', '0,00', '-360,00', '-390,00', '-480,00', '-390,00', '-360,00', '0,00', '0,00', '-360,00', '-390,00', '-480,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00',
                '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00',
                '-450,00', '0,00', '0,00', '-360,00', '-360,00', '-360,00', '-360,00', '-360,00', '0,00', '0,00', '-360,00', '-360,00', '-360,00'];

            var levelGroupbyValues = $('table.pivot tr.level1 th').map(function () {
                return $.trim($(this).text());
            }).get();
            var levelSums = $('table.pivot tr.level1 td.resultcell').map(function () {
                return $(this).text();
            }).get();

            expect(levelGroupbyValues).toEqual(expectedLevelGroupByValues);
            expect(levelSums).toEqual(expectedSums);
        });

        it("Has the right row totals", function () {
            var expectedRowTotals = ["-2.460,00", "-2.460,00", "-39.450,00", "-3.570,00", "-3.570,00", "-2.880,00", "-3.570,00", "-3.570,00", "-3.570,00", "-3.090,00", "-2.400,00", "-3.210,00", "-3.570,00", "-3.570,00", "-2.880,00"];
            var rowTotals = $('table.pivot tr:not(.total) td.total').map(function () {
                return $.trim($(this).text());
            }).get();

            expect(rowTotals).toEqual(expectedRowTotals);
        });

        it("Has the right pivot column totals", function () {
            var expectedPivotColumnTotals = ["0,00", "0,00", "-5.370,00", "-5.340,00", "-5.430,00", "-4.950,00", "-4.680,00", "0,00", "0,00", "-5.370,00", "-5.340,00", "-5.430,00", "-41.910,00"];
            var pivotColumnTotals = $('table.pivot tr.total td').map(function () {
                return $.trim($(this).text());
            }).get();

            expect(pivotColumnTotals).toEqual(expectedPivotColumnTotals);
        });
    });
});

describe("Pivot from html table", function () {
    var sut;

    beforeEach(function () {
        $('body').append(htmlTableData).append('<div id="pivotdiv"></div>');
        sut = $('#pivotdiv').pivot({
            source: $('#htmlTableData'),
            formatFunc: function (n) {
                return jQuery.fn.pivot.formatUK(n, 2);
            },
            bCollapsible: false,
            sortPivotColumnHeaders: false
        });
    });

    afterEach(function () {
        $('#pivotdiv, #htmlTableData').remove();
    });

    describe("with format function and expand all", function () {
        it("shows the correct amount of groupby columns", function () {
            expect(sut.find('table.pivot tr.head th.groupby').length).toEqual(2);
        });

        it("shows the correct amount of sorted pivot columns headers", function () {
            var shouldbe = ['January', 'February', 'March'];

            var res = sut.find('table.pivot tr.head th.pivotcol').map(function () {
                return $(this).text();
            }).get();
            expect(sut.find('table.pivot tr.head th.pivotcol').length).toEqual(3);
            expect(res).toEqual(shouldbe);
        });

        it("Has the right level0 groupby values", function () {
            var expectedLevelGroupByValues = ['Elisa', '', 'Mary', ''];
            var expectedSums = ['44.20', '43.60', '39.20', '38.60', '39.10', '32.20'];

            var levelGroupbyValues = $('table.pivot tr.level0 th').map(function () {
                return $.trim($(this).text());
            }).get();
            var rowSums = $('table.pivot tr.level0 td.resultcell').map(function () {
                return $(this).text();
            }).get();

            expect(expectedLevelGroupByValues).toEqual(levelGroupbyValues);
            expect(rowSums).toEqual(expectedSums);
        });

        it("Has the right level1 groupby values", function () {
            var expectedLevelGroupByValues = ['', 'Art', '', 'English', '', 'French', '', 'History', '', 'Maths', '', 'Science', '', 'Art', '', 'French', '', 'History', '', 'Maths', '', 'Science', '', 'english'];
            var expectedSums = ['8.90', '8.30', '9.20', '8.70', '5.10', '4.10', '6.20', '5.70', '5.60', '8.10', '8.40', '9.10', '6.50', '7.20', '7.10', '5.80', '8.90', '4.10', '6.10', '5.90', '4.80', '9.20', '9.30', '9.00', '5.80', '6.10', '6.70', '5.30', '5.40', '3.50', '3.50', '5.60', '4.10', '8.70', '6.80', '4.10'];

            var levelGroupbyValues = $('table.pivot tr.level1 th').map(function () {
                return $.trim($(this).text());
            }).get();
            var levelSums = $('table.pivot tr.level1 td.resultcell').map(function () {
                return $(this).text();
            }).get();

            expect(levelGroupbyValues).toEqual(expectedLevelGroupByValues);
            expect(levelSums).toEqual(expectedSums);
        });

        it("Has the right row totals", function () {
            var expectedRowTotals = ['127.00', '26.40', '17.90', '17.50', '25.60', '20.80', '18.80', '109.90', '16.80', '27.50', '18.60', '14.20', '13.20', '19.60'];
            var rowTotals = $('table.pivot tr:not(.total) td.total').map(function () {
                return $.trim($(this).text());
            }).get();

            expect(rowTotals).toEqual(expectedRowTotals);
        });

        it("Has the right pivot column totals", function () {
            var expectedPivotColumnTotals = ['82.80', '82.70', '71.40', '236.90'];
            var pivotColumnTotals = $('table.pivot tr.total td').map(function () {
                return $.trim($(this).text());
            }).get();

            expect(pivotColumnTotals).toEqual(expectedPivotColumnTotals);
        });
    });
});
//# sourceMappingURL=spec.js.map
