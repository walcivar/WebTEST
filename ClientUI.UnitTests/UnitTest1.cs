// Class1.cs
//

using ClientUI.ViewModel;
using QUnitApi;
using Slick;
using SparkleXrm;
using System;
using System.Collections.Generic;
using System.Html;
using Xrm.Sdk;

namespace ClientUI.UnitTests
{
  
    public class UnitTest1
    {
        public static List<Entity> accounts;
        public static void Run()
        {
            ModuleInfo module = new ModuleInfo();
            module.BeforeEach = SetUp;
            module.AfterEach = Teardown;
            QUnit.Module("Unit Tests", module);
            QUnit.Test("Create Connection", CreateConnection);            
        }

        public static void SetUp()
        {
           // Set up
            accounts = new List<Entity>();
            accounts.Add(CreateAccount("Account test 1"));
            accounts.Add(CreateAccount("Account test 2"));
        }

        public static Entity CreateAccount(string name)
        {
            Entity account = new Entity("account");
            account.SetAttributeValue("name", name);
            account.Id = OrganizationServiceProxy.Create(account).ToString();
            return account;
        }

        public static void Teardown()
        {
            // Teardown
            foreach(Entity account in accounts)
            {
                OrganizationServiceProxy.Delete_(account.LogicalName, new Xrm.Sdk.Guid(account.Id));
            }
        }
        public static void CreateConnection(Assert assert)
        {
            assert.Expect(1);
            Action done = assert.Async();
            ObservableConnection vm = new ObservableConnection();
            vm.Record1Id.SetValue(accounts[0].ToEntityReference());
            vm.Record2Id.SetValue(accounts[1].ToEntityReference());
            vm.OnSaveComplete += delegate(string result)
            {
                assert.Equal(result, "Error", "Message = " + result);
                done();
            };
            vm.SaveCommand();
        }    
    }
}
