/*global jQuery, JSON, $, alert, document, AdapterObject, PagerObject, FilterObject, SortObject, HideColumns */
(function ($) {
    var lib = {};
    lib.StringBuilder = function (value) { this.strings = ['']; this.append(value); };
    lib.StringBuilder.prototype.append = function (value) { if (value !== null) { this.strings.push(value); } };
    lib.StringBuilder.prototype.clear = function () { this.strings.length = 1; };
    lib.StringBuilder.prototype.toString = function () { return this.strings.join(''); };
    //Returns a new array with elements where a call to fun(item, index, extra) returns non null
    lib.map = function (array, fun, extra) {
        var i, len, res = [], item;
        if (array) {
            for (i = 0, len = array.length; i < len; i += 1) {
                if (array.hasOwnProperty(i)) {
                    item = fun(array[i], i, extra);
                    if (item) {
                        res.push(item);
                    }
                }
            }
        }
        return res;
    };
    //Returns the found element or null
    lib.find = function (ar, fun, extra) {
        ar = lib.map(ar, fun, extra);
        return ar.length > 0 ? ar[0] : null;
    };
    //returns true if in at least one row of an array returns true when passed as argument to the given function.
    lib.exists = function (ar, fun, extra) {
        var i, len, item;
        if (ar) {
            for (i = 0, len = ar.length; i < len; i += 1) {
                if (ar.hasOwnProperty(i)) {
                    item = fun(ar[i], i, extra);
                    if (item) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

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
                var el = $(this),
                adapter = el.closest('table.pivot').data('jquery.pivot.adapter'),
                aGroupBys = [],
                data = el.data('def'),
                curNode = data.treeNode,
                dataObj;

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
            var i, i1, res,
                aggVals = [],
                pivotCells = $.map(treeNode.pivotvalues || [], function (item, index) {
                    return item.pivotValue === pivotValue ? item.result : null;
                });

            if (opts.aggregatefunc) {
                if (pivotCells.length >= 1) {
                    for (i = 0; i < pivotCells.length; i += 1) {
                        aggVals.push(opts.parseNumFunc ? opts.parseNumFunc(pivotCells[i]) : pivotCells[i]);
                    }
                } else if (opts.bTotals) {
                    for (i1 = 0; i1 < treeNode.children.length; i1 += 1) {
                        /*ignore jslint start*/
                        aggVals.push(getResValue(treeNode.children[i1], pivotValue));
                        /*ignore jslint end*/
                    }
                }
                res = opts.aggregatefunc(aggVals);
            } else {
                res = null;
            }

            return res;
        }

        function appendChildRows(treeNode, belowThisRow, adapter) {
            var i, col, col1, sb, item, itemtext, result, resCell, aggVals, spanFoldUnfold,
            gbCols = adapter.alGroupByCols,
            pivotCols = adapter.uniquePivotValues,
            foldunfoldclass = opts.bCollapsible ? 'foldunfold' : 'nonfoldunfold',
            foldunfoldclassSelector = '.' + foldunfoldclass;


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
                        }
                        else {
                            sb.append(itemtext);
                        }
                    }
                    else {
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
            var i, i1, col, result, $pivottable,
                aggVals = [],
                sb = new lib.StringBuilder('<table class="pivot">'),
                gbCols = adapter.alGroupByCols,
                pivotCols = adapter.uniquePivotValues;

            //headerrow
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

            //make sum row
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

            //top level rows
            $obj.html('');
            $pivottable = $(sb.toString()).appendTo($obj);
            $pivottable.data('jquery.pivot.adapter', adapter);
            appendChildRows(adapter.tree, $('tr:first', $pivottable), adapter);
        }

        function foldunfoldElem(el) {
            var adapter = el.closest('table.pivot').data('jquery.pivot.adapter'),
                status = el.data('status'),
                parentRow = el.closest('tr'),
                visible = false,
                row, rowstatus, thisrowstatus;

            status.treeNode.collapsed = !status.treeNode.collapsed;

            if (status.treeNode.collapsed) {
                el.addClass('collapsed');
            }
            else {
                el.removeClass('collapsed');
            }

            if (!status.bDatabound) {
                appendChildRows(status.treeNode, parentRow, adapter);
                status.bDatabound = true;
            }
            else {
                row = parentRow;
                rowstatus = status;
                while ((row = row.next()).length > 0) {
                    thisrowstatus = row.find('.foldunfold').data('status');

                    // break if row is total row or belongs to other grouping
                    if ((thisrowstatus && thisrowstatus.treeNode.groupbylevel <= status.treeNode.groupbylevel) || row.is('.total')) {
                        break;
                    }

                    if (thisrowstatus) {
                        rowstatus = thisrowstatus;
                        visible = rowstatus.treeNode.visible();
                    }
                    else {
                        //Lowest level of groupbys which doesn't have status. Look at parent collapsed instead.
                        visible = rowstatus.treeNode.visible() && !rowstatus.treeNode.collapsed;
                    }

                    row.toggle(visible);
                }
            }
        }

        function foldunfold(eventSource) {
            foldunfoldElem($(this));
        }

        return this.each(function () {
            var $obj = $(this),
                adapter = new AdapterObject(opts.sortPivotColumnHeaders);

            adapter.sortPivotColumnHeaders = opts.sortPivotColumnHeaders;
            $obj.html('');
            if ((typeof opts.source === 'object' && opts.source.jquery) || opts.source.columns) {
                if (opts.source.jquery) {
                    if (opts.source.find('tr').length > 0) {
                        adapter.parseFromXhtmlTable(opts.source);
                    }
                }
                else {
                    adapter.parseJSONsource(opts.source);
                }

                //clean up previous event handlers
                $obj.find('.pivot .foldunfold').die('click');
                $obj.find('.resultcell').die('click');

                //set up eventhandlers
                $obj.find('.pivot .foldunfold').live('click', foldunfold);
                if (opts.onResultCellClicked) {
                    $obj.find('.resultcell').live('click', resultCellClicked);
                }

                makeCollapsed(adapter, $obj);
            }

            if ($obj.html() === '') {
                $obj.html('<h1>' + opts.noDataText + '</h1>');
            }
        });
    };

    $.fn.pivot.defaults = {
        source: null, //Must be json or a jquery element containing a table
        bTotals: true, //Includes total row and column
        bCollapsible: true, // Set to false to expand all and remove open/close buttons
        aggregatefunc: calcsum, //defaults to numeric sum. Set to null for no totals. Set to concatenation for strings.
        formatFunc: function (n) { return n; }, //A function to format numeric result/total cells. Ie. for non US numeric formats
        parseNumFunc: function (n) { return +n; },  //Can be used if parsing a html table and want a non standard method of parsing data. 
                                                    //Ie. for non US numeric formats. 
                                                    //Set to null if result column should be considered string data.
        onResultCellClicked: null,  //Method thats called when a result cell is clicked. This can be used to call server and present details for that cell.
                                    //Signature = function(dataObjectWithInformationOnClikedCell, jqueryElementThatsClicked)
        noGroupByText: 'No value', //Text used if no data is available for specific groupby and pivot value.
        noDataText: 'No data', //Text used if source data is empty.
        sortPivotColumnHeaders: true //if false pivot columns will appear in the order they are discovered in the source.
    };

    $.fn.pivot.formatDK = function (num, decimals) { return this.formatLocale(num, decimals, '.', ','); };
    $.fn.pivot.formatUK = function (num, decimals) { return this.formatLocale(num, decimals, ',', '.'); };
    $.fn.pivot.formatLocale = function (num, decimals, kilosep, decimalsep) {
        var i,
            bNeg = num < 0,
            x = Math.round(num * Math.pow(10, decimals)),
            y = Math.abs(x).toString().split(''),
            z = y.length - decimals;

        if (z <= 0) {
            for (i = 0; i <= -z; i += 1) {
                y.unshift('0');
            }
            z = 1;
        }
        if (decimals > 0) {
            y.splice(z, 0, decimalsep);
        }
        while (z > 3) { z -= 3; y.splice(z, 0, kilosep); }
        if (bNeg) {
            y.splice(0, 0, '-');
        }
        return y.join('');
    };


    //    getDetails = function(sUrl, data, onsucces) {
    //        $.ajax({
    //            type: 'POST',
    //            url: sUrl,
    //            data: opts.detailsWebServiceIsActionMethod ? { 'jsondata': JSON.stringify(data)} : JSON.stringify({ 'jsondata': data }),
    //            contentType: opts.detailsWebServiceIsActionMethod ? 'application/x-www-form-urlencoded' : 'application/json; charset=utf-8',
    //            dataType: opts.detailsdatatype,
    //            success: onsucces,
    //            error: function(XMLHttpRequest, textStatus, errorThrown) {
    //                $('#div_debug').append(textStatus + errorThrown);
    //            }
    //        });
    //    }

    //***********************************************************
    function AdapterObject() {
        this.alGroupByCols = [];
        this.pivotCol = null;
        this.resultCol = null;
        this.bInvSort = false;
        this.tree = { children: [] };
        this.uniquePivotValues = [];
        this.dataid = null;
        this.sortPivotColumnHeaders = true;
    }

    function sortgroupbys(rowA, rowB) {
        var a = +rowA.groupbyrank,
            b = +rowB.groupbyrank;

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

    function trim(oIn) {
        if (typeof oIn === 'string' || oIn === null) {
            return jQuery.trim(oIn);
        }
        else {
            return oIn;
        }
    }

    AdapterObject.prototype.parseJSONsource = function (data) {
        var cellIndex, cellcount, rowIndex, rowcount, col, cell, cells, curNode, i, groupbyValue, groupbyText, sortbyValue, newObj, pivotValue, pivotSortBy, result, newPivotValue;
        this.dataid = data.dataid;
        //exctract header info
        for (cellIndex = 0, cellcount = data.columns.length; cellIndex < cellcount; cellIndex += 1) {
            col = data.columns[cellIndex];
            cell = {
                colvalue: col.colvalue,
                coltext: col.coltext,
                text: col.header || col.coltext || col.colvalue,
                colindex: cellIndex,
                datatype: col.datatype || 'string',
                sortbycol: col.sortbycol || col.coltext || col.colvalue,
                dataid: col.dataid || col.colvalue,
                groupbyrank: col.groupbyrank
            };

            if (typeof cell.groupbyrank === 'number' && isFinite(cell.groupbyrank)) {
                this.alGroupByCols.push(cell);
            }
            else if (col.pivot) {
                this.pivotCol = cell;
            }
            else if (col.result) {
                this.resultCol = cell;
            }
        }

        this.alGroupByCols.sort(sortgroupbys);

        this.TreeNode = function () { };
        this.TreeNode.prototype.visible = function () { return !this.parent.collapsed && (!this.parent.visible || this.parent.visible()); };

        function findGroupByFunc(item, index, value) { return item.groupbyValue === value ? item : null; }
        function findPivotFunc(item, index, value) { return item.pivotValue === value ? item : null; }
        //build tree structure
        for (rowIndex = 0, rowcount = data.rows.length; rowIndex < rowcount; rowIndex += 1) {
            cells = data.rows[rowIndex];
            curNode = this.tree;
            //groupbys
            for (i = 0; i < this.alGroupByCols.length; i += 1) {
                groupbyValue = trim(cells[this.alGroupByCols[i].colvalue]);
                groupbyText = cells[this.alGroupByCols[i].coltext];
                sortbyValue = trim(cells[this.alGroupByCols[i].sortbycol]);
                newObj = lib.find(curNode.children, findGroupByFunc, groupbyValue);
                if (!newObj) {
                    newObj = new this.TreeNode();
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
            //pivot
            pivotValue = trim(cells[this.pivotCol.colvalue]);
            pivotSortBy = trim(cells[this.pivotCol.sortbycol]);
            result = trim(cells[this.resultCol.colvalue]);
            if (!curNode.pivotvalues) {
                curNode.pivotvalues = [];
            }
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

    AdapterObject.prototype.parseFromXhtmlTable = function (sourceTable) {
        var cellIndex, cellcount, rowIndex, rowcount, cellIndex1, cellcount1, el, eltext, col, cells, row,
            data = { dataid: sourceTable.attr('dataid'), columns: [], rows: [] },
        //exctract header info
            rows = $('tbody > tr', sourceTable),
            columnNames = [];

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

        //extract rows
        for (rowIndex = 1, rowcount = rows.length; rowIndex < rowcount; rowIndex += 1) {
            cells = rows[rowIndex].cells;
            row = {};
            for (cellIndex1 = 0, cellcount1 = columnNames.length; cellIndex1 < cellcount1; cellIndex1 += 1) {
                if (data.columns[cellIndex1].datatype === 'number') {
                    row[columnNames[cellIndex1]] = parseFloat(cells[cellIndex1].innerHTML);
                }
                else {
                    row[columnNames[cellIndex1]] = cells[cellIndex1].innerHTML;
                }
            }
            data.rows.push(row);
        }

        this.parseJSONsource(data);
    };

    AdapterObject.prototype.sortTree = function (treeNode) {
        var i, datatype;
        if (treeNode.children && treeNode.children.length > 0) {
            for (i = 0; i < treeNode.children.length; i += 1) {
                this.sortTree(treeNode.children[i]);
            }

            datatype = this.findCell(this.alGroupByCols, treeNode.children[0].colindex).datatype;
            treeNode.children.sort(this.getcomparer(this.bInvSort)[datatype]);
        }
    };

    AdapterObject.prototype.findCell = function (arCells, colIndex) {
        return lib.find(arCells, function (item, index, value) { return item.colindex === value ? item : null; }, colIndex);
    };

    AdapterObject.prototype.getcomparer = function (bInv) {
        return {
            string:
            function (rowA, rowB) {
                var out = (rowA.sortby < rowB.sortby) ? -1 : (rowA.sortby > rowB.sortby) ? 1 : 0;
                return bInv ? -out : out;
            },
            number:
            function (rowA, rowB) {
                var out = (+rowA.sortby < +rowB.sortby) ? -1 : (+rowA.sortby > +rowB.sortby) ? 1 : 0;
                return bInv ? -out : out;
            }
        };
    };
} (jQuery));
