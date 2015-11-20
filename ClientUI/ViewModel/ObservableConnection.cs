// ObservableConnection.cs
//

using ClientUI.Model;
using KnockoutApi;
using SparkleXrm;
using SparkleXrm.GridEditor;
using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using Xrm.Sdk;

//using ClientUI.ViewModels;

namespace ClientUI.ViewModel
{
    public class ObservableConnection : ViewModelBase
    {
        public event Action<string> OnSaveComplete;
        
        #region fields
        [PreserveCase]
        public Observable<bool> AddNewVisible = Knockout.Observable<bool>(false);
        [ScriptName("connectionid")]
        public Observable<Guid> ConnectionId = Knockout.Observable<Guid>();
        [ScriptName("record1id")]
        public Observable<EntityReference> Record1Id = Knockout.Observable<EntityReference>();
        [ScriptName("record1roleid")]
        public Observable<EntityReference> Record1RoleId = Knockout.Observable<EntityReference>();
        [ScriptName("record2id")]
        public Observable<EntityReference> Record2Id = Knockout.Observable<EntityReference>();
        [ScriptName("record2roleid")]
        public Observable<EntityReference> Record2RoleId = Knockout.Observable<EntityReference>();
        #endregion

        public ObservableConnection()
        {
            ObservableConnection.RegisterValidation(new ObservableValidationBinder(this));
        }

        public static void RegisterValidation(ValidationBinder binder)
        {
            binder.Register("record1id",ValidateRecord1Id);
            binder.Register("record2id", ValidateRecord1RoleId);
        }

        private static ValidationRules ValidateRecord1RoleId(ValidationRules rules, object viewModel, object dataContext)
        {
            return rules
                .AddRule("Required", delegate(object value) {
                    return (value != null) && ((EntityReference)value).Id != null;
                });
        }

        private static ValidationRules ValidateRecord1Id(ValidationRules rules, object viewModel, object dataContext)
        {
            return rules
                .AddRule("Required", delegate(object value)
            {
                return (value != null) && ((EntityReference)value).Id != null;
            });
        }
        
        #region commands
        [PreserveCase]
        public void SaveCommand()
        {
            bool isValid = ((IValidatedObservable)this).IsValid();
            if (!isValid)
            {
                ((IValidatedObservable)this).Errors.ShowAllMessages(true);
                return;
            }
            IsBusy.SetValue(true);

            Connection connection = new Connection();
            connection.Record1Id = Record1Id.GetValue();
            connection.Record2Id = Record2Id.GetValue();
            connection.Record1RoleId = Record1RoleId.GetValue();
            connection.Record2RoleId = Record2RoleId.GetValue();

            OrganizationServiceProxy.BeginCreate(connection, delegate(object State)
            {
                try 
                {
                    ConnectionId.SetValue(OrganizationServiceProxy.EndCreate(State));
                    OnSaveComplete(null);
                    ((IValidatedObservable)this).Errors.ShowAllMessages(false);
                }
                catch (Exception ex)
                {
                    OnSaveComplete(ex.Message);
                }
                finally
                {
                    IsBusy.SetValue(false);
                    AddNewVisible.SetValue(false);
                }
            });
        }
        public void RecordSearchCommand(string term, Action<EntityCollection> callback)
        {
            string fetchXML = @"<fetch version='1.0' output-format='xml-platform' mapping ='logical' distinct = 'true'>
                <entity name ='{1}'>
                    <attribute name='{2}' alias='name' />                   
                    <order attribute='{2}' descending = 'false'/>
                    <filter type = 'and'>
                        <condition attribute='{2}' operator='like' value='%{0}%' />
                    </filter>
                   </entity>
                </fetch>";
            fetchXML = string.Format(fetchXML, XmlHelper.Encode(term), "account", "name");
            OrganizationServiceProxy.BeginRetrieveMultiple(fetchXML, delegate(object result)
            {
                EntityCollection fetchResult = OrganizationServiceProxy.EndRetrieveMultiple(result, typeof(EntityCollection));
                callback(fetchResult);
            });
        }
        public static void RoleSearchCommand(string term, Action<EntityCollection> callback)
        {
            string fetchXML = @"<fetch version='1.0' output-format='xml-platform' mapping ='logical' distinct = 'true'>
                <entity name ='connectionrole'>
                    <attribute name='category' />
                    <attribute name='name' />
                    <attribute name='connectionroleid' />
                    <attribute name='statecode' />
                    <order attribute='name' descending = 'false'/>
                    <filter type = 'and'>
                        <condition attribute='name' operator='like' value='%{0}%' />
                    </filter>
                   </entity>
                </fetch>";
            fetchXML = string.Format(fetchXML, XmlHelper.Encode(term), "account", "name");
            OrganizationServiceProxy.BeginRetrieveMultiple(fetchXML, delegate(object result)
            { 
                EntityCollection fetchResult = OrganizationServiceProxy.EndRetrieveMultiple(result,typeof(EntityCollection));
                callback(fetchResult);
            });
        }
        #endregion
    }
}
