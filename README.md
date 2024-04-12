
# `no-exception`

A library that support developers in writing exception-free TypeScript
applications, with type-safe handling of expected failure conditions and
a _crash early, crash hard_ approach to handling unexpected ones.

## Rationale

The use of `Error`-based exceptions as a strategy for dealing with failure
conditions in the form of `throw` statements and `try/catch` blocks has a
few issues:

1. It's very slow
2. It completely bypasses TypeScript's compile-time type checking
3. It is a source of non-determinism and brittleness
4. It conflates expected and unexpected failure conditions

Modern languages, such as Rust, have addressed these concerns through their
native support of monadic types such as [`Option`][3] and [`Result`][4].
However, it is the author's opinion that userland JavaScript / TypeScript
implementations of these structures are not a good solution due to their
implications on code structure, performance and inspectability. 

A better solution for handling expected failure conditions is to represent
them as first-class values independent of the `Error` class and provide the
necessary helper functions to instantiate them and and tell them apart from
other values, implementing error handling through standard control flow.

As for unexpected failure conditions arising in the form of _uncaught errors_,
_uncaught exceptions_ and _unhandled rejections_, this library adopts a
_crash early, crash hard_ approach as the only way to guarantee consistent 
application state, trading a higher initial burden for much greater reliability
in the long-term.

An excellent piece of writing on this topic and a primary source of inspiration
for this library can be found in [Austral's approach to error handling][2].

## API

### _Crash early, crash hard_ handlers

`no-exception` automatically registers event handlers for known events
indicating unexpected failure conditions. The goal of these handlers is
to surface the offending errors and to force a restart / reload of the
entire application to ensure a consistent internal state; this is achieved
by either crashing the process (for server-side runtimes) or rendering the
error into an overlay that visually takes over the page (for browsers).

The `format` object is a dictionary of serializers that allows developers
to customize the message that is presented when crashing the application.

```typescript
import { format } from 'no-exception';

format.head = (err: any): string => 'main error summary';
format.text = (err: any): string => 'detailed error message';
```

### `mkFail()`, `isFail()` and the `Fail` interface

A `Fail` represents an expected failure condition that the application is able
to handle gracefully and completely recover from.

```typescript
import { Fail, mkFail, isFail } from 'no-exception';

const division = (num: number, div: number): number | Fail => {
  if (div === 0) {
    return mkFail('division by zero');
  }
  return num / div;
};

let res = division(7, 0);

if (isFail(res)) {
  res.message;    // The TypeScript compiler infers "string"
} else {
  res.message;    // The TypeScript compiler reports an error
}
```

The `Fail` interface and `mkFail()` function can be customized / extended via
additional `data` property / argument:

```typescript
import { mkFail, isFail, Fail } from 'no-exception';

type FailWithCode = Fail<{ code: number }>;

const foo = (): number | FailWithCode => {
  return Math.random() > 0.5 ? 42 : mkFail('message', { code: 17 }); 
};

const res = foo();

if (isFail(res)) {
  res.data.code;  // The TypeScript compiler infers "number"
}
```

## License

MIT

[1]: https://doc.rust-lang.org/std/result/
[2]: https://austral-lang.org/spec/spec.html#rationale-errors

[3]: https://doc.rust-lang.org/std/option/
[4]: https://doc.rust-lang.org/std/result/

[5]: https://nodejs.org/api/process.html#event-uncaughtexception
[6]: https://nodejs.org/api/process.html#event-unhandledrejection
[7]: https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event