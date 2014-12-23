window.Steppe = (function() {
  var input;
  var value;
  var suggestions = [];
  var options = {};
  var suggestionWrapper = $('<div class="steppe-wrapper"></div>');
  var defaultOptions = {
    find: function(input, callback) {
      callback([input]);
    },
    render: function(suggestion) {
      return '<div class="steppe-suggestion">' + suggestion + '</div>';
    }
  };

  function renderWrapper() {
    suggestions.length ? suggestionWrapper.show() : suggestionWrapper.hide();
  }

  function displaySuggestions(userSuggestions) {
    suggestions = userSuggestions;

    var content = _.map(userSuggestions, options.render).join('');
    suggestionWrapper.html(content);
    renderWrapper();
  }

  function onKeyDown(event) {
    value = $(event.target).val();

    options.find(value, displaySuggestions);
  }

  function onBlur() {
    suggestionWrapper.hide();
  }

  function init(initInput, initOptions) {
    input = $(initInput);
    options = _.defaults({}, initOptions, defaultOptions);

    input.on('keydown', onKeyDown);
    input.on('blur', onBlur);
    input.on('focus', renderWrapper);

    input.after(suggestionWrapper.hide());
  }

  return {
    init: init
  };
})();
