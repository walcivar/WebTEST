//! ClientUI.debug.js
//

(function($){

Type.registerNamespace('ClientUI.Model');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.Model.Connection

ClientUI.Model.Connection = function ClientUI_Model_Connection() {
    ClientUI.Model.Connection.initializeBase(this, [ 'connection' ]);
}
ClientUI.Model.Connection.prototype = {
    connectionid: null,
    record1id: null,
    record1roleid: null,
    record2id: null,
    record2roleid: null
}


Type.registerNamespace('ClientUI.ViewModel');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.ViewModel.ConnectionsViewModel

ClientUI.ViewModel.ConnectionsViewModel = function ClientUI_ViewModel_ConnectionsViewModel() {
    this.connections = new SparkleXrm.GridEditor.EntityDataViewModel(25, ClientUI.Model.Connection, true);
    this.AllowAddNew = ko.observable(true);
    ClientUI.ViewModel.ConnectionsViewModel.initializeBase(this);
    var connection = new ClientUI.ViewModel.ObservableConnection();
    this.ConnectionEdit = ko.validatedObservable(connection);
    this.ConnectionEdit().add_onSaveComplete(ss.Delegate.create(this, this._connectionsViewModel_OnSaveComplete$1));
    this.ErrorMessage = ko.observable();
    this.connections.onDataLoaded.subscribe(ss.Delegate.create(this, this._connections_OnDataLoaded$1));
    ClientUI.ViewModel.ObservableConnection.registerValidation(this.connections.validationBinder);
}
ClientUI.ViewModel.ConnectionsViewModel.prototype = {
    ErrorMessage: null,
    ConnectionEdit: null,
    
    _connections_OnDataLoaded$1: function ClientUI_ViewModel_ConnectionsViewModel$_connections_OnDataLoaded$1(e, data) {
        var args = data;
        for (var i = 0; i < args.to; i++) {
            var connection = this.connections.getItem(i);
            if (connection == null) {
                return;
            }
            connection.add_propertyChanged(ss.Delegate.create(this, this.connection_PropertyChanged));
        }
    },
    
    connection_PropertyChanged: function ClientUI_ViewModel_ConnectionsViewModel$connection_PropertyChanged(sender, e) {
        if (e.propertyName === 'record1roleid') {
            var update = sender;
            var connectionToUpdate = new ClientUI.Model.Connection();
            connectionToUpdate.connectionid = new Xrm.Sdk.Guid(update.id);
            connectionToUpdate.record1roleid = update.record1roleid;
            Xrm.Sdk.OrganizationServiceProxy.beginUpdate(connectionToUpdate, ss.Delegate.create(this, function(state) {
                try {
                    Xrm.Sdk.OrganizationServiceProxy.endUpdate(state);
                    this.ErrorMessage(null);
                }
                catch (ex) {
                    this.ErrorMessage(ex.message);
                }
            }));
        }
    },
    
    _connectionsViewModel_OnSaveComplete$1: function ClientUI_ViewModel_ConnectionsViewModel$_connectionsViewModel_OnSaveComplete$1(result) {
        if (result == null) {
            this.ErrorMessage(null);
        }
        else {
            this.ErrorMessage(result);
        }
    },
    
    search: function ClientUI_ViewModel_ConnectionsViewModel$search() {
        this.connections.set_fetchXml("<fetch version='1.0' output-format='xml-platform' mapping ='logical' returntotalrecordcount = 'true' no-lock = 'true' distinct = 'false' count='{0}' paging-cookie='{1}' page='{2}'>\r\n                <entity name ='connection'>\r\n                    <attribute name='record1id' alias='record1id' />   \r\n                    <attribute name='record1roleid' alias='record1roleid' />   \r\n                    <attribute name='record2id' alias='record2id' />   \r\n                    <attribute name='record2roleid' alias='record2roleid' />                   \r\n                    {3}\r\n                   </entity>\r\n                </fetch>");
    },
    
    AddNewCommand: function ClientUI_ViewModel_ConnectionsViewModel$AddNewCommand() {
        this.ConnectionEdit().AddNewVisible(true);
    },
    
    DeleteSelectedCommand: function ClientUI_ViewModel_ConnectionsViewModel$DeleteSelectedCommand() {
    },
    
    OpenAssociatedSubGridCommand: function ClientUI_ViewModel_ConnectionsViewModel$OpenAssociatedSubGridCommand() {
    },
    
    _roleSearchCommand: function ClientUI_ViewModel_ConnectionsViewModel$_roleSearchCommand(term, results) {
        ClientUI.ViewModel.ObservableConnection.roleSearchCommand(term, results);
    }
}


////////////////////////////////////////////////////////////////////////////////
// ClientUI.ViewModel.ObservableConnection

ClientUI.ViewModel.ObservableConnection = function ClientUI_ViewModel_ObservableConnection() {
    this.AddNewVisible = ko.observable(false);
    this.connectionid = ko.observable();
    this.record1id = ko.observable();
    this.record1roleid = ko.observable();
    this.record2id = ko.observable();
    this.record2roleid = ko.observable();
    ClientUI.ViewModel.ObservableConnection.initializeBase(this);
    ClientUI.ViewModel.ObservableConnection.registerValidation(new SparkleXrm.ObservableValidationBinder(this));
}
ClientUI.ViewModel.ObservableConnection.registerValidation = function ClientUI_ViewModel_ObservableConnection$registerValidation(binder) {
    binder.register('record1id', ClientUI.ViewModel.ObservableConnection._validateRecord1Id$1);
    binder.register('record2id', ClientUI.ViewModel.ObservableConnection._validateRecord1RoleId$1);
}
ClientUI.ViewModel.ObservableConnection._validateRecord1RoleId$1 = function ClientUI_ViewModel_ObservableConnection$_validateRecord1RoleId$1(rules, viewModel, dataContext) {
    return rules.addRule('Required', function(value) {
        return (value != null) && (value).id != null;
    });
}
ClientUI.ViewModel.ObservableConnection._validateRecord1Id$1 = function ClientUI_ViewModel_ObservableConnection$_validateRecord1Id$1(rules, viewModel, dataContext) {
    return rules.addRule('Required', function(value) {
        return (value != null) && (value).id != null;
    });
}
ClientUI.ViewModel.ObservableConnection.roleSearchCommand = function ClientUI_ViewModel_ObservableConnection$roleSearchCommand(term, callback) {
    var fetchXML = "<fetch version='1.0' output-format='xml-platform' mapping ='logical' distinct = 'true'>\r\n                <entity name ='connectionrole'>\r\n                    <attribute name='category' />\r\n                    <attribute name='name' />\r\n                    <attribute name='connectionroleid' />\r\n                    <attribute name='statecode' />\r\n                    <order attribute='name' descending = 'false'/>\r\n                    <filter type = 'and'>\r\n                        <condition attribute='name' operator='like' value='%{0}%' />\r\n                    </filter>\r\n                   </entity>\r\n                </fetch>";
    fetchXML = String.format(fetchXML, Xrm.Sdk.XmlHelper.encode(term), 'account', 'name');
    Xrm.Sdk.OrganizationServiceProxy.beginRetrieveMultiple(fetchXML, function(result) {
        var fetchResult = Xrm.Sdk.OrganizationServiceProxy.endRetrieveMultiple(result, Xrm.Sdk.EntityCollection);
        callback(fetchResult);
    });
}
ClientUI.ViewModel.ObservableConnection.prototype = {
    
    add_onSaveComplete: function ClientUI_ViewModel_ObservableConnection$add_onSaveComplete(value) {
        this.__onSaveComplete$1 = ss.Delegate.combine(this.__onSaveComplete$1, value);
    },
    remove_onSaveComplete: function ClientUI_ViewModel_ObservableConnection$remove_onSaveComplete(value) {
        this.__onSaveComplete$1 = ss.Delegate.remove(this.__onSaveComplete$1, value);
    },
    
    __onSaveComplete$1: null,
    
    SaveCommand: function ClientUI_ViewModel_ObservableConnection$SaveCommand() {
        var isValid = (this).isValid();
        if (!isValid) {
            (this).errors.showAllMessages(true);
            return;
        }
        this.isBusy(true);
        var connection = new ClientUI.Model.Connection();
        connection.record1id = this.record1id();
        connection.record2id = this.record2id();
        connection.record1roleid = this.record1roleid();
        connection.record2roleid = this.record2roleid();
        Xrm.Sdk.OrganizationServiceProxy.beginCreate(connection, ss.Delegate.create(this, function(State) {
            try {
                this.connectionid(Xrm.Sdk.OrganizationServiceProxy.endCreate(State));
                this.__onSaveComplete$1(null);
                (this).errors.showAllMessages(false);
            }
            catch (ex) {
                this.__onSaveComplete$1(ex.message);
            }
            finally {
                this.isBusy(false);
                this.AddNewVisible(false);
            }
        }));
    },
    
    recordSearchCommand: function ClientUI_ViewModel_ObservableConnection$recordSearchCommand(term, callback) {
        var fetchXML = "<fetch version='1.0' output-format='xml-platform' mapping ='logical' distinct = 'true'>\r\n                <entity name ='{1}'>\r\n                    <attribute name='{2}' alias='name' />                   \r\n                    <order attribute='{2}' descending = 'false'/>\r\n                    <filter type = 'and'>\r\n                        <condition attribute='{2}' operator='like' value='%{0}%' />\r\n                    </filter>\r\n                   </entity>\r\n                </fetch>";
        fetchXML = String.format(fetchXML, Xrm.Sdk.XmlHelper.encode(term), 'account', 'name');
        Xrm.Sdk.OrganizationServiceProxy.beginRetrieveMultiple(fetchXML, function(result) {
            var fetchResult = Xrm.Sdk.OrganizationServiceProxy.endRetrieveMultiple(result, Xrm.Sdk.EntityCollection);
            callback(fetchResult);
        });
    }
}


Type.registerNamespace('ClientUI.View');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.View.ConnectionsView

ClientUI.View.ConnectionsView = function ClientUI_View_ConnectionsView() {
}
ClientUI.View.ConnectionsView.Init = function ClientUI_View_ConnectionsView$Init() {
    Xrm.PageEx.majorVersion = 2013;
    ClientUI.View.ConnectionsView.vm = new ClientUI.ViewModel.ConnectionsViewModel();
    SparkleXrm.ViewBase.registerViewModel(ClientUI.View.ConnectionsView.vm);
    var connectionsDataBinder = new SparkleXrm.GridEditor.GridDataViewBinder();
    var columns = SparkleXrm.GridEditor.GridDataViewBinder.parseLayout('Connect to, record1id,250,Role,record1roleid,250');
    SparkleXrm.GridEditor.XrmLookupEditor.bindColumn(columns[1], ss.Delegate.create(ClientUI.View.ConnectionsView.vm, ClientUI.View.ConnectionsView.vm._roleSearchCommand), 'connectionroleid', 'name', '');
    var connectionsGrid = connectionsDataBinder.dataBindXrmGrid(ClientUI.View.ConnectionsView.vm.connections, columns, 'container', 'pager', true, false);
    SparkleXrm.ViewBase.registerViewModel(ClientUI.View.ConnectionsView.vm);
    $(function() {
        ClientUI.View.ConnectionsView.vm.search();
    });
}


ClientUI.Model.Connection.registerClass('ClientUI.Model.Connection', Xrm.Sdk.Entity);
ClientUI.ViewModel.ConnectionsViewModel.registerClass('ClientUI.ViewModel.ConnectionsViewModel', SparkleXrm.ViewModelBase);
ClientUI.ViewModel.ObservableConnection.registerClass('ClientUI.ViewModel.ObservableConnection', SparkleXrm.ViewModelBase);
ClientUI.View.ConnectionsView.registerClass('ClientUI.View.ConnectionsView');
ClientUI.View.ConnectionsView.vm = null;
})(window.xrmjQuery);


