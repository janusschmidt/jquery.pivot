///<reference path="../definitions/jquery.d.ts"/>
/// <reference path="lib.ts"/>
/// <reference path="adapter.ts"/>

module Jquerypivot.Pivot { 

    $ = jQuery;

    function calcsum(values: number[]) {
        var i, length;
        var total = 0.0;
        for (i = 0, length = values.length; i < length; i += 1) {
            total += values[i];
        }
        return total;
    }

    function formatDK(num, decimals) { return this.formatLocale(num, decimals, '.', ','); }
    function formatUK(num, decimals) { return this.formatLocale(num, decimals, ',', '.'); }
    function formatLocale(num, decimals, kilosep, decimalsep) {
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
    }

    export interface IjqueryPivotOptions {
            //Must be json or a jquery element containing a table
            source: any;
            //Includes total row and column
            bTotals?: boolean;
            // Set to false to expand all and remove open/close buttons
            bCollapsible?: boolean;
            //defaults to numeric sum. Set to null for no totals. Set to concatenation for strings.
            aggregatefunc?: (arr:any[]) => any;
            //A function to format numeric result/total cells. Ie. for non US numeric formats
            formatFunc?: (n: number) => string;
            //Can be used if parsing a html table and want a non standard method of parsing data. 
            //Ie. for non US numeric formats. 
            //Set to null if result column should be considered string data.
            parseNumFunc?: (s: string) => number;
            //Method thats called when a result cell is clicked. This can be used to call server and present details for that cell.
            //Signature = function(dataObjectWithInformationOnClikedCell, jqueryElementThatsClicked)
            onResultCellClicked?: (dataObjectWithInformationOnClikedCell: Pivot.resultCellClickedInfo, jqueryElementThatsClicked?: JQuery) => any;
            //Text used if no data is available for specific groupby and pivot value.
            noGroupByText?: string;
            //Text used if source data is empty.
            noDataText?: string;
            //if false pivot columns will appear in the order they are discovered in the source.
            sortPivotColumnHeaders?: boolean;
    }

    export class jqueryPivotOptions implements IjqueryPivotOptions {
        constructor(
            //Must be json or a jquery element containing a table
            public source: any = null,
            //Includes total row and column
            public bTotals = true,
            // Set to false to expand all and remove open/close buttons
            public bCollapsible= true,
            //defaults to numeric sum. Set to null for no totals. Set to concatenation for strings.
            public aggregatefunc: (arr:any[])=> any = calcsum,
            //A function to format numeric result/total cells. Ie. for non US numeric formats
            public formatFunc: (n:number) => string = (n) => { return n === null ? null : n.toString(); },
            //Can be used if parsing a html table and want a non standard method of parsing data. 
            //Ie. for non US numeric formats. 
            //Set to null if result column should be considered string data.
            public parseNumFunc: (n: string) => number = (n) => { return +n; },
            //Method thats called when a result cell is clicked. This can be used to call server and present details for that cell.
            //Signature = function(dataObjectWithInformationOnClikedCell, jqueryElementThatsClicked)
            public onResultCellClicked: (dataObjectWithInformationOnClikedCell: Pivot.resultCellClickedInfo, jqueryElementThatsClicked?: JQuery) => any = null,
            //Text used if no data is available for specific groupby and pivot value.
            public noGroupByText = 'No value',
            //Text used if source data is empty.
            public noDataText = 'No data',
            //if false pivot columns will appear in the order they are discovered in the source.
            public sortPivotColumnHeaders = true
            ) {}
    }

    export class resultCellClickedInfoPivotInfo {
        constructor(
            public dataidPivot: string,
            public pivotvalue: string,
            public pivotsortvalue: string) { }
    }

    export class resultCellClickedInfoGroupByInfo {
        constructor(
            public dataidGroup: string,
            public groupbyval: string) { }
    }

    export class resultCellClickedInfoResultColInfo {
        constructor(
            public colKeyName: string,
            public colName: string) { }
    }

    export class resultCellClickedInfo {
        constructor(
            public dataidTable: string,
            public pivot: resultCellClickedInfoPivotInfo,
            public groups: resultCellClickedInfoGroupByInfo[],
            //Added in case of multiple result columns
            public resultcol: resultCellClickedInfoResultColInfo) { }
    }

    class resultCellInfo {
        constructor(
            public pivot: Adapter.pivotItem,
            public treeNode: Adapter.TreeNode,
            public resultcol: Adapter.column) { }
    }

    class groupbynodeStatus { constructor(
        public bDatabound :boolean, 
        public treeNode: Adapter.TreeNode) { }
    }

    export class pivot {
        private adapter: Adapter.Adapter;
        public opts: jqueryPivotOptions;
        constructor(suppliedoptions? : IjqueryPivotOptions){ 
            this.opts = $.extend({}, $.fn.pivot.defaults, suppliedoptions);
        }

