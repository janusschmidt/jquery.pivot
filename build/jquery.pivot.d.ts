/// <reference path="../typescript/definitions/jquery.d.ts" />
declare module Jquerypivot.Lib {
    class StringBuilder {
        public strings: string[];
        constructor(value?: string);
        public append(value: any): void;
        public clear(): void;
        public toString(): string;
    }
    function map<T>(ar: T[], fun: (value: T, index: number, array?: T[]) => any, extra?: any): any[];
    function find<T>(ar: T[], fun: (value: T, index: number, array?: T[]) => boolean, extra?: any): T;
    function exists<T>(ar: T[], fun: (value: T, index: number, array?: T[]) => boolean, extra?: any): boolean;
}
declare module Jquerypivot.Adapter {
    interface column {
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
    interface jsonsource {
        dataid: string;
        columns: column[];
        rows: any[];
    }
    interface pivotItem {
        pivotValue: any;
        resultValues: string[];
        sortby: any;
        dataid: any;
    }
    class TreeNode {
        public groupbyValue: string;
        public groupbyText: string;
        public colindex: number;
        public children: TreeNode[];
        public sortby: string;
        public parent: TreeNode;
        public dataid: string;
        public collapsed: boolean;
        public groupbylevel: number;
        public pivotvalues: pivotItem[];
        public uniqueGroupByValuesLookup: {};
        public pivotResultValuesLookup: {};
        public visible(): any;
    }
    class Adapter {
        public dataid: string;
        public alGroupByCols: column[];
        public bInvSort: boolean;
        public pivotCol: column;
        public resultCol: column[];
        public tree: TreeNode;
        public uniquePivotValues: pivotItem[];
        public uniquePivotValuesLookup: {};
        public sortPivotColumnHeaders: boolean;
        constructor();
        public sortTree(treeNode: TreeNode): void;
        public findCell(arCells: column[], colIndex: number): column;
        public getcomparer(bInv: boolean): {
            'string': (rowA: TreeNode, rowB: TreeNode) => number;
            'number': (rowA: TreeNode, rowB: TreeNode) => number;
        };
        public parseJSONsource(data: jsonsource): void;
        public parseFromHtmlTable(sourceTable: JQuery): void;
    }
}
declare module Jquerypivot.Pivot {
    interface IjqueryPivotOptions {
        source: any;
        bTotals?: boolean;
        bCollapsible?: boolean;
        aggregatefunc?: (arr: any[]) => any;
        formatFunc?: (n: number) => string;
        parseNumFunc?: (s: string) => number;
        onResultCellClicked?: (dataObjectWithInformationOnClikedCell: resultCellClickedInfo, jqueryElementThatsClicked?: JQuery) => any;
        noGroupByText?: string;
        noDataText?: string;
        sortPivotColumnHeaders?: boolean;
    }
    class jqueryPivotOptions implements IjqueryPivotOptions {
        public source: any;
        public bTotals: boolean;
        public bCollapsible: boolean;
        public aggregatefunc: (arr: any[]) => any;
        public formatFunc: (n: number) => string;
        public parseNumFunc: (n: string) => number;
        public onResultCellClicked: (dataObjectWithInformationOnClikedCell: resultCellClickedInfo, jqueryElementThatsClicked?: JQuery) => any;
        public noGroupByText: string;
        public noDataText: string;
        public sortPivotColumnHeaders: boolean;
        constructor(source?: any, bTotals?: boolean, bCollapsible?: boolean, aggregatefunc?: (arr: any[]) => any, formatFunc?: (n: number) => string, parseNumFunc?: (n: string) => number, onResultCellClicked?: (dataObjectWithInformationOnClikedCell: resultCellClickedInfo, jqueryElementThatsClicked?: JQuery) => any, noGroupByText?: string, noDataText?: string, sortPivotColumnHeaders?: boolean);
    }
    class resultCellClickedInfoPivotInfo {
        public dataidPivot: string;
        public pivotvalue: string;
        public pivotsortvalue: string;
        constructor(dataidPivot: string, pivotvalue: string, pivotsortvalue: string);
    }
    class resultCellClickedInfoGroupByInfo {
        public dataidGroup: string;
        public groupbyval: string;
        constructor(dataidGroup: string, groupbyval: string);
    }
    class resultCellClickedInfoResultColInfo {
        public colKeyName: string;
        public colName: string;
        constructor(colKeyName: string, colName: string);
    }
    class resultCellClickedInfo {
        public dataidTable: string;
        public pivot: resultCellClickedInfoPivotInfo;
        public groups: resultCellClickedInfoGroupByInfo[];
        public resultcol: resultCellClickedInfoResultColInfo;
        constructor(dataidTable: string, pivot: resultCellClickedInfoPivotInfo, groups: resultCellClickedInfoGroupByInfo[], resultcol: resultCellClickedInfoResultColInfo);
    }
    class pivot {
        private adapter;
        public opts: jqueryPivotOptions;
        constructor(suppliedoptions?: IjqueryPivotOptions);
        public resultCellClicked: (e: JQueryEventObject) => void;
        public flattenFunc: (index: any) => (item: any) => any;
        public getResValues: (treeNode: Jquerypivot.Adapter.TreeNode, pivotValue: any) => any[];
        public appendChildRows: (treeNode: Jquerypivot.Adapter.TreeNode, belowThisRow: JQuery, adapter: Jquerypivot.Adapter.Adapter) => void;
        public makeCollapsed: (adapter: Jquerypivot.Adapter.Adapter, $obj: JQuery) => void;
        public foldunfoldElem: (el: JQuery) => void;
        public foldunfold: (e: JQueryEventObject) => void;
    }
}
interface JQuery {
    pivot(jqueryPivotOptions?: Jquerypivot.Pivot.IjqueryPivotOptions): JQuery;
}
