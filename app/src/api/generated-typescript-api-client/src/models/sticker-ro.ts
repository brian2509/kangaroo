/* tslint:disable */
/* eslint-disable */
/**
 * Giraffe Server
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
 * @interface StickerRo
 */
export interface StickerRo {
    /**
     * 
     * @type {string}
     * @memberof StickerRo
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof StickerRo
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof StickerRo
     */
    fileUrl: string;
    /**
     * 
     * @type {string}
     * @memberof StickerRo
     */
    whatsAppStickerImageFileUrl: string;
    /**
     * 
     * @type {string}
     * @memberof StickerRo
     */
    whatsAppIconImageFileUrl: string;
    /**
     * 
     * @type {string}
     * @memberof StickerRo
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof StickerRo
     */
    updatedAt: string;
}