        resultCellClicked = (e:JQueryEventObject) => {
            var el = $(e.target),
                adapter = <Adapter.Adapter>el.closest('table.pivot').data('jquery.pivot.adapter'),
                aGroupBys : resultCellClickedInfoGroupByInfo[] = [],
                data = <resultCellInfo> el.data('def'),
                curNode = <Adapter.TreeNode> data.treeNode,
                dataObj : resultCellClickedInfo;

            if (this.opts.onResultCellClicked) {
                el.closest('table.pivot').find('.resultcell').removeClass('clickedResultCell');
                el.addClass('clickedResultCell');

                while (curNode.parent) {
                    aGroupBys.unshift(new resultCellClickedInfoGroupByInfo(curNode.dataid, curNode.groupbyValue));
                    curNode = curNode.parent;
                }
                dataObj = new resultCellClickedInfo(
                    adapter.dataid,
                    new resultCellClickedInfoPivotInfo(data.pivot.dataid, data.pivot.pivotValue, data.pivot.sortby),
                    aGroupBys,
                    new resultCellClickedInfoResultColInfo(data.resultcol.dataid, data.resultcol.coltext));
                this.opts.onResultCellClicked(dataObj, el);
            }
        }

        flattenFunc = (index) => { return (item) => { return item[index]; } };

        getResValues = (treeNode : Adapter.TreeNode, pivotValue) :any[] => {
            var i: number,
                res = [],
                valsToAggregate: any[][] = [],
                pivotResultValues: string[][];

            var parseNums = (n) => { return this.opts.parseNumFunc(n); };

            if (!treeNode.pivotResultValuesLookup.hasOwnProperty(pivotValue)) {
                if (this.opts.aggregatefunc) {
                    if (treeNode.pivotvalues.length > 0) {
                        pivotResultValues = <string[][]> Lib.map(treeNode.pivotvalues || [], (item: Adapter.pivotItem, index: number) => {
                            return item.pivotValue === pivotValue ? item.resultValues : null;
                        });

                        if (this.opts.parseNumFunc) {
                            for (i = 0; i < pivotResultValues.length; i += 1) {
                                valsToAggregate.push(Lib.map(pivotResultValues[i], parseNums));
                            }
                        }
                        else {
                            valsToAggregate = pivotResultValues;
                        }
                    } else if (this.opts.bTotals) {
                        for (i = 0; i < treeNode.children.length; i += 1) {
                            /*ignore jslint start*/
                            valsToAggregate.push(this.getResValues(treeNode.children[i], pivotValue));
                            /*ignore jslint end*/
                        }
                    }

                    for (i = 0; i < this.adapter.resultCol.length; i += 1) {
                        var resColVals = Lib.map(valsToAggregate, this.flattenFunc(i));
                        res.push(this.opts.aggregatefunc(resColVals));
                    }
                } else {
                    res = null;
                }
                treeNode.pivotResultValuesLookup[pivotValue] = res;
            }

            return treeNode.pivotResultValuesLookup[pivotValue];
        }
       
        appendChildRows = (treeNode: Adapter.TreeNode, belowThisRow: JQuery, adapter: Adapter.Adapter) => {
            var i, j, col, col1, sb, item: Adapter.TreeNode, itemtext, resCell: JQuery, spanFoldUnfold,
                gbCols = adapter.alGroupByCols,
                pivotCols = adapter.uniquePivotValues,
                foldunfoldclass = this.opts.bCollapsible ? 'foldunfold' : 'nonfoldunfold',
                foldunfoldclassSelector = '.' + foldunfoldclass,
                status: groupbynodeStatus,
                valsToSumOn = [],
                sums:any[],
                aggregateValues = (v) => { return this.opts.aggregatefunc(v); },
                results: any[];

            for (i = 0; i < treeNode.children.length; i += 1) {
                sb = new Lib.StringBuilder();
                item = treeNode.children[i];
                itemtext = (item.groupbyText === undefined || item.groupbyText === null || item.groupbyText === '&nbsp;' || item.groupbyText === '') ? this.opts.noGroupByText : item.groupbyText;
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
                belowThisRow.find(foldunfoldclassSelector).data('status', new groupbynodeStatus(false, item));

                valsToSumOn = [];
                for (col1 = 0; col1 < pivotCols.length; col1 += 1) {
                    results = this.getResValues(item, pivotCols[col1].pivotValue);
                    if (this.opts.bTotals) {
                        valsToSumOn.push(results);
                    }
                    sb.clear();
                    for (j = 0; j < results.length; j += 1) {
                        sb.append('<td class="resultcell resultcell');
                        sb.append(j);
                        sb.append('" title="');
                        sb.append(this.adapter.resultCol[j].coltext);
                        sb.append('">');
                        sb.append(this.opts.formatFunc(results[j]));
                        sb.append('</td>');
                    }
                    resCell = $(sb.toString()).appendTo(belowThisRow);
                    for (j = 0; j < results.length; j += 1) {
                        resCell.eq(j).data('def', new resultCellInfo(pivotCols[col1], item, this.adapter.resultCol[j]));
                    }
                }

                if (this.opts.bTotals) {
                    sb.clear();

                    sums = [];
                    for (j = 0; j < this.adapter.resultCol.length; j += 1) {
                        var resColVals = Lib.map(valsToSumOn, this.flattenFunc(j));
                        sums.push(this.opts.aggregatefunc(resColVals));
                    }

                    for (j = 0; j < results.length; j += 1) {
                        sb.append('<td class="total total');
                        sb.append(j);
                        sb.append('" title="');
                        sb.append(this.adapter.resultCol[j].coltext);
                        sb.append('">');
                        sb.append(this.opts.formatFunc(sums[j]));
                        sb.append('</td>');
                    }
                    $(sb.toString()).appendTo(belowThisRow);
                }

                if (!this.opts.bCollapsible) {
                    spanFoldUnfold = belowThisRow.find(foldunfoldclassSelector);
                    if (spanFoldUnfold.length > 0) {
                        status = spanFoldUnfold.removeClass('collapsed').data('status');
                        status.treeNode.collapsed = false;
                        status.bDatabound = true;
                        this.appendChildRows(status.treeNode, belowThisRow, adapter);
                        belowThisRow = belowThisRow.nextUntil('.total').last();
                    }
                }
            }
        }

