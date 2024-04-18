
# `no-exception`

Library that implements a _crash early, crash hard_ approach to handling
unexpected failure conditions.

## Usage

Inspired by [Austral's approach to error handling][2], `no-exception`
automatically registers event handlers for known events indicating 
unexpected failure conditions. The goal of these handlers is to surface the
offending errors and to force a restart / reload of the entire application to 
ensure a consistent internal state; this is achieved by either crashing the 
process (for server-side runtimes) or rendering the error into an overlay that
visually takes over the page (for browsers).

```typescript
import 'no-exception';
```

The `format` object is a dictionary of serializers that allows developers
to customize the message that is presented when crashing the application.

```typescript
import { format } from 'no-exception';

format.head = (err: any): string => 'main error summary';
format.text = (err: any): string => 'detailed error message';
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


