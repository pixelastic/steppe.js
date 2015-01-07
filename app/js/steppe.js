window.Steppe = (function() {
  var $ = Zepto || jQuery;
  var _private;
  var defaultOptions = {
    find: function(input, callback) {
      callback([input, 'b', 'c', 'd']);
    },
    render: function(suggestion) {
      return '<div class="steppe-suggestion">' + suggestion + '</div>';
    },
    val: function(suggestion) {
      return suggestion.toString();
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
    var currentSelectedIndex = _private.selectedIndex;

    // Handling movement keys
    switch (keycode) {
      case KEYCODES.DOWN:
        if (currentSelectedIndex === null) {
          currentSelectedIndex = 0;
        } else {
          currentSelectedIndex++;
        }
        break;
      case KEYCODES.UP:
        if (currentSelectedIndex === null) {
          currentSelectedIndex = _private.suggestions.length - 1;
        } else {
          currentSelectedIndex--;
        }
        break;
    }

    // Handle going over bounds
    if (currentSelectedIndex < 0) {
      currentSelectedIndex = _private.suggestions.length - 1;
    }
    if (currentSelectedIndex > _private.suggestions.length - 1) {
      currentSelectedIndex = 0;
    }

    selectSuggestion(currentSelectedIndex);
  }

  function selectSuggestion(index) {
    _private.selectedIndex = index;
    _private.selected = _private.suggestions[index];
    _private.input.val(_private.options.val(_private.selected));

    var children = _private.suggestionWrapper.children();
    children.removeClass('steppe-suggestion-selected');
    $(children[index]).addClass('steppe-suggestion-selected');

  }

  function onKeyPress(event) {
    _private.value = $(event.target).val();
    _private.options.find(_private.value, displaySuggestions);
  }

  function onKeyDown(event) {
    // Handle movement keys
    if (!_.contains(_.values(KEYCODES), event.keyCode)) {
      return;
    }

    keyboardSelect(event.keyCode);
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

    // Disable native browser dropdown suggestion list
    _private.input.attr('autocomplete', 'off');

    // Update suggestion and current value
    _private.input.on('keypress', onKeyPress);
    // Handle arrow keys selection
    _private.input.on('keydown', onKeyDown);
    // Hide / show suggestions
    _private.input.on('focusout', onFocusOut);
    _private.input.on('focus', renderWrapper);

    _private.input.after(_private.suggestionWrapper.hide());
  }

  return {
    init: init
  };
})();
