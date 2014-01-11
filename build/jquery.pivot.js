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
var Jquerypivot;
(function (Jquerypivot) {
    (function (_Adapter) {
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
                this.uniqueGroupByValuesLookup = {};
                this.pivotResultValuesLookup = {};
            }
            TreeNode.prototype.visible = function () {
                return this.parent === undefined || (!this.parent.collapsed && (!this.parent.visible || this.parent.visible()));
            };
            return TreeNode;
        })();
        _Adapter.TreeNode = TreeNode;

        var Adapter = (function () {
            function Adapter() {
                this.uniquePivotValuesLookup = {};
                this.alGroupByCols = [];
                this.pivotCol = null;
                this.resultCol = [];
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
                return Jquerypivot.Lib.find(arCells, function (item, index) {
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
                var cellIndex, cellcount, rowIndex, rowcount, i, sourcecol, treecol, curNode, newObj, groupbyValue, groupbyText, sortbyValue, pivotValue, pivotSortBy, resultValues, newPivotValue, rowitem, row;

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
                        this.resultCol.push(treecol);
                    }
                }

                this.alGroupByCols.sort(sortgroupbys);

                for (rowIndex = 0, rowcount = data.rows.length; rowIndex < rowcount; rowIndex += 1) {
                    row = data.rows[rowIndex];
                    curNode = this.tree;

                    for (i = 0; i < this.alGroupByCols.length; i += 1) {
                        groupbyValue = trim(row[this.alGroupByCols[i].colvalue]);
                        groupbyText = row[this.alGroupByCols[i].coltext];
                        sortbyValue = trim(row[this.alGroupByCols[i].sortbycol]);
                        newObj = curNode.uniqueGroupByValuesLookup[groupbyValue];
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
                            curNode.uniqueGroupByValuesLookup[groupbyValue] = newObj;
                            curNode.children.push(newObj);
                        }
                        curNode = newObj;
                    }

                    pivotValue = trim(row[this.pivotCol.colvalue]);
                    pivotSortBy = trim(row[this.pivotCol.sortbycol]);
                    resultValues = [];
                    for (i = 0; i < this.resultCol.length; i += 1) {
                        resultValues.push(trim(row[this.resultCol[i].colvalue]));
                    }
                    newPivotValue = { pivotValue: pivotValue, resultValues: resultValues, sortby: pivotSortBy, dataid: this.pivotCol.dataid };
                    curNode.pivotvalues.push(newPivotValue);
                    if (!this.uniquePivotValuesLookup.hasOwnProperty(pivotValue)) {
                        this.uniquePivotValues.push(newPivotValue);
                        this.uniquePivotValuesLookup[pivotValue] = null;
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
        _Adapter.Adapter = Adapter;
    })(Jquerypivot.Adapter || (Jquerypivot.Adapter = {}));
    var Adapter = Jquerypivot.Adapter;
})(Jquerypivot || (Jquerypivot = {}));
var Jquerypivot;
(function (Jquerypivot) {
    (function (Pivot) {
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
                    return n === null ? null : n.toString();
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
        Pivot.jqueryPivotOptions = jqueryPivotOptions;

        var resultCellClickedInfoPivotInfo = (function () {
            function resultCellClickedInfoPivotInfo(dataidPivot, pivotvalue, pivotsortvalue) {
                this.dataidPivot = dataidPivot;
                this.pivotvalue = pivotvalue;
                this.pivotsortvalue = pivotsortvalue;
            }
            return resultCellClickedInfoPivotInfo;
        })();
        Pivot.resultCellClickedInfoPivotInfo = resultCellClickedInfoPivotInfo;

        var resultCellClickedInfoGroupByInfo = (function () {
            function resultCellClickedInfoGroupByInfo(dataidGroup, groupbyval) {
                this.dataidGroup = dataidGroup;
                this.groupbyval = groupbyval;
            }
            return resultCellClickedInfoGroupByInfo;
        })();
        Pivot.resultCellClickedInfoGroupByInfo = resultCellClickedInfoGroupByInfo;

        var resultCellClickedInfoResultColInfo = (function () {
            function resultCellClickedInfoResultColInfo(colKeyName, colName) {
                this.colKeyName = colKeyName;
                this.colName = colName;
            }
            return resultCellClickedInfoResultColInfo;
        })();
        Pivot.resultCellClickedInfoResultColInfo = resultCellClickedInfoResultColInfo;

        var resultCellClickedInfo = (function () {
            function resultCellClickedInfo(dataidTable, pivot, groups, resultcol) {
                this.dataidTable = dataidTable;
                this.pivot = pivot;
                this.groups = groups;
                this.resultcol = resultcol;
            }
            return resultCellClickedInfo;
        })();
        Pivot.resultCellClickedInfo = resultCellClickedInfo;

        var resultCellInfo = (function () {
            function resultCellInfo(pivot, treeNode, resultcol) {
                this.pivot = pivot;
                this.treeNode = treeNode;
                this.resultcol = resultcol;
            }
            return resultCellInfo;
        })();

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
                        dataObj = new resultCellClickedInfo(adapter.dataid, new resultCellClickedInfoPivotInfo(data.pivot.dataid, data.pivot.pivotValue, data.pivot.sortby), aGroupBys, new resultCellClickedInfoResultColInfo(data.resultcol.dataid, data.resultcol.coltext));
                        _this.opts.onResultCellClicked(dataObj, el);
                    }
                };
                this.flattenFunc = function (index) {
                    return function (item) {
                        return item[index];
                    };
                };
                this.getResValues = function (treeNode, pivotValue) {
                    var i, res = [], valsToAggregate = [], pivotResultValues;

                    var parseNums = function (n) {
                        return _this.opts.parseNumFunc(n);
                    };

                    if (!treeNode.pivotResultValuesLookup.hasOwnProperty(pivotValue)) {
                        if (_this.opts.aggregatefunc) {
                            if (treeNode.pivotvalues.length > 0) {
                                pivotResultValues = Jquerypivot.Lib.map(treeNode.pivotvalues || [], function (item, index) {
                                    return item.pivotValue === pivotValue ? item.resultValues : null;
                                });

                                if (_this.opts.parseNumFunc) {
                                    for (i = 0; i < pivotResultValues.length; i += 1) {
                                        valsToAggregate.push(Jquerypivot.Lib.map(pivotResultValues[i], parseNums));
                                    }
                                } else {
                                    valsToAggregate = pivotResultValues;
                                }
                            } else if (_this.opts.bTotals) {
                                for (i = 0; i < treeNode.children.length; i += 1) {
                                    valsToAggregate.push(_this.getResValues(treeNode.children[i], pivotValue));
                                }
                            }

                            for (i = 0; i < _this.adapter.resultCol.length; i += 1) {
                                var resColVals = Jquerypivot.Lib.map(valsToAggregate, _this.flattenFunc(i));
                                res.push(_this.opts.aggregatefunc(resColVals));
                            }
                        } else {
                            res = null;
                        }
                        treeNode.pivotResultValuesLookup[pivotValue] = res;
                    }

                    return treeNode.pivotResultValuesLookup[pivotValue];
                };
                this.appendChildRows = function (treeNode, belowThisRow, adapter) {
                    var i, j, col, col1, sb, item, itemtext, resCell, spanFoldUnfold, gbCols = adapter.alGroupByCols, pivotCols = adapter.uniquePivotValues, foldunfoldclass = _this.opts.bCollapsible ? 'foldunfold' : 'nonfoldunfold', foldunfoldclassSelector = '.' + foldunfoldclass, status, valsToSumOn = [], sums, aggregateValues = function (v) {
                        return _this.opts.aggregatefunc(v);
                    }, results;

                    for (i = 0; i < treeNode.children.length; i += 1) {
                        sb = new Jquerypivot.Lib.StringBuilder();
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

                        valsToSumOn = [];
                        for (col1 = 0; col1 < pivotCols.length; col1 += 1) {
                            results = _this.getResValues(item, pivotCols[col1].pivotValue);
                            if (_this.opts.bTotals) {
                                valsToSumOn.push(results);
                            }
                            sb.clear();
                            for (j = 0; j < results.length; j += 1) {
                                sb.append('<td class="resultcell resultcell');
                                sb.append(j);
                                sb.append('" title="');
                                sb.append(_this.adapter.resultCol[j].coltext);
                                sb.append('">');
                                sb.append(_this.opts.formatFunc(results[j]));
                                sb.append('</td>');
                            }
                            resCell = $(sb.toString()).appendTo(belowThisRow);
                            for (j = 0; j < results.length; j += 1) {
                                resCell.eq(j).data('def', new resultCellInfo(pivotCols[col1], item, _this.adapter.resultCol[j]));
                            }
                        }

                        if (_this.opts.bTotals) {
                            sb.clear();

                            sums = [];
                            for (j = 0; j < _this.adapter.resultCol.length; j += 1) {
                                var resColVals = Jquerypivot.Lib.map(valsToSumOn, _this.flattenFunc(j));
                                sums.push(_this.opts.aggregatefunc(resColVals));
                            }

                            for (j = 0; j < results.length; j += 1) {
                                sb.append('<td class="total total');
                                sb.append(j);
                                sb.append('" title="');
                                sb.append(_this.adapter.resultCol[j].coltext);
                                sb.append('">');
                                sb.append(_this.opts.formatFunc(sums[j]));
                                sb.append('</td>');
                            }
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
                    var i, j, col, $pivottable, aggVals = [], sb = new Jquerypivot.Lib.StringBuilder('<table class="pivot">'), gbCols = adapter.alGroupByCols, pivotCols = adapter.uniquePivotValues, results;

                    _this.adapter = adapter;

                    sb.append('<tr class="head">');
                    for (i = 0; i < gbCols.length; i += 1) {
                        sb.append('<th class="groupby level');
                        sb.append(i);
                        sb.append('">');
                        sb.append(gbCols[i].text);
                        sb.append('</th>');
                    }

                    for (i = 0; i < pivotCols.length; i += 1) {
                        sb.append('<th class="pivotcol" colspan="');
                        sb.append(_this.adapter.resultCol.length);
                        sb.append('">');
                        sb.append(pivotCols[i].pivotValue);
                        sb.append('</th>');
                    }

                    if (_this.opts.bTotals) {
                        sb.append('<th class="total" colspan="');
                        sb.append(_this.adapter.resultCol.length);
                        sb.append('">Total</th>');
                    }
                    sb.append('</tr>');

                    if (_this.opts.bTotals) {
                        sb.append('<tr class="total">');
                        sb.append('<th class="total" colspan="');
                        sb.append(gbCols.length);
                        sb.append('">Total</th>');
                        for (col = 0; col < pivotCols.length; col += 1) {
                            results = _this.getResValues(adapter.tree, pivotCols[col].pivotValue);
                            if (_this.opts.bTotals) {
                                aggVals.push(results);
                            }
                            for (j = 0; j < _this.adapter.resultCol.length; j += 1) {
                                sb.append('<td class="coltotal total');
                                sb.append(j);
                                sb.append('" title="');
                                sb.append(_this.adapter.resultCol[j].coltext);
                                sb.append('">');
                                sb.append(_this.opts.formatFunc(results[j]));
                                sb.append('</td>');
                            }
                        }
                        for (j = 0; j < _this.adapter.resultCol.length; j += 1) {
                            var resColVals = Jquerypivot.Lib.map(aggVals, _this.flattenFunc(j));
                            sb.append('<td class="total total');
                            sb.append(j);
                            sb.append('" title="');
                            sb.append(_this.adapter.resultCol[j].coltext);
                            sb.append('">');
                            sb.append(_this.opts.formatFunc(_this.opts.aggregatefunc(resColVals)));
                            sb.append('</td>');
                        }
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
        Pivot.pivot = pivot;

        $.fn.pivot = function (options) {
            var p = new pivot(options);
            return this.each(function () {
                var item = $(this), adapter = new Jquerypivot.Adapter.Adapter(), opts = p.opts;

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
    })(Jquerypivot.Pivot || (Jquerypivot.Pivot = {}));
    var Pivot = Jquerypivot.Pivot;
})(Jquerypivot || (Jquerypivot = {}));
//# sourceMappingURL=jquery.pivot.js.map
