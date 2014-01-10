module Jquerypivot.Lib {
    export class StringBuilder {
        strings: string[];

        constructor(value?: string) {
            this.strings = [''];
            this.append(value);
        }

        append(value): void {
            if (value !== null) {
                this.strings.push(value);
            }
        }

        clear(): void {
            this.strings.length = 1;
        }

        toString(): string {
            return this.strings.join('');
        }
    }

    //implement array.map. Removes null items as opposed to native array.map.
    export function map<T>(ar: T[], fun: (value: T, index: number, array?: T[]) => any, extra?: any) {
        var i: number, len: number, res: any[] = [], item: any;
        if (ar) {
            {
                for (i = 0, len = ar.length; i < len; i += 1) {
                    item = fun.call(extra, ar[i], i, ar);
                    if (item !==null) {
                        res.push(item);
                    }
                }
            }
            return res;
        }
    }

    //Returns the found element or null
    export function find<T>(ar: T[], fun: (value: T, index: number, array?: T[]) => boolean, extra?: any): T {
        var res: T[];
        if (typeof (ar.filter) === 'function') {
            res = ar.filter(fun, extra);
        } else {
            res = Lib.map(ar, 
                (value: T, index: number, array?: T[]) => { 
                    return fun.call(extra, value, index, array)?value:null; 
                }, 
                extra);
        }
        return res.length > 0 ? res[0] : null;
    }

    export function exists<T>(ar: T[], fun: (value: T, index: number, array?: T[]) => boolean, extra?: any): boolean {
        var i: number, len: number, item: T;
        if (ar) {
            if (typeof (ar.some) === 'function') {
                return ar.some(fun, extra);
            }
            else {
                for (i = 0, len = ar.length; i < len; i += 1) {
                    if (fun.call(extra,ar[i], i, ar)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}



