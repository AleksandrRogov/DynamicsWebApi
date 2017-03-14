// Type definitions for ./lib/dynamics-web-api.js
// Project: [LIBRARY_URL_HERE] 
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]> 
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 * DynamicsWebApi - a Microsoft Dynamics CRM Web API helper library. Current version uses Promises instead of Callbacks.
 * 
 * @param {DWAConfig} [config] - configuration object
 */
declare interface DynamicsWebApi {
		
	/**
	 * 
	 * @param config? 
	 * @return  
	 */
	new (config? : {} | string): DynamicsWebApi;
}

