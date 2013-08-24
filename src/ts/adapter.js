///<reference path="definitions/jquery.d.ts"/>
///<reference path="lib.ts"/>
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

    //export interface Cell {
    //    colvalue: string;
    //    coltext: string;
    //    text: string;
    //    colindex: number;
    //    datatype: string;
    //    sortbycol: string;
    //    dataid: string;
    //    groupbyrank: number;
    //}
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

                //pivot
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

        Adapter.prototype.parseFromXhtmlTable = function (sourceTable) {
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
        return Adapter;
    })();
    jquerypivot.Adapter = Adapter;
})(jquerypivot || (jquerypivot = {}));
