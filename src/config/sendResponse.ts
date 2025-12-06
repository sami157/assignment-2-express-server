const sendResponse = (success: Boolean, message: String, errors: String, data = []) => {
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
    return response
}
