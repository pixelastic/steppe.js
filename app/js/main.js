var Steppe = (function() {
  var input;
  var options = {};
  var defaultOptions = {
    find: function(input, callback) {
      callback([input]);
    },
    render: function(suggestion) {
      return '<div class="steppe-suggestion">' + suggestion + '</div>';
    }
  };
  var suggestionWrapper = $('<div class="steppe-wrapper"></div>');

  function displaySuggestions(suggestions) {
    var content = _.map(suggestions, options.render).join('');
    suggestionWrapper.html(content);
  }

  function addSuggestionWrapper() {
    input.after(suggestionWrapper);
  }

  function onFocus(event) {
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

  return {
    init: function(initInput, initOptions) {
      input = $(initInput);
      options = _.defaults({}, initOptions, defaultOptions);
      console.log(options);
      console.log(input);

      input.on('focus', onFocus);
      input.on('blur', onBlur);

      addSuggestionWrapper();
    }
  };
})();

var input = $('#search');
var options = {};
Steppe.init(input, options);
