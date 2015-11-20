// ClientUI.UnitTests.js
(function(){
Type.registerNamespace('ClientUI.UnitTests');ClientUI.UnitTests.Bootstrap=function(){}
ClientUI.UnitTests.Bootstrap.RunTests=function(){ClientUI.UnitTests.UnitTest1.run();}
ClientUI.UnitTests.UnitTest1=function(){}
ClientUI.UnitTests.UnitTest1.run=function(){var $0={};$0.beforeEach=ClientUI.UnitTests.UnitTest1.setUp;$0.afterEach=ClientUI.UnitTests.UnitTest1.teardown;QUnit.module('Unit Tests',$0);QUnit.test('Create Connection',ClientUI.UnitTests.UnitTest1.createConnection);}
ClientUI.UnitTests.UnitTest1.setUp=function(){ClientUI.UnitTests.UnitTest1.accounts=[];ClientUI.UnitTests.UnitTest1.accounts.add(ClientUI.UnitTests.UnitTest1.createAccount('Account test 1'));ClientUI.UnitTests.UnitTest1.accounts.add(ClientUI.UnitTests.UnitTest1.createAccount('Account test 2'));}
ClientUI.UnitTests.UnitTest1.createAccount=function(name){var $0=new Xrm.Sdk.Entity('account');$0.setAttributeValue('name',name);$0.id=Xrm.Sdk.OrganizationServiceProxy.create($0).toString();return $0;}
ClientUI.UnitTests.UnitTest1.teardown=function(){var $enum1=ss.IEnumerator.getEnumerator(ClientUI.UnitTests.UnitTest1.accounts);while($enum1.moveNext()){var $0=$enum1.current;Xrm.Sdk.OrganizationServiceProxy.delete_($0.logicalName,new Xrm.Sdk.Guid($0.id));}}
ClientUI.UnitTests.UnitTest1.createConnection=function(assert){assert.expect(1);var $0=assert.async();var $1=new ClientUI.ViewModel.ObservableConnection();$1.record1id(ClientUI.UnitTests.UnitTest1.accounts[0].toEntityReference());$1.record2id(ClientUI.UnitTests.UnitTest1.accounts[1].toEntityReference());$1.add_onSaveComplete(function($p1_0){
assert.equal($p1_0,'Error','Message = '+$p1_0);$0();});$1.SaveCommand();}
ClientUI.UnitTests.Bootstrap.registerClass('ClientUI.UnitTests.Bootstrap');ClientUI.UnitTests.UnitTest1.registerClass('ClientUI.UnitTests.UnitTest1');ClientUI.UnitTests.UnitTest1.accounts=null;})();// This script was generated using Script# v0.7.4.0
