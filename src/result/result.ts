import type {inspectSymbol} from "../util"
import type {Err} from "./err"
import type {Ok} from "./ok"

export interface ResultMethods<T, E> {
	and<U, F>(other: Result<U, F>): Result<U, E | F>
	andThen<U, F>(f: (value: T) => Result<U, F>): Result<U, E | F>
	expect(panic: string): T
	expectErr(panic: string): E
	inspect(f: (value: T) => void): Result<T, E>
	inspectErr(f: (error: E) => void): Result<T, E>
	map<U>(f: (value: T) => U): Result<U, E>
	mapErr<F>(f: (error: E) => F): Result<T, F>
	mapOr<A, B>(defaultValue: A, f: (value: T) => B): A | B
	mapOrElse<A, B>(defaultValue: (error: E) => A, f: (value: T) => B): A | B
	or<U, F>(other: Result<U, F>): Result<T | U, E | F>
	orElse<U, F>(f: (error: E) => Result<U, F>): Result<T | U, E | F>
	unwrap(): T
	unwrapErr(): E
	unwrapOr<U>(defaultValue: U): T | U
	unwrapOrElse<U>(defaultValue: (error: E) => U): T | U
	match<A, B>(ok: (value: T) => A, err: (error: E) => B): A | B

	toString(): `Ok(${string})` | `Err(${string})`
	[inspectSymbol](): ReturnType<ResultMethods<T, E>["toString"]>
	toObject(): {ok: true; value: T} | {ok: false; value: E}
	toJSON(): {meta: "Ok"; value: T} | {meta: "Err"; value: E}
}

export type Result<T, E> = (Ok<T> | Err<E>) & ResultMethods<T, E>