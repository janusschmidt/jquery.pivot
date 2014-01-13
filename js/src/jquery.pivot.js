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
