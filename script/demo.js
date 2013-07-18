/*global jQuery, $, alert*/
$(document).ready(function () {

    var example4JSONdata = {
        dataid: 'An optional sourcetable identifier',
        columns: [
        { colvalue: 'Month ', coltext: 'Month ', header: 'Month ', sortbycol: 'Month ', groupbyrank: null, pivot: true, result: false },
        { colvalue: 'Subject ', coltext: 'Subject ', header: 'Subject ', sortbycol: 'Subject ', groupbyrank: 2, pivot: false, result: false },
        { colvalue: 'Student ', coltext: 'Student ', header: 'Student ', sortbycol: 'Student ', dataid: 'An optional id.', groupbyrank: 1, pivot: false, result: false },
        { colvalue: 'Score ', coltext: 'Score ', header: 'Score ', sortbycol: 'Score ', groupbyrank: null, pivot: false, result: true}],
        rows: [
        { 'Month ': 'January', 'Subject ': 'English', 'Student ': 'Elisa', 'Score ': '8.7' },
        { 'Month ': 'January ', 'Subject ': 'Maths ', 'Student ': 'Elisa ', 'Score ': '6.5 ' },
        { 'Month ': 'January ', 'Subject ': 'Science ', 'Student ': 'Elisa ', 'Score ': '5.8 ' },
        { 'Month ': 'January ', 'Subject ': 'Art ', 'Student ': 'Elisa ', 'Score ': '8.9 ' },
        { 'Month ': 'January ', 'Subject ': 'History ', 'Student ': 'Elisa ', 'Score ': '8.1 ' },
        { 'Month ': 'January ', 'Subject ': 'French ', 'Student ': 'Elisa ', 'Score ': '6.2 ' },
        { 'Month ': 'February ', 'Subject ': 'English ', 'Student ': 'Elisa ', 'Score ': '5.1 ' },
        { 'Month ': 'February ', 'Subject ': 'Maths ', 'Student ': 'Elisa ', 'Score ': '7.2 ' },
        { 'Month ': 'February ', 'Subject ': 'Science ', 'Student ': 'Elisa ', 'Score ': '8.9 ' },
        { 'Month ': 'February ', 'Subject ': 'Art ', 'Student ': 'Elisa ', 'Score ': '8.3 ' },
        { 'Month ': 'February ', 'Subject ': 'History ', 'Student ': 'Elisa ', 'Score ': '8.4 ' },
        { 'Month ': 'February ', 'Subject ': 'French ', 'Student ': 'Elisa ', 'Score ': '5.7 ' },
        { 'Month ': 'March ', 'Subject ': 'English ', 'Student ': 'Elisa ', 'Score ': '4.1 ' },
        { 'Month ': 'March ', 'Subject ': 'Maths ', 'Student ': 'Elisa ', 'Score ': '7.1 ' },
        { 'Month ': 'March ', 'Subject ': 'Science ', 'Student ': 'Elisa ', 'Score ': '4.1 ' },
        { 'Month ': 'March ', 'Subject ': 'Art ', 'Student ': 'Elisa ', 'Score ': '9.2 ' },
        { 'Month ': 'March ', 'Subject ': 'History ', 'Student ': 'Elisa ', 'Score ': '9.1 ' },
        { 'Month ': 'March ', 'Subject ': 'French ', 'Student ': 'Elisa ', 'Score ': '5.6 ' },
        { 'Month ': 'January ', 'Subject ': 'english ', 'Student ': 'Mary ', 'Score ': '8.7 ' },
        { 'Month ': 'January ', 'Subject ': 'Maths ', 'Student ': 'Mary ', 'Score ': '5.3 ' },
        { 'Month ': 'January ', 'Subject ': 'Science ', 'Student ': 'Mary ', 'Score ': '3.5 ' },
        { 'Month ': 'January ', 'Subject ': 'Art ', 'Student ': 'Mary ', 'Score ': '6.1 ' },
        { 'Month ': 'January ', 'Subject ': 'History ', 'Student ': 'Mary ', 'Score ': '5.8 ' },
        { 'Month ': 'January ', 'Subject ': 'French ', 'Student ': 'Mary ', 'Score ': '9.2 ' },
        { 'Month ': 'February ', 'Subject ': 'english ', 'Student ': 'Mary ', 'Score ': '6.8 ' },
        { 'Month ': 'February ', 'Subject ': 'Maths ', 'Student ': 'Mary ', 'Score ': '5.4 ' },
        { 'Month ': 'February ', 'Subject ': 'Science ', 'Student ': 'Mary ', 'Score ': '5.6 ' },
        { 'Month ': 'February ', 'Subject ': 'Art ', 'Student ': 'Mary ', 'Score ': '5.9 ' },
        { 'Month ': 'February ', 'Subject ': 'History ', 'Student ': 'Mary ', 'Score ': '6.1 ' },
        { 'Month ': 'February ', 'Subject ': 'French ', 'Student ': 'Mary ', 'Score ': '9.3 ' },
        { 'Month ': 'March ', 'Subject ': 'english ', 'Student ': 'Mary ', 'Score ': '4.1 ' },
        { 'Month ': 'March ', 'Subject ': 'Maths ', 'Student ': 'Mary ', 'Score ': '3.5 ' },
        { 'Month ': 'March ', 'Subject ': 'Science ', 'Student ': 'Mary ', 'Score ': '4.1 ' },
        { 'Month ': 'March ', 'Subject ': 'Art ', 'Student ': 'Mary ', 'Score ': '4.8 ' },
        { 'Month ': 'March ', 'Subject ': 'History ', 'Student ': 'Mary ', 'Score ': '6.7 ' },
        { 'Month ': 'March ', 'Subject ': 'French ', 'Student ': 'Mary ', 'Score ': '9.0 '}]
    },

        example5JSONdata = {
            'dataid': 'An identifier for the table',
            'columns': [
            { 'colvalue': 'companyid ', 'coltext': 'companyid ', 'header': 'companyid ', 'datatype': 'number', 'sortbycol': 'companyid ', 'groupbyrank': 2, 'pivot': false, 'result': false },
            { 'colvalue': 'userid ', 'coltext': 'userid ', 'header': 'userid ', 'datatype': 'number', 'sortbycol': 'userid ', 'groupbyrank': 3, 'pivot': false, 'result': false },
            { 'colvalue': 'date ', 'coltext': 'date ', 'header': 'date ', 'sortbycol': 'date ', 'dataid': 'idforpivot', 'groupbyrank': null, 'pivot': true, 'result': false },
            { 'colvalue': 'regMinutes ', 'coltext': 'regMinutes ', 'header': 'regMinutes ', 'sortbycol': 'regMinutes ', 'groupbyrank': null, 'pivot': false, 'result': false },
            { 'colvalue': 'flexMinutes ', 'coltext': 'flexMinutes ', 'header': 'flexMinutes ', 'sortbycol': 'flexMinutes ', 'groupbyrank': null, 'pivot': false, 'result': false },
            { 'colvalue': 'correction ', 'coltext': 'correction ', 'header': 'correction ', 'sortbycol': 'correction ', 'groupbyrank': null, 'pivot': false, 'result': false },
            { 'colvalue': 'diffMinutes ', 'coltext': 'diffMinutes ', 'header': 'diffMinutes ', 'sortbycol': 'diffMinutes ', 'groupbyrank': null, 'pivot': false, 'result': true}],
            'rows': [
            { 'companyid ': 2, 'userid ': 1, 'date ': '02-08-2009 ', 'regMinutes ': '0 ', 'flexMinutes ': '0 ', 'correction ': '0 ', 'diffMinutes ': '0 ' },
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
        },

    example6JSONdata = {
        dataid: 'Application Information.',
        columns: [
       { colvalue: 'password', coltext: 'password', header: 'password', sortbycol: 'password', result: true },
       { colvalue: 'username', coltext: 'username', header: 'username', sortbycol: 'username', pivot: true },
       { colvalue: 'hostname', coltext: 'hostname', header: 'hostname', sortbycol: 'hostname', groupbyrank: 2 },
       { colvalue: 'sysid', coltext: 'sysid', header: 'sysid', sortbycol: 'sysid', dataid: 'sysid', groupbyrank: 1}],
        rows: [
       { 'sysid': 'SID1', 'hostname': 'host01', 'username': 'user1', 'password': 'a' },
       { 'sysid': 'SID1', 'hostname': 'host01', 'username': 'user2', 'password': 'b' },
       { 'sysid': 'SID1', 'hostname': 'host51', 'username': 'user1', 'password': 'c' },
       { 'sysid': 'SID1', 'hostname': 'host52', 'username': 'user1', 'password': 'd' },
       { 'sysid': 'SID1', 'hostname': 'host52', 'username': 'user2', 'password': 'e' },
       { 'sysid': 'SID1', 'hostname': 'host52', 'username': 'user2', 'password': 'e1' },
       { 'sysid': 'SID1', 'hostname': 'host52', 'username': 'user2', 'password': 'e2' },
       { 'sysid': 'SID1', 'hostname': 'host52', 'username': 'user2', 'password': 'e3' },
       { 'sysid': 'SID1', 'hostname': 'host54', 'username': 'user1', 'password': 'f' },
       { 'sysid': 'SID2', 'hostname': 'host55', 'username': 'user1', 'password': 'g' },
       { 'sysid': 'SID2', 'hostname': 'host55', 'username': 'user2', 'password': 'h' },
       { 'sysid': 'SID2', 'hostname': 'host02', 'username': 'user1', 'password': 'i' },
       { 'sysid': 'SID2', 'hostname': 'host02', 'username': 'user1', 'password': 'j' },
       { 'sysid': 'SID2', 'hostname': 'host53', 'username': 'user1', 'password': 'k' },
       { 'sysid': 'SID2', 'hostname': 'host53', 'username': 'user2', 'password': 'l' },
       { 'sysid': 'SID2', 'hostname': 'host53', 'username': 'user3', 'password': 'm'}]
    };


    function dumpObj(obj, name, depth) {
        var indentTpl = '    ',
            indent = '',
            MAX_DUMP_DEPTH = 10,
            propertyStrings = [],
            child = null,
            i, item, output;

        depth = depth || 1;

        for (i = 0; i < depth; i += 1) {
            indent += indentTpl;
        }


        if (depth > MAX_DUMP_DEPTH) {
            return indent + name + ': <Maximum Depth Reached>\n';
        }
        if (typeof obj === 'object') {
            output = indent + name + ' : {\n';
            for (item in obj) {
                if (obj.hasOwnProperty(item)) {
                    try {
                        child = obj[item];
                    } catch (e) {
                        child = '<Unable to Evaluate>';
                    }
                    if (typeof child === 'object') {
                        propertyStrings.push(dumpObj(child, item, depth + 1));
                    } else {
                        propertyStrings.push(indent + indentTpl + item + ': ' + (typeof child === 'string' ? '"' + child + '"' : child));
                    }
                }
            }
            output += propertyStrings.join(', \n') + '}';
            return output;
        } else if (typeof obj === 'string') {
            return '"' + obj + '"';
        } else {
            return obj;
        }
    }

    $('#example1').click(function () {
        $('table').hide();
        $('#res').pivot({
            source: $(this),
            formatFunc: function (n) { return jQuery.fn.pivot.formatUK(n, 2); },
            onResultCellClicked: function (data) { alert(dumpObj(data, 'data')); }
        });
    });
    $('#example2').click(function () {
        $('table').hide();
        $('#res').pivot({
            source: $(this),
            formatFunc: function (n) { return jQuery.fn.pivot.formatDK(n, 2); },
            parseNumFunc: function (n) { return +((typeof n === 'string') ? +n.replace('.', '').replace(',', '.') : n); },
            onResultCellClicked: function (data) { alert(dumpObj(data, 'data')); },
            bCollapsible : false
        });
    });
    $('#example3').click(function () {
        $('table').hide();
        $('#res').pivot({
            source: $(this),
            formatFunc: function (n) { return jQuery.fn.pivot.formatDK(n, 2); },
            parseNumFunc: function (n) { return +((typeof n === 'string') ? +n.replace('.', '').replace(',', '.') : n); },
            onResultCellClicked: function (data) { alert(dumpObj(data, 'data')); }
        });
    });


    $('a.runexample').click(function () {
        var exampleId = $(this).attr('title');
        $('#sourcetables table').hide();
        $('#' + exampleId).show();
        $('#res').html('<h3>Click the source table and it will be transformed into a pivot table</h3>');
        $('#res2').html('');
        $('#demos').show();
        $('#doc').hide();

        if (exampleId === 'example4') {
            $('#res').pivot({
                source: example4JSONdata,
                formatFunc: function (n) { return jQuery.fn.pivot.formatUK(n, 2); },
                onResultCellClicked: function (data) { alert(dumpObj(data, 'data')); }
            });
        } else if (exampleId === 'example5') {
            $('#res').pivot({
                source: example4JSONdata, //same as example 1
                formatFunc: function (n) { return jQuery.fn.pivot.formatUK(n, 2); },
                onResultCellClicked: function (data) { alert(dumpObj(data, 'data')); }
            });
            $('#res2').pivot({
                source: example5JSONdata, //same as example 2
                formatFunc: function (n) { return jQuery.fn.pivot.formatDK(n, 2); },
                parseNumFunc: function (n) { return +((typeof n === 'string') ? +n.replace('.', '').replace(',', '.') : n); },
                onResultCellClicked: function (data) { alert(dumpObj(data, 'data')); }
            });
        } else if (exampleId === 'example6') {
            $('#res').pivot({
                source: example6JSONdata,
                parseNumFunc: null,
                aggregatefunc: function (aggValues) { return aggValues.join(', '); },
                bTotals: false,
                onResultCellClicked: function (data) { alert(dumpObj(data, 'data')); }
            });
        } else if (exampleId === 'example7') {
            $('#res').html('fetching data from netflix. please wait.');
            $.ajax({
                dataType: 'jsonp',
                url: 'http://odata.netflix.com/v2/Catalog/TitleAwards?$expand=Person,Title&$format=json',
                //                http://services.odata.org/Northwind/Northwind.svc/Orders()?$top=10&$expand=Customer, Order_Details/Product/Supplier

                jsonp: '$callback',
                success: function (data) {
                    var i, beforetime;
                    var rows = jQuery.map(data.d.results, function (award) {
                        if (award.Person) {
                            jQuery.extend(award, { personid: award.Person.Id, personname: award.Person.Name });
                        }
                        if (award.Title) {
                            jQuery.extend(award, { movieid: award.Title.Id, moviename: award.Title.Name, movieruntime: award.Title.Runtime, movieparentalrating: award.Title.Rating, movieavaragerating: award.Title.AverageRating });
                        }
                        return award;
                    });

                    var JSONdata = {
                        dataid: 'An optional sourcetable identifier',
                        columns: [
                                { colvalue: 'movieruntime', coltext: 'movieruntime', header: 'Runtime minutes', sortbycol: 'movieruntime', result: true },
                                { colvalue: 'movieavaragerating', coltext: 'movieavaragerating', header: 'Average rating', sortbycol: 'movieavaragerating', pivot: 1 },
                                { colvalue: 'Type', coltext: 'Type', header: 'Award Type', sortbycol: 'Type', groupbyrank: 1 },
                                { colvalue: 'Category', coltext: 'Category', header: 'Award Category', sortbycol: 'Category', groupbyrank: 2 },
                                { colvalue: 'personname', coltext: 'personname', header: 'Person', sortbycol: 'personname', groupbyrank: 4 },
                                { colvalue: 'movieid', coltext: 'moviename', header: 'Movie name', sortbycol: 'movieid', groupbyrank: 3}],
                        rows: $.merge([], rows)
                    };

                    for (i = 1; i < 20; i = i + 1) {
                        $.merge(JSONdata.rows, rows);
                    }

                    //time the pivot
                    beforetime = (new Date()).getTime();
                    $('#res').pivot({
                        source: JSONdata,
                        bTotals: true,
                        onResultCellClicked: function (data) { alert(dumpObj(data, 'data')); }
                    });
                    alert('time taken ' + ((new Date()).getTime() - beforetime) + ' ms. Proccessed ' + JSONdata.rows.length + ' rows.');
                },
                error: function () { alert('odata api not available');}
            });
        }
    });

    $('#backToDoc').click(function () {
        $('#demos').hide();
        $('#doc').show();
    });
});