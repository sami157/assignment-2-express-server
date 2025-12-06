import { Response } from "express";
const sendResponse = (res: Response,code: any, success: Boolean, message: String, errors: String, data = []) => {
    let response = {}
    success ? response = {
        success: true,
        message,
        data
    } : response = {
        success: false,
        message,
        errors
    }
    return res.status(code).json(response)
}