        makeCollapsed = (adapter: Adapter.Adapter, $obj :JQuery) => {
            var i, j, col, $pivottable,
                aggVals = [],
                sb = new Lib.StringBuilder('<table class="pivot">'),
                gbCols = adapter.alGroupByCols,
                pivotCols = adapter.uniquePivotValues,
                results: any[];

            this.adapter = adapter;
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
                sb.append('<th class="pivotcol" colspan="');
                sb.append(this.adapter.resultCol.length);
                sb.append('">');
                sb.append(pivotCols[i].pivotValue);
                sb.append('</th>');
            }

            if (this.opts.bTotals) {
                sb.append('<th class="total" colspan="');
                sb.append(this.adapter.resultCol.length);
                sb.append('">Total</th>');
            }
            sb.append('</tr>');

            //make sum row
            if (this.opts.bTotals) {
                sb.append('<tr class="total">');
                sb.append('<th class="total" colspan="');
                sb.append(gbCols.length);
                sb.append('">Total</th>');
                for (col = 0; col < pivotCols.length; col += 1) {
                    results = this.getResValues(adapter.tree, pivotCols[col].pivotValue);
                    if (this.opts.bTotals) {
                        aggVals.push(results);
                    }
                    for (j = 0; j < this.adapter.resultCol.length; j += 1) {
                        sb.append('<td class="coltotal total');
                        sb.append(j);
                        sb.append('" title="');
                        sb.append(this.adapter.resultCol[j].coltext);
                        sb.append('">');
                        sb.append(this.opts.formatFunc(results[j]));
                        sb.append('</td>');
                    }
                }
                for (j = 0; j < this.adapter.resultCol.length; j += 1) {
                    var resColVals = Lib.map(aggVals, this.flattenFunc(j));
                    sb.append('<td class="total total');
                    sb.append(j);
                    sb.append('" title="');
                    sb.append(this.adapter.resultCol[j].coltext);
                    sb.append('">');
                    sb.append(this.opts.formatFunc(this.opts.aggregatefunc(resColVals)));
                    sb.append('</td>');
                }
                sb.append('</tr>');
            }
            sb.append('</table>');

            //top level rows
            $obj.html('');
            $pivottable = $(sb.toString()).appendTo($obj);
            $pivottable.data('jquery.pivot.adapter', adapter);
            this.appendChildRows(adapter.tree, $('tr:first', $pivottable), adapter);
        }

        foldunfoldElem = (el:JQuery) => {
            var adapter = <Adapter.Adapter>el.closest('table.pivot').data('jquery.pivot.adapter'),
                status = <groupbynodeStatus> el.data('status'),
                parentRow = el.closest('tr'),
                visible = false,
                row:JQuery, 
                rowstatus : groupbynodeStatus, 
                thisrowstatus : groupbynodeStatus;

            status.treeNode.collapsed = !status.treeNode.collapsed;

            if (status.treeNode.collapsed) {
                el.addClass('collapsed');
            }
            else {
                el.removeClass('collapsed');
            }

            if (!status.bDatabound) {
                this.appendChildRows(status.treeNode, parentRow, adapter);
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

        foldunfold = (e:JQueryEventObject) => {this.foldunfoldElem($(e.target));}
    }

    $.fn.pivot = function (options? : jqueryPivotOptions) {
        var p = new pivot(options);
        return this.each(function () {
            var item = $(this),
                adapter = new Adapter.Adapter(),
                opts = p.opts;

            adapter.sortPivotColumnHeaders = opts.sortPivotColumnHeaders;
            item.empty();
            if ((typeof opts.source === 'object' && opts.source.jquery) || opts.source.columns) {
                if (opts.source.jquery) {
                    if (opts.source.find('tr').length > 0) {
                        adapter.parseFromHtmlTable(opts.source);
                    }
                }
                else {
                    adapter.parseJSONsource(opts.source);
                }

                //remove previous eventhandlers on item.
                item.off('click.jquery.pivot');

                //set up eventhandlers
                item.on('click.jquery.pivot','.pivot .foldunfold', p.foldunfold);
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
}

interface JQuery {
    pivot(jqueryPivotOptions?:Jquerypivot.Pivot.IjqueryPivotOptions): JQuery;
}


