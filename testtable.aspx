<%@ page language="C#" autoeventwireup="true" codebehind="testtable.aspx.cs" inherits="jquery.pivot.testtable" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Test data table</title>
    <link href="stylsheet.css" rel="stylesheet" type="text/css" />
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
    <script src="script/jquery.pivot.js"></script>
    <script type="text/javascript">
        /*global jQuery, $, alert*/
        $(document).ready(function () {

            function dumpObj(obj, name, depth) {
                var indentTpl = "    ";
                var indent = "";
                depth = depth || 1;

                for (var i = 0; i < depth; i += 1) {
                    indent += indentTpl;
                }

                var MAX_DUMP_DEPTH = 10;
                var propertyStrings = [];

                if (depth > MAX_DUMP_DEPTH) {
                    return indent + name + ": <Maximum Depth Reached>\n";
                }
                if (typeof obj === "object") {
                    var child = null;
                    var output = indent + name + " : {\n";
                    for (var item in obj) {
                        if (obj.hasOwnProperty(item)) {
                            try {
                                child = obj[item];
                            } catch (e) {
                                child = "<Unable to Evaluate>";
                            }
                            if (typeof child === "object") {
                                propertyStrings.push(dumpObj(child, item, depth + 1));
                            } else {
                                propertyStrings.push(indent + indentTpl + item + ": " + (typeof child === "string" ? "'" + child + "'" : child));
                            }
                        }
                    }
                    output += propertyStrings.join(', \n') + "}";
                    return output;
                } else if (typeof obj === "string") {
                    return "'" + obj + "'";
                } else {
                    return obj;
                }
            }

            $('.rawdata').click(function () {
                $(this).hide();
                $('#res').pivot({
                    source: $(this),
                    formatFunc: function (n) { return jQuery.fn.pivot.formatUK(n, 2); },
                    onResultCellClicked: function (data) { alert(dumpObj(data, "data")); }
                });
            });
        });
    </script>
</head>
<body>
    <p>
        Press table to transform to pivot table</p>
    <form id="form1" runat="server">
    <div>
        <asp:listview id="ListView1" runat="server" datasourceid="ldsTest" enableviewstate="false">
            <itemtemplate>
                <tr style="">
                    <td>
                        <asp:literal runat="server" text='<%# Eval("AddressID") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# Eval("AddressLine1") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# Eval("AddressLine2") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# Eval("City") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# Eval("StateProvince") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# Eval("CountryRegion") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# Eval("PostalCode") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# Eval("rowguid") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# Eval("ModifiedDate") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# ((DateTime) Eval("ModifiedDate")).ToString("MMM") %>' />
                    </td>
                    <td>
                        <asp:literal runat="server" text='<%# Eval("ModifiedDate", "{0:MM}")%>' />
                    </td>
                </tr>
            </itemtemplate>
            <layouttemplate>
                <table id="itemPlaceholderContainer" runat="server" border="0" class="rawdata">
                    <tr runat="server" style="">
                        <th runat="server" result="true" datatype="number">AddressID</th>
                        <th runat="server" >AddressLine1</th>
                        <th runat="server">AddressLine2</th>
                        <th runat="server" groupbyrank="3">City</th>
                        <th runat="server" groupbyrank="2">StateProvince</th>
                        <th runat="server" groupbyrank="1">CountryRegion</th>
                        <th runat="server">PostalCode</th>
                        <th runat="server">rowguid</th>
                        <th runat="server">ModifiedDate</th>
                        <th runat="server" pivot="true" sortbycol="ModifiedMonthNumberFormat">ModifiedMonth</th>
                        <th runat="server">ModifiedMonthNumberFormat</th>
                    </tr>
                    <tr id="itemPlaceholder" runat="server">
                    </tr>
                </table>
            </layouttemplate>
        </asp:listview>
        <asp:linqdatasource id="ldsTest" runat="server" contexttypename="jquery.pivot.model.testdbDataContext" entitytypename="" tablename="Addresses">
        </asp:linqdatasource>
    </div>
    <div id="res"></div>
    </form>
</body>
</html>
