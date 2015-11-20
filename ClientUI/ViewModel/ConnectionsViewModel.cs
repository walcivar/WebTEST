// ConnectionsViewModel.cs
//

using ClientUI.Model;
using KnockoutApi;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm.Sdk;
using Slick;

namespace ClientUI.ViewModel
{
    public class ConnectionsViewModel : ViewModelBase
    {
        public EntityDataViewModel Connections = new EntityDataViewModel(25, typeof(Connection), true);

        #region Fields
        [PreserveCase]
        public Observable<string> ErrorMessage;
        [PreserveCase]
        public Observable<ObservableConnection> ConnectionEdit;
        [PreserveCase]
        public Observable<bool> AllowAddNew = Knockout.Observable<bool>(true);
        #endregion

        #region Constructors
        public ConnectionsViewModel()
        {
            ObservableConnection connection = new ObservableConnection();
            ConnectionEdit = (Observable<ObservableConnection>)ValidatedObservableFactory.ValidatedObservable(connection);
            ConnectionEdit.GetValue().OnSaveComplete += ConnectionsViewModel_OnSaveComplete;
            ErrorMessage = Knockout.Observable<string>();
            Connections.OnDataLoaded.Subscribe(Connections_OnDataLoaded);

            ObservableConnection.RegisterValidation(Connections.ValidationBinder);
        }

        private void Connections_OnDataLoaded(EventData e, object data)
        {
            DataLoadedNotifyEventArgs args = (DataLoadedNotifyEventArgs)data;
            for (int i = 0; i < args.To; i++)
            {
                Connection connection = (Connection)Connections.GetItem(i);
                if (connection == null)
                    return;
                connection.PropertyChanged += connection_PropertyChanged;
            }
        }

        public void connection_PropertyChanged(object sender, Xrm.ComponentModel.PropertyChangedEventArgs e)
        {
            if(e.PropertyName == "record1roleid")
            {
                Connection update = (Connection)sender;
                Connection connectionToUpdate = new Connection();
                connectionToUpdate.ConnectionId = new Guid(update.Id);
                connectionToUpdate.Record1RoleId = update.Record1RoleId;
                OrganizationServiceProxy.BeginUpdate(connectionToUpdate, delegate(object state)
                {
                    try
                    {
                        OrganizationServiceProxy.EndUpdate(state);
                        ErrorMessage.SetValue(null);
                    }
                    catch (Exception ex)
                    {
                        ErrorMessage.SetValue(ex.Message);
                    }
                });
            }
        }

        private void ConnectionsViewModel_OnSaveComplete(string result)
        {
            if (result == null)
            {
                //saved ok
                ErrorMessage.SetValue(null);
            }
            else
            {
                ErrorMessage.SetValue(result);
            }
        }
        #endregion

        #region methods
        public void Search()
        {
            Connections.FetchXml = @"<fetch version='1.0' output-format='xml-platform' mapping ='logical' returntotalrecordcount = 'true' no-lock = 'true' distinct = 'false' count='{0}' paging-cookie='{1}' page='{2}'>
                <entity name ='connection'>
                    <attribute name='record1id' alias='record1id' />   
                    <attribute name='record1roleid' alias='record1roleid' />   
                    <attribute name='record2id' alias='record2id' />   
                    <attribute name='record2roleid' alias='record2roleid' />                   
                    {3}
                   </entity>
                </fetch>";
        }
        #endregion

        #region Commands        

        [PreserveCase]
        public void AddNewCommand()
        {
            ConnectionEdit.GetValue().AddNewVisible.SetValue(true);
        }

        [PreserveCase]
        public void DeleteSelectedCommand()
        {
            
        }

        [PreserveCase]
        public void OpenAssociatedSubGridCommand()
        {
            
        }
        #endregion

        internal void RoleSearchCommand(string term, Action<EntityCollection> results)
        {
            ObservableConnection.RoleSearchCommand(term, results);
        }
    }
}
