window.Steppe = (function() {
  var $ = Zepto || jQuery;
  var _private = {
    input: null,
    value: null,
    suggestions: [],
    selected: null,
    selectedIndex: -1,
    options: {},
    suggestionWrapper: $('<div class="steppe-wrapper"></div>')
  };
  var defaultOptions = {
    find: function(input, callback) {
      callback([input]);
    },
    render: function(suggestion) {
      return '<div class="steppe-suggestion">' + suggestion + '</div>';
    }
  };
  var KEYCODES = {
    PAGE_UP: 33,
    PAGE_DOWN: 34,
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
    // Break if not a keyboard arrow
    if (!_.contains(_.values(KEYCODES), keycode)) {
      return;
    }
    
    // Handling movement keys
    switch (keycode) {
      case KEYCODES.DOWN:
        _private.selectedIndex++;
        break;
      case KEYCODES.UP:
        _private.selectedIndex--;
        break;
      case KEYCODES.PAGE_UP:
        _private.selectedIndex = 0;
        break;
      case KEYCODES.PAGE_DOWN:
        _private.selectedIndex = _private.suggestions.length;
        break;
    }

    _private.selectedIndex = Math.max(Math.min(_private.selectedIndex, _private.suggestions.length), 0);
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
    _private.input = $(initInput);
    _private.options = _.defaults({}, initOptions, defaultOptions);

    _private.input.on('keydown', onKeyDown);
    _private.input.on('focusout', onFocusOut);
    _private.input.on('focus', renderWrapper);

    _private.input.after(_private.suggestionWrapper.hide());
  }

  return {
    init: init,
    _private: _private
  };
})();
