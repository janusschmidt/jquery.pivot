/// <reference path="definitions/jquery.d.ts"/>
///<reference path="lib.ts"/>
module data {
    function sortgroupbys(rowA, rowB) {
        var a = +rowA.groupbyrank,
            b = +rowB.groupbyrank;

        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

    function trim(oIn) {
        if (typeof oIn === 'string' || oIn === null) {
            return $.trim(oIn);
        }
        else {
            return oIn;
        }
    }

    class TreeNode {
        groupbyValue: string;
        groupbyText: string;
        colindex: number;
        children: TreeNode[];
        sortby: string;
        parent: TreeNode;
        dataid: string;
        collapsed: boolean;
        groupbylevel: number;
        visible() {
            return !this.parent.collapsed && (!this.parent.visible || this.parent.visible());
        }

    }

    export interface Cell {
        colvalue: string;
        coltext: string;
        text: string;
        colindex: number;
        datatype: string;
        sortbycol: string;
        dataid: string;
        groupbyrank: number;
    };

    export class adapter {

        dataid: string;
        alGroupByCols: Cell[];
        bInvSort: boolean;
        pivotCol: Cell;
        resultCol: Cell;
        tree: { children: any[] };
        uniquePivotValues: string[];
        sortPivotColumnHeaders: bool;

        constructor() {
            this.alGroupByCols = [];
            this.pivotCol = null;
            this.resultCol = null;
            this.bInvSort = false;
            this.tree = { children: [] };
            this.uniquePivotValues = [];
            this.dataid = null;
            this.sortPivotColumnHeaders = true;
        }

        sortTree(treeNode) {
            var i, datatype;
            if (treeNode.children && treeNode.children.length > 0) {
                for (i = 0; i < treeNode.children.length; i += 1) {
                    this.sortTree(treeNode.children[i]);
                }

                datatype = this.findCell(this.alGroupByCols, treeNode.children[0].colindex).datatype;
                treeNode.children.sort(this.getcomparer(this.bInvSort)[datatype]);
            }
        }

        findCell(arCells, colIndex) {
            return lib.find(arCells, function (item, index) {
                return (item.colindex == (+this)) ? item : null;
            }, colIndex);
        }

        getcomparer(bInv) {
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
            }
        }

        
        parseJSONsource(data) {
            var cellIndex, cellcount, rowIndex, rowcount, col, cell: Cell, cells, curNode, i, groupbyValue, groupbyText, sortbyValue, newObj, pivotValue, pivotSortBy, result, newPivotValue;
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

            function findGroupByFunc(item, index) { return item.groupbyValue == this ? item : null; }
            function findPivotFunc(item, index) { return item.pivotValue == this ? item : null; }
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
        }

        parseFromXhtmlTable(sourceTable) {
            var cellIndex, cellcount, rowIndex, rowcount, cellIndex1, cellcount1, el, eltext, col, cells, row,
                data = { dataid: sourceTable.attr('dataid'), columns: [], rows: [] },
                //exctract header info
                rows = <HTMLTableRowElement[]><any> $('tbody > tr', sourceTable),
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
        }

    }
}



