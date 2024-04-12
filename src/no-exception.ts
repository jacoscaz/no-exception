
// ============================================================================
//                             ENVIRONMENT STUFF
// ============================================================================

const isNode = typeof process !== 'undefined'
    && process.release.name === 'node';

const isBrowser = new Function('try { return this === window; } catch (e) { return false; }')();

const toString = Object.prototype.toString;

const isObject = (item: any): item is Object => {
  return toString.call(item) === '[object Object]';
};

export const isError = (item: any): item is Error => {
  return toString.call(item) === '[object Error]';
};

// ============================================================================
//                                    FAIL
// ============================================================================

const __fail__ = Symbol('fail');

const empty = Object.freeze(Object.create(null));

export interface Fail<D = {}> {
  [__fail__]: true;
  message: string;
  data: D;
}

export const mkFail = <D = {}>(message: string, data: D = empty): Fail<D> => {
  return { [__fail__]: true, message, data };
};

export const isFail = (val: any): val is Fail<any> => {
  return isObject(val) && __fail__ in val;
};

// ============================================================================
//                             UNCAUGHT HANDLERS
// ============================================================================

export const format = {
  head: (err: any) => `[https://npm.im/no-exception] - Unhandled error`,
  text: (err: any) => isError(err) ? (err.stack ?? err.message) : ((err && err.toString) ?? toString).call(err),
};

if (isNode) {
  const nodeHandler = (err: any) => {
    console.error(`${format.head(err)}: ${format.text(err)}}`);
    process.exit(1);
  };
  process.once('uncaughtException', nodeHandler);
  process.once('unhandledRejection', nodeHandler);
} 
  
if (isBrowser) {
  const browserHandler = (err: any) => {
    window.removeEventListener('error', browserEventHandler);
    window.removeEventListener('unhandledrejection', browserHandler);
    const el = document.createElement('pre');
    el.style.display = 'block';
    el.style.padding = '15px';
    el.style.zIndex = '999';
    el.style.position = 'fixed';
    el.style.top = '15px';
    el.style.bottom = '15px';
    el.style.left = '15px';
    el.style.right = '15px';
    el.style.backgroundColor = 'red';
    el.appendChild(document.createTextNode(`${format.head(err)}\n\n${format.text(err)}`));
    document.body.appendChild(el);
  };
  const browserEventHandler = (evt: ErrorEvent) => {
    browserHandler(evt.error);
  };
  window.addEventListener('error', browserEventHandler);
  window.addEventListener('unhandledrejection', browserHandler);
}
