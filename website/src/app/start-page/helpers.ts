
export namespace Helpers {

    // Copies a string to the clipboard. Must be called from within an 
    // event handler such as click. May return false if it failed, but
    // this is not always possible. Browser support for Chrome 43+, 
    // Firefox 42+, Safari 10+, Edge and IE 10+.
    // IE: The clipboard feature may be disabled by an administrator. By
    // default a prompt is shown the first time the clipboard is 
    // used (per session).
    export function copyToClipboard(text) {
        if (window['clipboardData'] && window['clipboardData'].setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return window['clipboardData'].setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");  // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    export function debounce(func, wait, immediate) {
        let timeout, args, context, timestamp, result;
        return function () {
            context = this;
            args = arguments;
            timestamp = new Date();
            let later = function () {
                let last = Date.now() - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = undefined;
                    if (!immediate)
                        result = func.apply(context, args);
                }
            };
            let callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow)
                result = func.apply(context, args);
            return result;
        };
    }

    /**
     * Debounce decorator
     *
     *  class MyClass {
     *    debounceable(10)
     *    myFn() { ... }
     *  }
     */
    export function debounceable(duration, immediate) {
        return function innerDecorator(target, key, descriptor) {
            return {
                configurable: true,
                enumerable: descriptor.enumerable,
                get: function getter() {
                    Object.defineProperty(this, key, {
                        configurable: true,
                        enumerable: descriptor.enumerable,
                        value: debounce(descriptor.value, duration, immediate)
                    });

                    return this[key];
                }
            };
        };
    }


}