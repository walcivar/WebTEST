//! ClientUI.UnitTests.debug.js
//

(function() {

Type.registerNamespace('ClientUI.UnitTests');

////////////////////////////////////////////////////////////////////////////////
// ClientUI.UnitTests.Bootstrap

ClientUI.UnitTests.Bootstrap = function ClientUI_UnitTests_Bootstrap() {
}
ClientUI.UnitTests.Bootstrap.RunTests = function ClientUI_UnitTests_Bootstrap$RunTests() {
    ClientUI.UnitTests.UnitTest1.run();
}


////////////////////////////////////////////////////////////////////////////////
// ClientUI.UnitTests.UnitTest1

ClientUI.UnitTests.UnitTest1 = function ClientUI_UnitTests_UnitTest1() {
}
ClientUI.UnitTests.UnitTest1.run = function ClientUI_UnitTests_UnitTest1$run() {
    var module = {};
    module.beforeEach = ClientUI.UnitTests.UnitTest1.setUp;
    module.afterEach = ClientUI.UnitTests.UnitTest1.teardown;
    QUnit.module('Unit Tests', module);
    QUnit.test('Create Connection', ClientUI.UnitTests.UnitTest1.createConnection);
}
ClientUI.UnitTests.UnitTest1.setUp = function ClientUI_UnitTests_UnitTest1$setUp() {
    ClientUI.UnitTests.UnitTest1.accounts = [];
    ClientUI.UnitTests.UnitTest1.accounts.add(ClientUI.UnitTests.UnitTest1.createAccount('Account test 1'));
    ClientUI.UnitTests.UnitTest1.accounts.add(ClientUI.UnitTests.UnitTest1.createAccount('Account test 2'));
}
ClientUI.UnitTests.UnitTest1.createAccount = function ClientUI_UnitTests_UnitTest1$createAccount(name) {
    var account = new Xrm.Sdk.Entity('account');
    account.setAttributeValue('name', name);
    account.id = Xrm.Sdk.OrganizationServiceProxy.create(account).toString();
    return account;
}
ClientUI.UnitTests.UnitTest1.teardown = function ClientUI_UnitTests_UnitTest1$teardown() {
    var $enum1 = ss.IEnumerator.getEnumerator(ClientUI.UnitTests.UnitTest1.accounts);
    while ($enum1.moveNext()) {
        var account = $enum1.current;
        Xrm.Sdk.OrganizationServiceProxy.delete_(account.logicalName, new Xrm.Sdk.Guid(account.id));
    }
}
ClientUI.UnitTests.UnitTest1.createConnection = function ClientUI_UnitTests_UnitTest1$createConnection(assert) {
    assert.expect(1);
    var done = assert.async();
    var vm = new ClientUI.ViewModel.ObservableConnection();
    vm.record1id(ClientUI.UnitTests.UnitTest1.accounts[0].toEntityReference());
    vm.record2id(ClientUI.UnitTests.UnitTest1.accounts[1].toEntityReference());
    vm.add_onSaveComplete(function(result) {
        assert.equal(result, 'Error', 'Message = ' + result);
        done();
    });
    vm.SaveCommand();
}


ClientUI.UnitTests.Bootstrap.registerClass('ClientUI.UnitTests.Bootstrap');
ClientUI.UnitTests.UnitTest1.registerClass('ClientUI.UnitTests.UnitTest1');
ClientUI.UnitTests.UnitTest1.accounts = null;
})();

//! This script was generated using Script# v0.7.4.0
