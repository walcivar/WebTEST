// Class1.cs
//

using ClientUI.ViewModel;
using jQueryApi;
using Slick;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm;


namespace ClientUI.View
{

    public static class ConnectionsView
    {
        public static ConnectionsViewModel vm;

        [PreserveCase]
        public static void Init()
        {
            PageEx.MajorVersion = 2013; // Use the CRM2013/2015 styles
            vm = new ConnectionsViewModel();
            ViewBase.RegisterViewModel(vm);

            GridDataViewBinder connectionsDataBinder = new GridDataViewBinder();
            List<Column> columns = GridDataViewBinder.ParseLayout("Connect to, record1id,250,Role,record1roleid,250");
            XrmLookupEditor.BindColumn(columns[1], vm.RoleSearchCommand, "connectionroleid", "name", "");
            Grid connectionsGrid = connectionsDataBinder.DataBindXrmGrid(vm.Connections, columns, "container", "pager", true, false);

            
            ViewBase.RegisterViewModel(vm);
            jQuery.OnDocumentReady(delegate()
            {
                vm.Search();
            });
        }


    }
}
