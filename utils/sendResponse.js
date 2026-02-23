export function sendResponse(res, statsuCode, contentType, payload) {
    res.statusCode = statsuCode
    res.setHeader('Content-Type', contentType)
    res.end(payload)
}