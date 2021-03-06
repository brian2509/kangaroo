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


import { StickerRo } from './sticker-ro';
import { UserRo } from './user-ro';

/**
 * 
 * @export
 * @interface StickerPackRo
 */
export interface StickerPackRo {
    /**
     * 
     * @type {string}
     * @memberof StickerPackRo
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof StickerPackRo
     */
    name: string;
    /**
     * 
     * @type {boolean}
     * @memberof StickerPackRo
     */
    personal: boolean;
    /**
     * 
     * @type {Array<StickerRo>}
     * @memberof StickerPackRo
     */
    stickers: Array<StickerRo>;
    /**
     * 
     * @type {Array<UserRo>}
     * @memberof StickerPackRo
     */
    members: Array<UserRo>;
    /**
     * 
     * @type {number}
     * @memberof StickerPackRo
     */
    views: number;
    /**
     * 
     * @type {number}
     * @memberof StickerPackRo
     */
    likes: number;
}


