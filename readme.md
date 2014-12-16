# steppe.js

`steppe.js` is a lightweight autocomplete plugin. Bind it to an `input` field
and define an asynchronous search method, and it will display a list of
suggestions.

## Installation

```
bower install steppe.js
```

## Dependencies

Steppe depeneds on `$` (either `jQuery` or `zepto`) and `_` (either `underscore`
or `lodash`).

## Usage

```
var input = $('search');
var options = {
  find: function(input, callback) {
    var suggestions = [];
    // ... Do whatever it takes to find matching suggestions for input ...
    callback(suggestions);
  },
  render: function(suggestion) {
    return '<p>' + suggestion + '</p>';
  }
};
Steppe.bind(input, options);
```

## How does it work ?

Steppe listens to `focus` and `blur` events on the input to enable or disable
itself.

Once enabled, it listens to the `keypress` events, and calls your custom
`finder` method. This method itself is asynchronous and will call its callback
when done with a list of suggestions, which will in turn be displayed. Each
suggestion will go through the `render` method to turn it into an HTML element.

## Inspiration

`steppe.js` is heavily inspired by `typeahead.js` but I needed a lighter
version, without the jQuery dependency.
