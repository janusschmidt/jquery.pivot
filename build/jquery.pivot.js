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
var data;
(function (data) {
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
    data.TreeNode = TreeNode;

    var adapter = (function () {
        function adapter() {
            this.alGroupByCols = [];
            this.pivotCol = null;
            this.resultCol = null;
            this.bInvSort = false;
            this.tree = new TreeNode();
            this.uniquePivotValues = [];
            this.dataid = null;
            this.sortPivotColumnHeaders = true;
        }
        adapter.prototype.sortTree = function (treeNode) {
            var i, datatype;
            if (treeNode.children && treeNode.children.length > 0) {
                for (i = 0; i < treeNode.children.length; i += 1) {
                    this.sortTree(treeNode.children[i]);
                }

                datatype = this.findCell(this.alGroupByCols, treeNode.children[0].colindex).datatype;
                treeNode.children.sort(this.getcomparer(this.bInvSort)[datatype]);
            }
        };

        adapter.prototype.findCell = function (arCells, colIndex) {
            return lib.find(arCells, function (item, index) {
                return item.colindex == this;
            }, colIndex);
        };

        adapter.prototype.getcomparer = function (bInv) {
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

        adapter.prototype.parseJSONsource = function (data) {
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
                    newObj = lib.find(curNode.children, findGroupByFunc, groupbyValue);
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
                if (!lib.exists(this.uniquePivotValues, findPivotFunc, pivotValue)) {
                    this.uniquePivotValues.push(newPivotValue);
                }
            }

            this.sortTree(this.tree);
            if (this.sortPivotColumnHeaders) {
                this.uniquePivotValues.sort(this.getcomparer(this.bInvSort)[this.pivotCol.datatype]);
            }
        };

        adapter.prototype.parseFromXhtmlTable = function (sourceTable) {
            var cellIndex, cellcount, rowIndex, rowcount, el, eltext, col, cells, row, data = {
                dataid: sourceTable.attr('dataid'),
                columns: [],
                rows: []
            }, rows = $('tbody > tr', sourceTable), columnNames = [];

            for (cellIndex = 0, cellcount = rows[0].cells.length; cellIndex < cellcount; cellIndex += 1) {
                el = $(rows[0].cells[cellIndex]);
                eltext = el.text();
                col = {
                    colvalue: el.attr('colvalue') || eltext,
                    coltext: el.attr('coltext') || eltext,
                    header: el.attr('header') || el.text(),
                    datatype: el.attr('datatype'),
                    sortbycol: el.attr('sortbycol') || eltext,
                    dataid: el.attr('dataid'),
                    groupbyrank: parseInt(el.attr('groupbyrank'), 10),
                    pivot: el.attr('pivot') === 'true',
                    result: el.attr('result') === 'true'
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
        return adapter;
    })();
    data.adapter = adapter;
})(data || (data = {}));
((function ($) {
    function calcsum(values) {
        var i, length;
        var total = 0.0;
        for (i = 0, length = values.length; i < length; i += 1) {
            total += values[i];
        }
        return total;
    }

    $.fn.pivot = function (options) {
        var opts = $.extend({}, $.fn.pivot.defaults, options);

        function resultCellClicked() {
            if (opts.onResultCellClicked) {
                var el = $(this), adapter = el.closest('table.pivot').data('jquery.pivot.adapter'), aGroupBys = [], data = el.data('def'), curNode = data.treeNode, dataObj;

                el.closest('table.pivot').find('.resultcell').removeClass('clickedResultCell');
                el.addClass('clickedResultCell');

                while (curNode.parent) {
                    aGroupBys.unshift({ dataidGroup: curNode.dataid, groupbyval: curNode.groupbyValue });
                    curNode = curNode.parent;
                }
                dataObj = {
                    dataidTable: adapter.dataid,
                    pivot: {
                        dataidPivot: data.pivot.dataid,
                        pivotvalue: data.pivot.pivotValue,
                        pivotsortvalue: data.pivot.sortby
                    },
                    groups: aGroupBys
                };
                opts.onResultCellClicked(dataObj, el);
            }
        }

        function getResValue(treeNode, pivotValue) {
            var i, i1, res, aggVals = [], pivotCells = $.map(treeNode.pivotvalues || [], function (item, index) {
                return item.pivotValue === pivotValue ? item.result : null;
            });

            if (opts.aggregatefunc) {
                if (pivotCells.length >= 1) {
                    for (i = 0; i < pivotCells.length; i += 1) {
                        aggVals.push(opts.parseNumFunc ? opts.parseNumFunc(pivotCells[i]) : pivotCells[i]);
                    }
                } else if (opts.bTotals) {
                    for (i1 = 0; i1 < treeNode.children.length; i1 += 1) {
                        aggVals.push(getResValue(treeNode.children[i1], pivotValue));
                    }
                }
                res = opts.aggregatefunc(aggVals);
            } else {
                res = null;
            }

            return res;
        }

        function appendChildRows(treeNode, belowThisRow, adapter) {
            var i, col, col1, sb, item, itemtext, result, resCell, aggVals, spanFoldUnfold, gbCols = adapter.alGroupByCols, pivotCols = adapter.uniquePivotValues, foldunfoldclass = opts.bCollapsible ? 'foldunfold' : 'nonfoldunfold', foldunfoldclassSelector = '.' + foldunfoldclass;

            for (i = 0; i < treeNode.children.length; i += 1) {
                sb = new lib.StringBuilder();
                item = treeNode.children[i];
                itemtext = (item.groupbyText === undefined || item.groupbyText === null || item.groupbyText === '&nbsp;' || item.groupbyText === '') ? opts.noGroupByText : item.groupbyText;
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
                belowThisRow.find(foldunfoldclassSelector).data('status', { bDatabound: false, treeNode: item });

                aggVals = [];
                for (col1 = 0; col1 < pivotCols.length; col1 += 1) {
                    result = getResValue(item, pivotCols[col1].pivotValue);
                    if (opts.bTotals) {
                        aggVals.push(result);
                    }
                    sb.clear();
                    sb.append('<td class="resultcell">');
                    sb.append(opts.formatFunc(result));
                    sb.append('</td>');
                    resCell = $(sb.toString()).appendTo(belowThisRow);
                    resCell.data('def', { pivot: pivotCols[col1], treeNode: item });
                }

                if (opts.bTotals) {
                    sb.clear();
                    sb.append('<td class="total">');
                    sb.append(opts.formatFunc(opts.aggregatefunc(aggVals)));
                    sb.append('</td>');
                    $(sb.toString()).appendTo(belowThisRow);
                }

                if (!opts.bCollapsible) {
                    spanFoldUnfold = belowThisRow.find(foldunfoldclassSelector);
                    if (spanFoldUnfold.length > 0) {
                        var status = spanFoldUnfold.removeClass('collapsed').data('status');
                        status.treeNode.collapsed = false;
                        status.bDatabound = true;
                        appendChildRows(status.treeNode, belowThisRow, adapter);
                        belowThisRow = belowThisRow.nextUntil('.total').last();
                    }
                }
            }
        }

        function makeCollapsed(adapter, $obj) {
            var i, i1, col, result, $pivottable, aggVals = [], sb = new lib.StringBuilder('<table class="pivot">'), gbCols = adapter.alGroupByCols, pivotCols = adapter.uniquePivotValues;

            sb.append('<tr class="head">');
            for (i = 0; i < gbCols.length; i += 1) {
                sb.append('<th class="groupby level');
                sb.append(i);
                sb.append('">');
                sb.append(gbCols[i].text);
                sb.append('</th>');
            }

            for (i1 = 0; i1 < pivotCols.length; i1 += 1) {
                sb.append('<th class="pivotcol">');
                sb.append(pivotCols[i1].pivotValue);
                sb.append('</th>');
            }

            if (opts.bTotals) {
                sb.append('<th class="total">Total</th>');
            }
            sb.append('</tr>');

            if (opts.bTotals) {
                sb.append('<tr class="total">');
                sb.append('<th class="total" colspan="');
                sb.append(gbCols.length);
                sb.append('">Total</th>');
                for (col = 0; col < pivotCols.length; col += 1) {
                    result = getResValue(adapter.tree, pivotCols[col].pivotValue);
                    if (opts.bTotals) {
                        aggVals.push(result);
                    }
                    sb.append('<td>');
                    sb.append(opts.formatFunc(result));
                    sb.append('</td>');
                }
                sb.append('<td class="total">');
                sb.append(opts.formatFunc(opts.aggregatefunc(aggVals)));
                sb.append('</td>');
                sb.append('</tr>');
            }
            sb.append('</table>');

            $obj.html('');
            $pivottable = $(sb.toString()).appendTo($obj);
            $pivottable.data('jquery.pivot.adapter', adapter);
            appendChildRows(adapter.tree, $('tr:first', $pivottable), adapter);
        }

        function foldunfoldElem(el) {
            var adapter = el.closest('table.pivot').data('jquery.pivot.adapter'), status = el.data('status'), parentRow = el.closest('tr'), visible = false, row, rowstatus, thisrowstatus;

            status.treeNode.collapsed = !status.treeNode.collapsed;

            if (status.treeNode.collapsed) {
                el.addClass('collapsed');
            } else {
                el.removeClass('collapsed');
            }

            if (!status.bDatabound) {
                appendChildRows(status.treeNode, parentRow, adapter);
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
        }

        function foldunfold() {
            foldunfoldElem($(this));
        }

        return this.each(function () {
            var $obj = $(this), adapter = new data.adapter();

            adapter.sortPivotColumnHeaders = opts.sortPivotColumnHeaders;
            $obj.empty('');
            if ((typeof opts.source === 'object' && opts.source.jquery) || opts.source.columns) {
                if (opts.source.jquery) {
                    if (opts.source.find('tr').length > 0) {
                        adapter.parseFromXhtmlTable(opts.source);
                    }
                } else {
                    adapter.parseJSONsource(opts.source);
                }

                $obj.off('click.jquery.pivot');

                $obj.on('click.jquery.pivot', '.pivot .foldunfold', foldunfold);
                if (opts.onResultCellClicked) {
                    $obj.on('click.jquery.pivot', '.resultcell', resultCellClicked);
                }

                makeCollapsed(adapter, $obj);
            }

            if ($obj.html() === '') {
                $obj.html('<h1>' + opts.noDataText + '</h1>');
            }
        });
    };

    $.fn.pivot.defaults = {
        source: null,
        bTotals: true,
        bCollapsible: true,
        aggregatefunc: calcsum,
        formatFunc: function (n) {
            return n;
        },
        parseNumFunc: function (n) {
            return +n;
        },
        onResultCellClicked: null,
        noGroupByText: 'No value',
        noDataText: 'No data',
        sortPivotColumnHeaders: true
    };

    $.fn.pivot.formatDK = function (num, decimals) {
        return this.formatLocale(num, decimals, '.', ',');
    };
    $.fn.pivot.formatUK = function (num, decimals) {
        return this.formatLocale(num, decimals, ',', '.');
    };
    $.fn.pivot.formatLocale = function (num, decimals, kilosep, decimalsep) {
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
    };
})(jQuery));
