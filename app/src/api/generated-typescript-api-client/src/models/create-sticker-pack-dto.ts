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



/**
 * 
 * @export
 * @interface CreateStickerPackDto
 */
export interface CreateStickerPackDto {
    /**
     * 
     * @type {string}
     * @memberof CreateStickerPackDto
     */
    name: string;
    /**
     * 
     * @type {boolean}
     * @memberof CreateStickerPackDto
     */
    personal: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof CreateStickerPackDto
     */
    animated: boolean;
}


