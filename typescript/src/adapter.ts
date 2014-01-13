///<reference path="../definitions/jquery.d.ts"/>
///<reference path="lib.ts"/>
module Jquerypivot.Adapter {
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

    export interface column{
        colvalue: string;
        coltext: string;
        header?: string;
        sortbycol: string;
        groupbyrank: number;
        pivot?: boolean;
        result?: boolean;
        dataid?: string;
        datatype?: string;
        text?: string;
        colindex?: number;
    }

    export interface jsonsource{
        dataid: string;
        columns: column[];
        rows: any[];
    }

    export interface pivotItem {
        pivotValue: any; 
        resultValues: string[]; 
        sortby: any; 
        dataid: any
    }

    export class TreeNode {
        groupbyValue: string;
        groupbyText: string;
        colindex: number;
        children: TreeNode[] = [];
        sortby: string;
        parent: TreeNode;
        dataid: string;
        collapsed: boolean;
        groupbylevel: number;
        pivotvalues: pivotItem[] = [];
        uniqueGroupByValuesLookup = {};
        pivotResultValuesLookup = {};
        visible() {
            return this.parent === undefined || (!this.parent.collapsed && (!this.parent.visible || this.parent.visible()));
        }
    }

    export class Adapter {
        dataid: string;
        alGroupByCols: column[];
        bInvSort: boolean;
        pivotCol: column;
        resultCol: column[];
        tree: TreeNode;
        uniquePivotValues: pivotItem[];
        uniquePivotValuesLookup = {};
        sortPivotColumnHeaders: boolean;
       
        constructor() {
            this.alGroupByCols = [];
            this.pivotCol = null;
            this.resultCol = [];
            this.bInvSort = false;
            this.tree = new TreeNode();
            this.uniquePivotValues = [];
            this.dataid = null;
            this.sortPivotColumnHeaders = true;
        }

        sortTree(treeNode : TreeNode) {
            var i: number,
                datatype: string;
            if (treeNode.children && treeNode.children.length > 0) {
                for (i = 0; i < treeNode.children.length; i += 1) {
                    this.sortTree(treeNode.children[i]);
                }

                datatype = this.findCell(this.alGroupByCols, treeNode.children[0].colindex).datatype;
                treeNode.children.sort(this.getcomparer(this.bInvSort)[datatype]);
            }
        }

        findCell(arCells: column[], colIndex: number) {
            return Lib.find(arCells, function (item: column, index: number) {
                return item.colindex == this;
            }, colIndex);
        }

        getcomparer(bInv: boolean) {
            function comp(f) {
                return function (rowA: TreeNode, rowB: TreeNode) {
                    var out = (f(rowA.sortby) < f(rowB.sortby)) ? -1 : (f(rowA.sortby) > f(rowB.sortby)) ? 1 : 0;
                    return bInv ? -out : out;
                }
            }

            return  { 
                'string': comp(s => { return s }), 
                'number': comp(i => { return +i }) 
            };
        }
        
        parseJSONsource(data : jsonsource) {
            var cellIndex:number, 
                cellcount:number, 
                rowIndex:number, 
                rowcount:number, 
                i:number, 
                sourcecol:column, 
                treecol: column, 
                curNode:TreeNode, 
                newObj:TreeNode, 
                groupbyValue, 
                groupbyText, 
                sortbyValue, 
                pivotValue, 
                pivotSortBy, 
                resultValues:any[], 
                newPivotValue:pivotItem,
                rowitem:any,
                row: any[];

            this.dataid = data.dataid;
            //exctract header info
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

                if (typeof(treecol.groupbyrank) === 'number' && isFinite(treecol.groupbyrank)) {
                    this.alGroupByCols.push(treecol);
                }
                else if (sourcecol.pivot) {
                    this.pivotCol = treecol;
                }
                else if (sourcecol.result) {
                    this.resultCol.push(treecol);
                }
            }

            this.alGroupByCols.sort(sortgroupbys);

            //build tree structure
            //first build children structure by populating them as associative arrays, and then make them normal arrays.
            for (rowIndex = 0, rowcount = data.rows.length; rowIndex < rowcount; rowIndex += 1) {
                row = data.rows[rowIndex];
                curNode = this.tree;
                //groupbys
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
                //pivot
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
        }

        parseFromHtmlTable(sourceTable: JQuery) {
            var cellIndex:number, 
                cellcount:number, 
                rowIndex:number, 
                rowcount:number, 
                el: JQuery, 
                eltext:string, 
                col:column, 
                cells:HTMLTableCellElement[], 
                row: {},
                data :jsonsource = { 
                    dataid: sourceTable.data('pivot-dataid'), 
                    columns: [], 
                    rows: [] 
                },
                //exctract header info
                rows = <HTMLTableRowElement[]><any> $('tbody > tr', sourceTable),
                columnNames:string[] = [];
            
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
                    pivot: <boolean> el.data('pivot-pivot'),
                    result:<boolean> el.data('pivot-result')
                };
                data.columns.push(col);
                columnNames.push(eltext);
            }

            //extract rows
            for (rowIndex = 1, rowcount = rows.length; rowIndex < rowcount; rowIndex += 1) {
                cells =  <HTMLTableCellElement[]><any>rows[rowIndex].cells;
                row = {};
                for (cellIndex = 0, cellcount = columnNames.length; cellIndex < cellcount; cellIndex += 1) {
                    eltext = cells[cellIndex].innerHTML;
                    row[columnNames[cellIndex]] = (data.columns[cellIndex].datatype === 'number') ? <any>parseFloat(eltext) : <any>eltext;
                }
                data.rows.push(row);
            }

            this.parseJSONsource(data);
        }

    }
}



