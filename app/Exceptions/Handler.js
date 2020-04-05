'use strict'

const Sentry = require('@sentry/node')
// const Config = use('Config')

const Env = use('Env')
const Youch = use('Youch')
const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response }) {
    if (error.name === 'ValidationException') {
      return response.status(error.status).send(error.messages)
    }

    if (Env.get('NODE_ENV') === 'development') {
      const youth = new Youch(error, request.request)
      const errorJSON = await youth.toJSON()
      return response.status(error.status).send(errorJSON)
    }

    return response.status(error.status)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {
    Sentry.init({
      dsn: 'https://bff17935d328488290985dbb3e6968cb@sentry.io/5189591'
    })
    Sentry.captureException(error)
  }
}

module.exports = ExceptionHandler
