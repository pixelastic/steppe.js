window.Steppe = (function() {
  var input;
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

  function displaySuggestions(suggestions) {
    var content = _.map(suggestions, options.render).join('');
    suggestionWrapper.html(content);
  }

  function addSuggestionWrapper() {
    input.after(suggestionWrapper);
  }

  function onFocus(event) {
    console.log('onFocus');
    var target = $(event.target);
    target.on('keyup', onKeyUp);
  }

  function onBlur(event) {
    var target = $(event.target);
    target.off('keyup', onKeyUp);
  }

  function onKeyUp(event) {
    var target = $(event.target);
    var value = target.val();
    options.find(value, displaySuggestions);
  }

  function init(initInput, initOptions) {
    input = $(initInput);
    options = _.defaults({}, initOptions, defaultOptions);

    input.on('focus', onFocus);
    input.on('blur', onBlur);
    console.log($('#search'));

    addSuggestionWrapper();
  }

  return {
    init: init,
    _onFocus: onFocus,
    _onBlur: onBlur,
    _onKeyUp: onKeyUp,
    _addSuggestionWrapper: addSuggestionWrapper,
    _displaySuggestions: displaySuggestions
  };
})();
