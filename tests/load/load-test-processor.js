module.exports = {
  randomString: randomString,
  logResponse: logResponse,
}

function randomString() {
  return Math.random().toString(36).substring(2, 15)
}

function logResponse(requestParams, response, context, ee, next) {
  if (response.statusCode >= 400) {
    console.log(`Error ${response.statusCode}: ${requestParams.url}`)
  }
  return next()
}
