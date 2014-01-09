/// <reference path="../src/ts/definitions/jquery.d.ts" />
/// <reference path="../src/ts/definitions/jasmine.d.ts" />
declare module jquerypivot.lib {
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
declare module jquerypivot {
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
        result: any;
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
        public visible(): any;
    }
    class Adapter {
        public dataid: string;
        public alGroupByCols: column[];
        public bInvSort: boolean;
        public pivotCol: column;
        public resultCol: column;
        public tree: TreeNode;
        public uniquePivotValues: pivotItem[];
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
declare module jquerypivot {
    interface IjqueryPivotOptions {
        source: any;
        bTotals?: boolean;
        bCollapsible?: boolean;
        aggregatefunc?: Function;
        formatFunc?: (n: number) => string;
        parseNumFunc?: (n: string) => number;
        onResultCellClicked?: (dataObjectWithInformationOnClikedCell: {}, jqueryElementThatsClicked?: JQuery) => any;
        noGroupByText?: string;
        noDataText?: string;
        sortPivotColumnHeaders?: boolean;
    }
    class jqueryPivotOptions implements IjqueryPivotOptions {
        public source: any;
        public bTotals: boolean;
        public bCollapsible: boolean;
        public aggregatefunc: Function;
        public formatFunc: (n: any) => string;
        public parseNumFunc: (n: string) => number;
        public onResultCellClicked: (dataObjectWithInformationOnClikedCell: {}, jqueryElementThatsClicked?: JQuery) => any;
        public noGroupByText: string;
        public noDataText: string;
        public sortPivotColumnHeaders: boolean;
        constructor(source?: any, bTotals?: boolean, bCollapsible?: boolean, aggregatefunc?: Function, formatFunc?: (n: any) => string, parseNumFunc?: (n: string) => number, onResultCellClicked?: (dataObjectWithInformationOnClikedCell: {}, jqueryElementThatsClicked?: JQuery) => any, noGroupByText?: string, noDataText?: string, sortPivotColumnHeaders?: boolean);
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
    class resultCellClickedInfo {
        public dataidTable: string;
        public pivot: resultCellClickedInfoPivotInfo;
        public groups: resultCellClickedInfoGroupByInfo[];
        constructor(dataidTable: string, pivot: resultCellClickedInfoPivotInfo, groups: resultCellClickedInfoGroupByInfo[]);
    }
    class pivot {
        public opts: jqueryPivotOptions;
        constructor(suppliedoptions?: IjqueryPivotOptions);
        public resultCellClicked: (e: JQueryEventObject) => void;
        public getResValue: (treeNode: jquerypivot.TreeNode, pivotValue: any) => any;
        public appendChildRows: (treeNode: jquerypivot.TreeNode, belowThisRow: JQuery, adapter: jquerypivot.Adapter) => void;
        public makeCollapsed: (adapter: jquerypivot.Adapter, $obj: JQuery) => void;
        public foldunfoldElem: (el: JQuery) => void;
        public foldunfold: (e: JQueryEventObject) => void;
    }
}
interface JQuery {
    pivot(jqueryPivotOptions?: jquerypivot.IjqueryPivotOptions): JQuery;
}
declare var example5JSONdata: jquerypivot.jsonsource;
declare var htmlTableData: string;
