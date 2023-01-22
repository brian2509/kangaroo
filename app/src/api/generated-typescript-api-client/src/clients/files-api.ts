/* tslint:disable */
/* eslint-disable */
/**
 * Kangaroo Server
 * In order to interact with the API from this documentation alone follow the following steps: 1. Register at the register route. 2. Login using the credentials at the login route. 3. Get the `access_token` from the response and enter it in the Authorization formk. 
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
/**
 * FilesApi - axios parameter creator
 * @export
 */
export const FilesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Get a particular file, generally not used stand-alone but with through given URL.
         * @param {string} fileName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFile: async (fileName: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'fileName' is not null or undefined
            assertParamExists('getFile', 'fileName', fileName)
            const localVarPath = `/api/files/{fileName}`
                .replace(`{${"fileName"}}`, encodeURIComponent(String(fileName)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * FilesApi - functional programming interface
 * @export
 */
export const FilesApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = FilesApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Get a particular file, generally not used stand-alone but with through given URL.
         * @param {string} fileName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getFile(fileName: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getFile(fileName, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * FilesApi - factory interface
 * @export
 */
export const FilesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = FilesApiFp(configuration)
    return {
        /**
         * 
         * @summary Get a particular file, generally not used stand-alone but with through given URL.
         * @param {string} fileName 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getFile(fileName: string, options?: any): AxiosPromise<void> {
            return localVarFp.getFile(fileName, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * FilesApi - object-oriented interface
 * @export
 * @class FilesApi
 * @extends {BaseAPI}
 */
export class FilesApi extends BaseAPI {
    /**
     * 
     * @summary Get a particular file, generally not used stand-alone but with through given URL.
     * @param {string} fileName 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FilesApi
     */
    public getFile(fileName: string, options?: AxiosRequestConfig) {
        return FilesApiFp(this.configuration).getFile(fileName, options).then((request) => request(this.axios, this.basePath));
    }
}
