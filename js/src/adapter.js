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
//# sourceMappingURL=adapter.js.map
