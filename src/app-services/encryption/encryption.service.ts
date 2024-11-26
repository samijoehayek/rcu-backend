/* eslint-disable @typescript-eslint/no-explicit-any */
import { Service } from "@tsed/di";
import * as crypto from "crypto";
const CryptoJS = require("crypto-js");

@Service()
export class EncryptionService {
    public encryptMD5 = (value: any) => {
        return crypto.createHash("md5").update(value).digest("hex")
    }

    public aesEncrypt = (decryptValue: any, salt: any) => {
        const md5Encryption = this.encryptMD5(salt);
        const key = CryptoJS.enc.Base64.parse(md5Encryption);
        const iv = CryptoJS.enc.Base64.parse(md5Encryption+salt);
        const encrypted = CryptoJS.AES.encrypt(decryptValue, key, {iv: iv});
        return encrypted.toString();
    }

    public aesDecrypt = (encryptedValue: any, salt: any) => {
        const md5Encryption = this.encryptMD5(salt);
        const key = CryptoJS.enc.Base64.parse(md5Encryption);
        const iv = CryptoJS.enc.Base64.parse(md5Encryption+salt);
        const decrypted = CryptoJS.AES.decrypt(encryptedValue, key, {iv: iv});
        return decrypted.toString(CryptoJS.enc.Utf8);
    }


}