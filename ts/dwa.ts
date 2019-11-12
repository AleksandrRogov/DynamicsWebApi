class DWA {
    static Prefer = class {
        /// <field type="String">return=representation</field>
        static ReturnRepresentation: string = "return=representation"
        static Annotations = class {
            /// <field type="String">Microsoft.Dynamics.CRM.associatednavigationproperty</field>
            static AssociatedNavigationProperty: string = 'Microsoft.Dynamics.CRM.associatednavigationproperty'
            /// <field type="String">Microsoft.Dynamics.CRM.lookuplogicalname</field>
            static LookupLogicalName: string = 'Microsoft.Dynamics.CRM.lookuplogicalname'
            /// <field type="String">*</field>
            static All: string = '*'
            /// <field type="String">OData.Community.Display.V1.FormattedValue</field>
            static FormattedValue: string = 'OData.Community.Display.V1.FormattedValue'
            /// <field type="String">Microsoft.Dynamics.CRM.fetchxmlpagingcookie</field>
            static FetchXmlPagingCookie: string = 'Microsoft.Dynamics.CRM.fetchxmlpagingcookie'
        }
    }
}

export { DWA }