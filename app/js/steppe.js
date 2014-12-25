window.Steppe = (function() {
  var $ = Zepto || jQuery;
  var _private;
  var defaultOptions = {
    find: function(input, callback) {
      callback([input]);
    },
    render: function(suggestion) {
      return '<div class="steppe-suggestion">' + suggestion + '</div>';
    }
  };
  var KEYCODES = {
    UP: 38,
    DOWN: 40
  };

  function renderWrapper() {
    if (_private.suggestions.length > 0) {
      _private.suggestionWrapper.show();
    } else {
      _private.suggestionWrapper.hide();
    }
  }

  function displaySuggestions(userSuggestions) {
    _private.suggestions = userSuggestions;

    var content = _.map(userSuggestions, _private.options.render).join('');
    _private.suggestionWrapper.html(content);
    renderWrapper();
  }

  function keyboardSelect(keycode) {
    // Break if not a special key
    if (!_.contains(_.values(KEYCODES), keycode)) {
      return;
    }

    // Handling movement keys
    switch (keycode) {
      case KEYCODES.DOWN:
        if (_private.selectedIndex === null) {
          _private.selectedIndex = 0;
        } else {
          _private.selectedIndex++;
        }
        break;
      case KEYCODES.UP:
        if (_private.selectedIndex === null) {
          _private.selectedIndex = _private.suggestions.length - 1;
        } else {
          _private.selectedIndex--;
        }
        break;
    }

    // Handle going over bounds
    if (_private.selectedIndex < 0) {
      _private.selectedIndex = _private.suggestions.length - 1;
    }
    if (_private.selectedIndex > _private.suggestions.length - 1) {
      _private.selectedIndex = 0;
    }

    _private.selected = _private.suggestions[_private.selectedIndex];
  }

  function onKeyDown(event) {
    keyboardSelect(event.keycode);

    _private.value = $(event.target).val();

    _private.options.find(_private.value, displaySuggestions);
  }

  function onFocusOut() {
    _private.suggestionWrapper.hide();
  }

  function init(initInput, initOptions) {
    _private = {
      input: $(initInput),
      value: null,
      suggestions: [],
      selected: null,
      selectedIndex: null,
      options: _.defaults({}, initOptions, defaultOptions),
      suggestionWrapper: $('<div class="steppe-wrapper"></div>')
    };
    this._private = _private;

    _private.input.on('keydown', onKeyDown);
    _private.input.on('focusout', onFocusOut);
    _private.input.on('focus', renderWrapper);

    _private.input.after(_private.suggestionWrapper.hide());
  }

  return {
    init: init
  };
})();
