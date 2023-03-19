export interface DynamicsWebApiError extends Error {
	status: number;
}

function throwParameterError(functionName: string, parameterName: string, type: string | null | undefined): void {
	throw new Error(
		type ? `${functionName} requires a ${parameterName} parameter to be of type ${type}.` : `${functionName} requires a ${parameterName} parameter.`
	);
}

export class ErrorHelper {
	static handleErrorResponse(req): void {
		throw new Error(`Error: ${req.status}: ${req.message}`);
	}

	static parameterCheck(parameter, functionName: string, parameterName: string, type?: string): void {
		if (typeof parameter === "undefined" || parameter === null || parameter === "") {
			throwParameterError(functionName, parameterName, type);
		}
	}

	static stringParameterCheck(parameter, functionName: string, parameterName: string): void {
		if (typeof parameter !== "string") {
			throwParameterError(functionName, parameterName, "String");
		}
	}

	static arrayParameterCheck(parameter, functionName: string, parameterName: string): void {
		if (parameter.constructor !== Array) {
			throwParameterError(functionName, parameterName, "Array");
		}
	}

	static stringOrArrayParameterCheck(parameter, functionName: string, parameterName: string): void {
		if (parameter.constructor !== Array && typeof parameter !== "string") {
			throwParameterError(functionName, parameterName, "String or Array");
		}
	}

	static numberParameterCheck(parameter, functionName: string, parameterName: string): void {
		if (typeof parameter != "number") {
			if (typeof parameter === "string" && parameter) {
				if (!isNaN(parseInt(parameter))) {
					return;
				}
			}
			throwParameterError(functionName, parameterName, "Number");
		}
	}

	static batchIsEmpty(): Error[] {
		return [
			new Error(
				"Payload of the batch operation is empty. Please make that you have other operations in between startBatch() and executeBatch() to successfuly build a batch payload."
			),
		];
	}

	static handleHttpError(parsedError: any, parameters?: any): DynamicsWebApiError {
		const error = new Error();

		Object.keys(parsedError).forEach((k) => {
			error[k] = parsedError[k];
		});

		if (parameters) {
			Object.keys(parameters).forEach((k) => {
				error[k] = parameters[k];
			});
		}

		return <DynamicsWebApiError>error;
	}

	static boolParameterCheck(parameter, functionName: string, parameterName: string): void {
		if (typeof parameter != "boolean") {
			throwParameterError(functionName, parameterName, "Boolean");
		}
	}

	/**
	 * Private function used to check whether required parameter is a valid GUID
	 * @param parameter The GUID parameter to check
	 * @param functionName
	 * @param parameterName
	 * @returns
	 */
	static guidParameterCheck(parameter, functionName: string, parameterName: string): string | undefined {
		try {
			const match = /[0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12}/i.exec(parameter)![0];
			return match;
		} catch (error) {
			throwParameterError(functionName, parameterName, "GUID String");
		}
	}

	static keyParameterCheck(parameter, functionName: string, parameterName: string): string | undefined {
		try {
			ErrorHelper.stringParameterCheck(parameter, functionName, parameterName);

			//check if the param is a guid
			const match = /^{?([0-9A-F]{8}[-]?([0-9A-F]{4}[-]?){3}[0-9A-F]{12})}?$/i.exec(parameter);
			if (match) {
				return match[1];
			}

			//check the alternate key
			const alternateKeys = parameter.split(",");

			if (alternateKeys.length) {
				for (let i = 0; i < alternateKeys.length; i++) {
					alternateKeys[i] = alternateKeys[i].trim().replace(/"/g, "'");
					/^[\w\d\_]+\=(.+)$/i.exec(alternateKeys[i])![0];
				}
			}

			return alternateKeys.join(",");
		} catch (error) {
			throwParameterError(functionName, parameterName, "String representing GUID or Alternate Key");
		}
	}

	static callbackParameterCheck(callbackParameter, functionName: string, parameterName: string): void {
		if (typeof callbackParameter != "function") {
			throwParameterError(functionName, parameterName, "Function");
		}
	}

	static throwBatchIncompatible(functionName: string, isBatch: boolean): void {
		if (isBatch) {
			isBatch = false;
			throw new Error(functionName + " cannot be used in a BATCH request.");
		}
	}

	static throwBatchNotStarted(isBatch: boolean): void {
		if (!isBatch) {
			throw new Error(
				"Batch operation has not been started. Please call a DynamicsWebApi.startBatch() function prior to calling DynamicsWebApi.executeBatch() to perform a batch request correctly."
			);
		}
	}
}
