declare module lib {
    class StringBuilder {
        public strings: string[];
        constructor(value?: string);
        public append(value): void;
        public clear(): void;
        public toString(): string;
    }
    function map<T>(ar: T[], fun: (value: T, index: number, array?: T[]) => any, extra?: any): T[];
    function find<T>(ar: T[], fun: (value: T, index: number, array?: T[]) => boolean, extra?: any): T;
    function exists<T>(ar: T[], fun: (value: T, index: number, array?: T[]) => boolean, extra?: any): boolean;
}
declare module data {
    interface column {
        colvalue: string;
        coltext: string;
        header?: string;
        sortbycol: string;
        groupbyrank: number;
        pivot?: boolean;
        result?: boolean;
        dataid: string;
        datatype: string;
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
        public visible();
    }
    class adapter {
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
        public parseFromXhtmlTable(sourceTable: JQuery): void;
    }
}
interface JQuery {
    pivot(options?): JQuery;
}
