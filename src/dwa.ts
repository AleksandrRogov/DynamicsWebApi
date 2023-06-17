class DWA {
	static Prefer = class {
		static ReturnRepresentation: string = "return=representation";
		static Annotations = class {
			static AssociatedNavigationProperty: string = "Microsoft.Dynamics.CRM.associatednavigationproperty";
			static LookupLogicalName: string = "Microsoft.Dynamics.CRM.lookuplogicalname";
			static All: string = "*";
			static FormattedValue: string = "OData.Community.Display.V1.FormattedValue";
			static FetchXmlPagingCookie: string = "Microsoft.Dynamics.CRM.fetchxmlpagingcookie";
		};
		static IncludeAnnotations: string = "odata.include-annotations";
		static get(annotation: string) {
			return `${DWA.Prefer.IncludeAnnotations}="${annotation}"`;
		}
	};
}

export { DWA };
