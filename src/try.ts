import {PromiseResult} from "./promise_result"
import {Ok, type Result, Err} from "./result"
import {ErrorHandler, ResultError, StdError, defaultErrorHandler} from "./result_error"

// Couldn't figure out how to overload these functions without a TypeScript error and making
// the error handler required if the error template param is defined.

export function tryFn<T>(f: () => T): Result<T, StdError> {
	try {
		return Ok(f())
	} catch (error) {
		return Err(defaultErrorHandler(error))
	}
}

export function tryFnWith<T, E extends ResultError>(
	f: () => T,
	handleError: ErrorHandler<E>,
): Result<T, E> {
	try {
		return Ok(f())
	} catch (error) {
		return Err(handleError(error))
	}
}

export function tryPromise<T>(promise: Promise<T>): PromiseResult<T, StdError> {
	return new PromiseResult(
		promise.then(
			(value) => Ok(value),
			(error) => Err(defaultErrorHandler(error)),
		),
	)
}

export function tryPromiseWith<T, E extends ResultError>(
	promise: Promise<T>,
	handleError: ErrorHandler<E>,
): PromiseResult<T, E> {
	return new PromiseResult(
		promise.then(
			(value) => Ok(value),
			(error) => Err(handleError(error)),
		),
	)
}

export function tryAsyncFn<T>(f: () => Promise<T>): PromiseResult<T, StdError> {
	return tryPromise(f())
}

export function tryAsyncFnWith<T, E extends ResultError>(
	f: () => Promise<T>,
	handleError: ErrorHandler<E>,
): PromiseResult<T, E> {
	return tryPromiseWith(f(), handleError)
}
