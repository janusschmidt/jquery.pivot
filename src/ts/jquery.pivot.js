/// <reference path="definitions/jquery.d.ts"/>
/// <reference path="lib.ts"/>
/// <reference path="adapter.ts"/>
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
        function jqueryPivotOptions(//Must be json or a jquery element containing a table
        source, //Includes total row and column
        bTotals, // Set to false to expand all and remove open/close buttons
        bCollapsible, //defaults to numeric sum. Set to null for no totals. Set to concatenation for strings.
        aggregatefunc, //A function to format numeric result/total cells. Ie. for non US numeric formats
        formatFunc, //Can be used if parsing a html table and want a non standard method of parsing data.
        //Ie. for non US numeric formats.
        //Set to null if result column should be considered string data.
        parseNumFunc, //Method thats called when a result cell is clicked. This can be used to call server and present details for that cell.
        //Signature = function(dataObjectWithInformationOnClikedCell, jqueryElementThatsClicked)
        onResultCellClicked, //Text used if no data is available for specific groupby and pivot value.
        noGroupByText, //Text used if source data is empty.
        noDataText, //if false pivot columns will appear in the order they are discovered in the source.
        sortPivotColumnHeaders) {
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
                            /*ignore jslint start*/
                            aggVals.push(_this.getResValue(treeNode.children[i], pivotValue));
                            /*ignore jslint end*/
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

                //headerrow
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

                //top level rows
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
                            //Lowest level of groupbys which doesn't have status. Look at parent collapsed instead.
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
                        adapter.parseFromXhtmlTable(opts.source);
                    }
                } else {
                    adapter.parseJSONsource(opts.source);
                }

                //remove previous eventhandlers on item.
                item.off('click.jquery.pivot');

                //set up eventhandlers
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
