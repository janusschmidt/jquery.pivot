/// <reference path="../definitions/jasmine.d.ts" />
/// <reference path="../definitions/jquery.d.ts"/>
/// <reference path="../src/adapter.ts"/>
/// <reference path="../src/jquery.pivot.ts"/>

var example5JSONdata: Jquerypivot.Adapter.jsonsource = {
    'dataid': 'An identifier for the table',
    'columns': [
        { 'colvalue': 'companyid ', 'coltext': 'companyid ', 'header': 'companyid ', 'datatype': 'number', 'sortbycol': 'companyid ', 'groupbyrank': 2, 'pivot': false, 'result': false },
        { 'colvalue': 'userid ', 'coltext': 'userid ', 'header': 'userid ', 'datatype': 'number', 'sortbycol': 'userid ', 'groupbyrank': 3, 'pivot': false, 'result': false },
        { 'colvalue': 'date ', 'coltext': 'date ', 'header': 'date ', 'sortbycol': 'date ', 'dataid': 'idforpivot', 'groupbyrank': null, 'pivot': true, 'result': false },
        { 'colvalue': 'regMinutes ', 'coltext': 'regMinutes ', 'header': 'regMinutes ', 'sortbycol': 'regMinutes ', 'groupbyrank': null, 'pivot': false, 'result': false },
        { 'colvalue': 'flexMinutes ', 'coltext': 'flexMinutes ', 'header': 'flexMinutes ', 'sortbycol': 'flexMinutes ', 'groupbyrank': null, 'pivot': false, 'result': false },
        { 'colvalue': 'correction ', 'coltext': 'correction ', 'header': 'correction ', 'sortbycol': 'correction ', 'groupbyrank': null, 'pivot': false, 'result': false },
        { 'colvalue': 'diffMinutes ', 'coltext': 'diffMinutes ', 'header': 'diffMinutes ', 'sortbycol': 'diffMinutes ', 'groupbyrank': null, 'pivot': false, 'result': true }
    ],
    'rows' : [{ 'companyid ': 2, 'userid ': 1, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '330 ', 'correction ': '0 ', 'diffMinutes ': '-330 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '330 ', 'correction ': '0 ', 'diffMinutes ': '-330 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
            { 'companyid ': 2, 'userid ': 1, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '300 ', 'correction ': '0 ', 'diffMinutes ': '-300 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '01-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '03-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '04-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '480 ', 'correction ': '0 ', 'diffMinutes ': '-480 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '05-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '06-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '07-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '08-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '09-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '420 ', 'correction ': '0 ', 'diffMinutes ': '-420 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '10-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '11-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 18, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 86, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 87, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 ' },
            { 'companyid ': 4, 'userid ': 88, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 89, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 90, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 91, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 92, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '390 ', 'correction ': '0 ', 'diffMinutes ': '-390 ' },
            { 'companyid ': 4, 'userid ': 93, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '480 ', 'correction ': '0 ', 'diffMinutes ': '-480 ' },
            { 'companyid ': 4, 'userid ': 94, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 95, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '450 ', 'correction ': '0 ', 'diffMinutes ': '-450 ' },
            { 'companyid ': 4, 'userid ': 121, 'date ': '12-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '360 ', 'correction ': '0 ', 'diffMinutes ': '-360 '}]
};

var htmlTableData = '<table id="htmlTableData" data-pivot-dataid="An optional sourcetable identifier" style="display: none;"> '+
'                <tr>                                                                                         '+
'                    <th data-pivot-pivot="true">Month </th>                                                  '+
'                    <th data-pivot-groupbyrank="2">Subject </th>                                             '+
'                    <th data-pivot-groupbyrank="1" data-pivot-dataid="An optional id.">Student </th>         '+
'                    <th data-pivot-result="true">Score </th>                                                 '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January</td>                                                                         '+
'                    <td>English</td>                                                                         '+
'                    <td>Elisa</td>                                                                           '+
'                    <td>8.7</td>                                                                             '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>Maths </td>                                                                          '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>6.5 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>Science </td>                                                                        '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>5.8 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>Art </td>                                                                            '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>8.9 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>History </td>                                                                        '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>8.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>French </td>                                                                         '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>6.2 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>English </td>                                                                        '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>5.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>Maths </td>                                                                          '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>7.2 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>Science </td>                                                                        '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>8.9 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>Art </td>                                                                            '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>8.3 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>History </td>                                                                        '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>8.4 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>French </td>                                                                         '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>5.7 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>English </td>                                                                        '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>4.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>Maths </td>                                                                          '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>7.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>Science </td>                                                                        '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>4.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>Art </td>                                                                            '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>9.2 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>History </td>                                                                        '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>9.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>French </td>                                                                         '+
'                    <td>Elisa </td>                                                                          '+
'                    <td>5.6 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>english </td>                                                                        '+
'                    <td>Mary </td>                                                                           '+
'                    <td>8.7 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>Maths </td>                                                                          '+
'                    <td>Mary </td>                                                                           '+
'                    <td>5.3 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>Science </td>                                                                        '+
'                    <td>Mary </td>                                                                           '+
'                    <td>3.5 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>Art </td>                                                                            '+
'                    <td>Mary </td>                                                                           '+
'                    <td>6.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>History </td>                                                                        '+
'                    <td>Mary </td>                                                                           '+
'                    <td>5.8 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>January </td>                                                                        '+
'                    <td>French </td>                                                                         '+
'                    <td>Mary </td>                                                                           '+
'                    <td>9.2 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>english </td>                                                                        '+
'                    <td>Mary </td>                                                                           '+
'                    <td>6.8 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>Maths </td>                                                                          '+
'                    <td>Mary </td>                                                                           '+
'                    <td>5.4 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>Science </td>                                                                        '+
'                    <td>Mary </td>                                                                           '+
'                    <td>5.6 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>Art </td>                                                                            '+
'                    <td>Mary </td>                                                                           '+
'                    <td>5.9 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>History </td>                                                                        '+
'                    <td>Mary </td>                                                                           '+
'                    <td>6.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>February </td>                                                                       '+
'                    <td>French </td>                                                                         '+
'                    <td>Mary </td>                                                                           '+
'                    <td>9.3 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>english </td>                                                                        '+
'                    <td>Mary </td>                                                                           '+
'                    <td>4.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>Maths </td>                                                                          '+
'                    <td>Mary </td>                                                                           '+
'                    <td>3.5 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>Science </td>                                                                        '+
'                    <td>Mary </td>                                                                           '+
'                    <td>4.1 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>Art </td>                                                                            '+
'                    <td>Mary </td>                                                                           '+
'                    <td>4.8 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>History </td>                                                                        '+
'                    <td>Mary </td>                                                                           '+
'                    <td>6.7 </td>                                                                            '+
'                </tr>                                                                                        '+
'                <tr>                                                                                         '+
'                    <td>March </td>                                                                          '+
'                    <td>French </td>                                                                         '+
'                    <td>Mary </td>                                                                           '+
'                    <td>9.0 </td>                                                                            '+
'                </tr>                                                                                        '+
'            </table>                                                                                         ';


describe("Adapter", () => {
    var JSONdata: any = $.extend({}, example5JSONdata),
        rows = JSONdata.rows.slice(0, 100),
        maxMilliSeconds = 1000,
        i;

    JSONdata.rows = rows.slice(0);
    for (i = 1; i < 100; i = i + 1) {
        $.merge(JSONdata.rows, rows);
    }

    it("processes " + JSONdata.rows.length + " lines in less than " + maxMilliSeconds + " ms (Rough test that nothing has has broken performance)", function () {
        var sut, ticks;

        ticks = (new Date()).getTime();
        sut = new Jquerypivot.Adapter.Adapter();
        sut.parseJSONsource(JSONdata);
        ticks = (new Date()).getTime() - ticks;
        expect(ticks).toBeLessThan(maxMilliSeconds);
    });
});

describe("Pivot from json", function() {
    var sut: JQuery;

    beforeEach(() => {
        $('body').append('<div id="pivotdiv"></div>');
        sut = $('#pivotdiv').pivot({
            source: example5JSONdata,
            formatFunc: function (n) { return jQuery.fn.pivot.formatDK(n, 2); },
            parseNumFunc: function (n) { return +((typeof n === 'string') ? n.replace('.', '').replace(',', '.') : n); },
            bCollapsible: false
        });
    });

    afterEach(() => { $('#pivotdiv').remove()});

    describe("with format function and expand all", function () {
        it("shows the correct amount of groupby columns", function () {
            expect(sut.find('table.pivot tr.head th.groupby').length).toEqual(2);
        });

        it("shows the correct amount of sorted pivot columns headers", function () {
            var shouldbe = [
                '01-08-2009',
                '02-08-2009',
                '03-08-2009',
                '04-08-2009',
                '05-08-2009',
                '06-08-2009',
                '07-08-2009',
                '08-08-2009',
                '09-08-2009',
                '10-08-2009',
                '11-08-2009',
                '12-08-2009'];

            var res = sut.find('table.pivot tr.head th.pivotcol').map(function () { return $(this).text(); }).get();
            expect(sut.find('table.pivot tr.head th.pivotcol').length).toEqual(12);
            expect(res).toEqual(shouldbe);
        });

        it("Has the right level0 groupby values", function () {
            var expectedLevelGroupByValues = ['2', '', '4', ''];
            var expectedSums = [
                '0,00', '0,00', '-330,00', '-300,00', '-300,00', '-300,00', '-300,00', '0,00', '0,00', '-330,00', '-300,00', '-300,00',
                '0,00', '0,00', '-5.040,00', '-5.040,00', '-5.130,00', '-4.650,00', '-4.380,00', '0,00', '0,00', '-5.040,00', '-5.040,00', '-5.130,00'];

            var levelGroupbyValues = $('table.pivot tr.level0 th').map(function () { return $.trim($(this).text()); }).get();
            var rowSums = $('table.pivot tr.level0 td.resultcell').map(function () { return $(this).text(); }).get();

            expect(expectedLevelGroupByValues).toEqual(levelGroupbyValues);
            expect(rowSums).toEqual(expectedSums);
        });

        it("Has the right level1 groupby values", function () {
            var expectedLevelGroupByValues = ["", "1", "", "18", "", "86", "", "87", "", "88", "", "89", "", "90", "", "91", "", "92", "", "93", "", "94", "", "95", "", "121"];
            var expectedSums = ['0,00', '0,00', '-330,00', '-300,00', '-300,00', '-300,00', '-300,00', '0,00', '0,00', '-330,00', '-300,00', '-300,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00',
                '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00',
                '-450,00', '0,00', '0,00', '-360,00', '-360,00', '-360,00', '-360,00', '-360,00', '0,00', '0,00', '-360,00', '-360,00', '-360,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00',
                '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00',
                '-450,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '0,00', '0,00', '-390,00', '-390,00', '-390,00',
                '-390,00', '-360,00', '0,00', '0,00', '-390,00', '-390,00', '-390,00', '0,00', '0,00', '-420,00', '-390,00', '-390,00', '0,00', '0,00', '0,00', '0,00', '-420,00', '-390,00',
                '-390,00', '0,00', '0,00', '-360,00', '-390,00', '-480,00', '-390,00', '-360,00', '0,00', '0,00', '-360,00', '-390,00', '-480,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00',
                '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '0,00', '0,00', '-450,00', '-450,00', '-450,00', '-450,00', '-420,00', '0,00', '0,00', '-450,00', '-450,00',
                '-450,00', '0,00', '0,00', '-360,00', '-360,00', '-360,00', '-360,00', '-360,00', '0,00', '0,00', '-360,00', '-360,00', '-360,00'];

            var levelGroupbyValues = $('table.pivot tr.level1 th').map(function () { return $.trim($(this).text()); }).get();
            var levelSums = $('table.pivot tr.level1 td.resultcell').map(function () { return $(this).text(); }).get()

            expect(levelGroupbyValues).toEqual(expectedLevelGroupByValues);
            expect(levelSums).toEqual(expectedSums);
        });

        it("Has the right row totals", function () {
            var expectedRowTotals = ["-2.460,00", "-2.460,00", "-39.450,00", "-3.570,00", "-3.570,00", "-2.880,00", "-3.570,00", "-3.570,00", "-3.570,00", "-3.090,00", "-2.400,00", "-3.210,00", "-3.570,00", "-3.570,00", "-2.880,00"];
            var rowTotals = $('table.pivot tr:not(.total) td.total').map(function () { return $.trim($(this).text()); }).get()

        expect(rowTotals).toEqual(expectedRowTotals);
        });

        it("Has the right pivot column totals", function () {
            var expectedPivotColumnTotals = ["0,00", "0,00", "-5.370,00", "-5.340,00", "-5.430,00", "-4.950,00", "-4.680,00", "0,00", "0,00", "-5.370,00", "-5.340,00", "-5.430,00", "-41.910,00"];
            var pivotColumnTotals = $('table.pivot tr.total td').map(function () { return $.trim($(this).text()); }).get();

            expect(pivotColumnTotals).toEqual(expectedPivotColumnTotals);
        });
    });
});

describe("Pivot from html table", function() {
    var sut: JQuery;

    beforeEach(() => {
        $('body').append(htmlTableData).append('<div id="pivotdiv"></div>');
        sut = $('#pivotdiv').pivot({
            source: $('#htmlTableData'),
            formatFunc: function (n) { return jQuery.fn.pivot.formatUK(n, 2); },
            bCollapsible: false,
            sortPivotColumnHeaders:false
        });
    });

    afterEach(() => { $('#pivotdiv, #htmlTableData').remove()});

    describe("with format function and expand all", function () {
        it("shows the correct amount of groupby columns", function () {
            expect(sut.find('table.pivot tr.head th.groupby').length).toEqual(2);
        });

        it("shows the correct amount of sorted pivot columns headers", function () {
            var shouldbe = ['January', 'February', 'March'];

            var res = sut.find('table.pivot tr.head th.pivotcol').map(function () { return $(this).text(); }).get();
            expect(sut.find('table.pivot tr.head th.pivotcol').length).toEqual(3);
            expect(res).toEqual(shouldbe);
        });

        it("Has the right level0 groupby values", function () {
            var expectedLevelGroupByValues = [ 'Elisa','', 'Mary', ''];
            var expectedSums = [ '44.20', '43.60', '39.20', '38.60', '39.10', '32.20' ];

            var levelGroupbyValues = $('table.pivot tr.level0 th').map(function () { return $.trim($(this).text()); }).get();
            var rowSums = $('table.pivot tr.level0 td.resultcell').map(function () { return $(this).text(); }).get();

            expect(expectedLevelGroupByValues).toEqual(levelGroupbyValues);
            expect(rowSums).toEqual(expectedSums);
        });

        it("Has the right level1 groupby values", function () {
            var expectedLevelGroupByValues = [ '', 'Art', '', 'English', '', 'French', '', 'History', '', 'Maths', '', 'Science', '', 'Art', '', 'French', '', 'History', '', 'Maths', '', 'Science', '', 'english' ];
            var expectedSums = [ '8.90', '8.30', '9.20', '8.70', '5.10', '4.10', '6.20', '5.70', '5.60', '8.10', '8.40', '9.10', '6.50', '7.20', '7.10', '5.80', '8.90', '4.10', '6.10', '5.90', '4.80', '9.20', '9.30', '9.00', '5.80', '6.10', '6.70', '5.30', '5.40', '3.50', '3.50', '5.60', '4.10', '8.70', '6.80', '4.10' ];

            var levelGroupbyValues = $('table.pivot tr.level1 th').map(function () { return $.trim($(this).text()); }).get();
            var levelSums = $('table.pivot tr.level1 td.resultcell').map(function () { return $(this).text(); }).get()

            expect(levelGroupbyValues).toEqual(expectedLevelGroupByValues);
            expect(levelSums).toEqual(expectedSums);
        });

        it("Has the right row totals", function () {
            var expectedRowTotals = [ '127.00', '26.40', '17.90', '17.50', '25.60', '20.80', '18.80', '109.90', '16.80', '27.50', '18.60', '14.20', '13.20', '19.60' ];
            var rowTotals = $('table.pivot tr:not(.total) td.total').map(function () { return $.trim($(this).text()); }).get()

        expect(rowTotals).toEqual(expectedRowTotals);
        });

        it("Has the right pivot column totals", function () {
            var expectedPivotColumnTotals = [ '82.80', '82.70', '71.40', '236.90' ];
            var pivotColumnTotals = $('table.pivot tr.total td').map(function () { return $.trim($(this).text()); }).get();

            expect(pivotColumnTotals).toEqual(expectedPivotColumnTotals);
        });
    });
});
