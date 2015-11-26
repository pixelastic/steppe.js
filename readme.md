# steppe.js

__Steppe.js is no longer maintained. If you need an autocomplete solution, have
a look at [Algolia's autocomplete](https://github.com/algolia/autocomplete.js).

`steppe.js` is a lightweight autocomplete plugin. Bind it to an `input` field
and define an asynchronous search method, and it will display a list of
suggestions on every keystroke.

## Installation

```
bower install steppe.js
```

## Dependencies

Steppe depends on `Zepto` and `lodash`.

## Usage

```js
var input = $('#search');
var options = {
  find: function(input, callback) {
    var suggestions = [];
    // ... Do whatever it takes to find matching suggestions for input ...
    callback(suggestions);
  },
  render: function(suggestion) {
    return '<p>' + suggestion + '</p>';
  },
  val: function(suggestion) {
    return suggestion.name;
  }
};
Steppe.bind(input, options);
```

## How does it work ?

Steppe listens to `focus` and `blur` events on the input to enable or disable
itself.

Once enabled, it listens to the `keydown` events, and calls your custom `find`
method with the current value of the input, and a callback. The `find` method
is thus asynchronous. You just have to call the callback with the list of
suggestions to display once you got them. All of this suggestions will in turn
be passed to the `render` method, and the final output will be rendered in
a dropdown list below the input.

## Inspiration

`steppe.js` is heavily inspired by `typeahead.js` but I needed a lighter
version, without the jQuery dependency.
