import {InvalidErrorPanic, Panic, UnwrapPanic} from "./panic"

export type Methods<TValue, TError extends Error> = {
	expect(panicOrMessage: Panic | string): TValue
	unwrap(): TValue
	unwrapOr<T>(defaultValue: T): T | TValue
	unwrapOrElse<T>(defaultValue: (error: TError) => T): T | TValue
	unwrapErr(): TError
	match<V, E>(args: {ok: (value: TValue) => V; err: (error: TError) => E}): V | E
}

export class Ok<TValue> implements Methods<TValue, never> {
	public readonly ok = true
	public readonly value: TValue
	public readonly error?: never

	public constructor(value: TValue) {
		this.value = value
	}

	public expect() {
		return this.value
	}

	public unwrap() {
		return this.value
	}

	public unwrapOr() {
		return this.value
	}

	public unwrapOrElse() {
		return this.value
	}

	public unwrapErr(): never {
		throw new UnwrapPanic(new Error("Cannot unwrapErr on an Ok"))
	}

	public match<V, E>({ok}: {ok: (value: TValue) => V; err: (error: never) => E}): V | E {
		return ok(this.value)
	}
}

export class Err<TError extends Error> implements Methods<never, TError> {
	public readonly ok = false
	public readonly value?: never
	public readonly error: TError

	public constructor(error: TError) {
		this.error = error
	}

	public expect(panicOrMessage: Panic | string): never {
		if (panicOrMessage instanceof Panic) {
			throw panicOrMessage
		}
		throw new Panic(panicOrMessage)
	}

	public unwrap(): never {
		throw new UnwrapPanic(this.error)
	}

	public unwrapErr() {
		return this.error
	}

	public unwrapOr<T>(defaultValue: T) {
		return defaultValue
	}

	public unwrapOrElse<T>(defaultValue: (error: TError) => T) {
		return defaultValue(this.error)
	}

	public match<V, E>({err}: {ok: (value: never) => V; err: (error: TError) => E}) {
		return err(this.error)
	}
}

/** Represents the result of an operation that can either succeed with a value or fail */
export type Result<V, E extends Error = Error> = Ok<V> | Err<E>

export function ok(): Ok<undefined>
export function ok<T>(value: T): Ok<T>
export function ok<T>(value?: T) {
	return new Ok(value)
}

export function err<T extends Error>(error: T): Err<T>
export function err(message: string): Err<Error>
export function err(error: unknown) {
	if (error instanceof Panic) {
		throw new Panic("Cannot create an Err from a Panic")
	}
	if (error instanceof Error) {
		return new Err(error)
	}
	if (typeof error === "string") {
		return new Err(new Error(error))
	}
	return new Err(new Error("Unknown Error"))
}

export function handleError(error: unknown) {
	if (error instanceof Panic) {
		throw error
	}
	if (error instanceof Error) {
		return error
	}
	throw new InvalidErrorPanic(error)
}