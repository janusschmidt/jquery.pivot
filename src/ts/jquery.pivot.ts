/// <reference path="definitions/jquery.d.ts"/>
/// <reference path="lib.ts"/>
/// <reference path="adapter.ts"/>

module jquerypivot { 

    $ = jQuery;

    function calcsum(values) {
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
            aggregatefunc?: Function;
            //A function to format numeric result/total cells. Ie. for non US numeric formats
            formatFunc?: (n: number) => string;
            //Can be used if parsing a html table and want a non standard method of parsing data. 
            //Ie. for non US numeric formats. 
            //Set to null if result column should be considered string data.
            parseNumFunc?: (n: string) => number;
            //Method thats called when a result cell is clicked. This can be used to call server and present details for that cell.
            //Signature = function(dataObjectWithInformationOnClikedCell, jqueryElementThatsClicked)
            onResultCellClicked?: (dataObjectWithInformationOnClikedCell: {}, jqueryElementThatsClicked?: JQuery) => any;
            //Text used if no data is available for specific groupby and pivot value.
            noGroupByText?: string;
            //Text used if source data is empty.
            noDataText?: string;
            //if false pivot columns will appear in the order they are discovered in the source.
            sortPivotColumnHeaders?: boolean;
    }

    export class jqueryPivotOptions implements IjqueryPivotOptions {constructor(
            //Must be json or a jquery element containing a table
            public source: any = null, 
            //Includes total row and column
            public bTotals = true, 
            // Set to false to expand all and remove open/close buttons
            public bCollapsible= true, 
            //defaults to numeric sum. Set to null for no totals. Set to concatenation for strings.
            public aggregatefunc: Function = calcsum, 
            //A function to format numeric result/total cells. Ie. for non US numeric formats
            public formatFunc: (n)=>string = (n) => { return n; }, 
            //Can be used if parsing a html table and want a non standard method of parsing data. 
            //Ie. for non US numeric formats. 
            //Set to null if result column should be considered string data.
            public parseNumFunc : (n:string)=>number = (n) => { return +n; },  
            //Method thats called when a result cell is clicked. This can be used to call server and present details for that cell.
            //Signature = function(dataObjectWithInformationOnClikedCell, jqueryElementThatsClicked)
            public onResultCellClicked: (dataObjectWithInformationOnClikedCell: {}, jqueryElementThatsClicked? : JQuery) => any = null,  
            //Text used if no data is available for specific groupby and pivot value.
            public noGroupByText = 'No value', 
            //Text used if source data is empty.
            public noDataText = 'No data', 
            //if false pivot columns will appear in the order they are discovered in the source.
            public sortPivotColumnHeaders = true 
            ) { }
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

    export class resultCellClickedInfo {
        constructor(
            public dataidTable: string,
            public pivot: resultCellClickedInfoPivotInfo,
            public groups: resultCellClickedInfoGroupByInfo[]) { }
    }

    class groupbynodeStatus { constructor(
        public bDatabound :boolean, 
        public treeNode: TreeNode) { }
    }

    export class pivot {
        public opts: jqueryPivotOptions;
        constructor(suppliedoptions? : IjqueryPivotOptions){ 
            this.opts = $.extend({}, $.fn.pivot.defaults, suppliedoptions);
        }

        resultCellClicked = (e:JQueryEventObject) => {
            var el = $(e.target),
                adapter = <Adapter>el.closest('table.pivot').data('jquery.pivot.adapter'),
                aGroupBys : resultCellClickedInfoGroupByInfo[] = [],
                data = el.data('def'),
                curNode = <TreeNode> data.treeNode,
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
                    new resultCellClickedInfoPivotInfo(data.pivot.dataid, data.pivot.pivotValue, data.pivot.sortby)
                    , aGroupBys);
                this.opts.onResultCellClicked(dataObj, el);
            }
        }

        getResValue = (treeNode : TreeNode, pivotValue) => {
            var i : number, res,
                aggVals = [],
                pivotCells = lib.map(treeNode.pivotvalues || [], (item : pivotItem, index:number) => {
                    return item.pivotValue === pivotValue ? item.result : null;
                });

            if (this.opts.aggregatefunc) {
                if (pivotCells.length >= 1) {
                    for (i = 0; i < pivotCells.length; i += 1) {
                        aggVals.push(this.opts.parseNumFunc ? this.opts.parseNumFunc(pivotCells[i]) : pivotCells[i]);
                    }
                } else if (this.opts.bTotals) {
                    for (i = 0; i < treeNode.children.length; i += 1) {
                        /*ignore jslint start*/
                        aggVals.push(this.getResValue(treeNode.children[i], pivotValue));
                        /*ignore jslint end*/
                    }
                }
                res = this.opts.aggregatefunc(aggVals);
            } else {
                res = null;
            }

            return res;
        }

        appendChildRows = (treeNode:TreeNode, belowThisRow:JQuery, adapter : Adapter) => {
            var i, col, col1, sb, item, itemtext, result, resCell, aggVals, spanFoldUnfold,
            gbCols = adapter.alGroupByCols,
            pivotCols = adapter.uniquePivotValues,
            foldunfoldclass = this.opts.bCollapsible ? 'foldunfold' : 'nonfoldunfold',
            foldunfoldclassSelector = '.' + foldunfoldclass,
            status : groupbynodeStatus;


            for (i = 0; i < treeNode.children.length; i += 1) {
                sb = new lib.StringBuilder();
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

                aggVals = [];
                for (col1 = 0; col1 < pivotCols.length; col1 += 1) {
                    result = this.getResValue(item, pivotCols[col1].pivotValue);
                    if (this.opts.bTotals) {
                        aggVals.push(result);
                    }
                    sb.clear();
                    sb.append('<td class="resultcell">');
                    sb.append(this.opts.formatFunc(result));
                    sb.append('</td>');
                    resCell = $(sb.toString()).appendTo(belowThisRow);
                    resCell.data('def', { pivot: pivotCols[col1], treeNode: item });
                }

                if (this.opts.bTotals) {
                    sb.clear();
                    sb.append('<td class="total">');
                    sb.append(this.opts.formatFunc(this.opts.aggregatefunc(aggVals)));
                    sb.append('</td>');
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

        makeCollapsed = (adapter : Adapter, $obj :JQuery) => {
            var i, col, result, $pivottable,
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

            for (i = 0; i < pivotCols.length; i += 1) {
                sb.append('<th class="pivotcol">');
                sb.append(pivotCols[i].pivotValue);
                sb.append('</th>');
            }

            if (this.opts.bTotals) {
                sb.append('<th class="total">Total</th>');
            }
            sb.append('</tr>');

            //make sum row
            if (this.opts.bTotals) {
                sb.append('<tr class="total">');
                sb.append('<th class="total" colspan="');
                sb.append(gbCols.length);
                sb.append('">Total</th>');
                for (col = 0; col < pivotCols.length; col += 1) {
                    result = this.getResValue(adapter.tree, pivotCols[col].pivotValue);
                    if (this.opts.bTotals) {
                        aggVals.push(result);
                    }
                    sb.append('<td>');
                    sb.append(this.opts.formatFunc(result));
                    sb.append('</td>');
                }
                sb.append('<td class="total">');
                sb.append(this.opts.formatFunc(this.opts.aggregatefunc(aggVals)));
                sb.append('</td>');
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
            var adapter = <Adapter>el.closest('table.pivot').data('jquery.pivot.adapter'),
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
                adapter = new Adapter(),
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
    pivot(jqueryPivotOptions?:jquerypivot.IjqueryPivotOptions): JQuery;
}


