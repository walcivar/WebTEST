using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xrm.Sdk;
using System.Runtime.CompilerServices;

namespace ClientUI.Model
{
    /*class Entities
    {
    }*/

    public class Connection : Entity
    {
        public Connection()
            : base("connection")
        { }
        #region fields
        [ScriptName("connectionid")]
        public Guid ConnectionId;
        [ScriptName("record1id")]
        public EntityReference Record1Id;
        [ScriptName("record1roleid")]
        public EntityReference Record1RoleId;
        [ScriptName("record2id")]
        public EntityReference Record2Id;
        [ScriptName("record2roleid")]
        public EntityReference Record2RoleId;
        #endregion
    }
}
