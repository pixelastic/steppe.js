'use strict';

describe('Steppe dropdown mode', function() {
  var input;
  var $input;
  var $j = jQuery;
  var $z = Zepto;
  var KEYCODES = {
    UP: 38,
    DOWN: 40,
    A: 65
  };

  function initWithSuggestions(suggestions) {
    var options = {
      find: function(input, callback) {
        callback(suggestions);
      }
    };
    Steppe.init(input, options);
  }

  function sendKey(keyCode, callback) {
    var event = Zepto.Event('keydown');
    event.keyCode = keyCode;
    input.trigger(event);
    _.defer(callback);
  }

  function updateValue(value) {
    input.val(value);
    input.trigger('input');
  }

  beforeEach(function() {
    fixture.load('index.html');
    // We here have both jQuery and Zepto.
    // Zepto is used by Steppe while jQuery is used for testing.
    input = $z(document.getElementById('search'));
    $input = $j(document.getElementById('search'));
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('output', function() {
    it('should add a default one if none is specified', function() {
      // Given

      // When
      Steppe.init(input);

      // Then
      var actual = $j(Steppe._private.options.output);
      expect(actual).to.have.class('steppe-wrapper');
    });

    it('should be hidden on init', function() {
      // Given

      // When
      Steppe.init(input);

      // Then
      var actual = $j(Steppe._private.options.output);
      expect(actual).to.not.be.visible;
    });

    it('should be visible when we have results', function() {
      // Given
      initWithSuggestions(['Anna', 'Barbara', 'Cassandra']);

      // When
      updateValue('foo');

      // Then
      var actual = $j(Steppe._private.options.output);
      expect(actual).to.be.visible;
    });

    it('should be hidden when we have no results', function() {
      // Given
      initWithSuggestions([]);

      // When
      updateValue('foo');

      // Then
      var actual = $j(Steppe._private.options.output);
      expect(actual).to.not.be.visible;
    });

    it('should be hidden we bluring out of the field', function() {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      input.trigger('focusout');

      // Then
      var actual = $j(Steppe._private.options.output);
      expect(actual).to.not.be.visible;
    });

    it('should be visible when focusing', function() {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');
      input.trigger('focusout');

      // When
      input.focus();

      // Then
      var actual = $j(Steppe._private.options.output);
      expect(actual).to.be.visible;
    });

    it('should be hidden when focusing and no results', function() {
      // Given
      initWithSuggestions([]);
      input.blur();

      // When
      input.focus();

      // Then
      var actual = $j(Steppe._private.options.output);
      expect(actual).to.not.be.visible;
    });

    it('should contain custom render output', function() {
      // Given
      var options = {
        find: function(input, callback) {
          callback(['foobar']);
        },
        render: function(suggestion) {
          return '<div class="foobar">' + suggestion + '</div>';
        }
      };
      Steppe.init(input, options);

      // When
      updateValue('foo');

      // Then
      var actual = $j(Steppe._private.options.output);
      expect(actual).to.have.html('<div class="foobar">foobar</div>');
    });
  });

  describe('selection', function() {
    it('should not have any selection on init', function() {
      // Given

      // When
      Steppe.init(input);

      // Then
      expect(Steppe._private.selected).to.equal(null);
      expect(Steppe._private.selectedIndex).to.equal(null);
    });

    it('should select first if suggestions and pressing down', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.DOWN, function() {
        // Then
        expect(Steppe._private.selected).to.equal('a');
        expect(Steppe._private.selectedIndex).to.equal(0);
        done();
      });

    });

    it('should select last if suggestions and pressing up', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.UP, function() {
        // Then
        expect(Steppe._private.selected).to.equal('c');
        expect(Steppe._private.selectedIndex).to.equal(2);
        done();
      });
    });

    it('should select next suggestion when pressing down', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.DOWN, function() {
        sendKey(KEYCODES.DOWN, function() {
          // Then
          expect(Steppe._private.selected).to.equal('b');
          expect(Steppe._private.selectedIndex).to.equal(1);
          done();
        });
      });
    });

    it('should select previous suggestion when pressing up', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.DOWN, function() {
        sendKey(KEYCODES.DOWN, function() {
          sendKey(KEYCODES.UP, function() {
            // Then
            expect(Steppe._private.selected).to.equal('a');
            expect(Steppe._private.selectedIndex).to.equal(0);
            done();
          });
        });
      });
    });

    it('should select first when pressing down on last one', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.UP, function() {
        sendKey(KEYCODES.DOWN, function() {
          // Then
          expect(Steppe._private.selected).to.equal('a');
          expect(Steppe._private.selectedIndex).to.equal(0);
          done();
        });
      });
    });

    it('should select last when pressing up on first one', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.DOWN, function() {
        sendKey(KEYCODES.UP, function() {
          // Then
          expect(Steppe._private.selected).to.equal('c');
          expect(Steppe._private.selectedIndex).to.equal(2);
          done();
        });
      });
    });

    it('should clear the selection when updating the input value', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.DOWN, function() {
        var firstSelected = Steppe._private.selected;
        updateValue('bar');

        // Then
        var actual = Steppe._private.selected;
        expect(actual).to.not.equal(firstSelected);
        expect(actual).to.equal(null);
        done();
      });
    });

    it('should keep the selection the same when updating for same value', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.DOWN, function() {
        var firstSelected = Steppe._private.selected;
        updateValue('a');

        // Then
        var actual = Steppe._private.selected;
        expect(actual).to.equal(firstSelected);
        done();
      });
    });

    it('should change the value of the input when selecting a suggestion', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.DOWN, function() {
        // Then
        expect(input.val()).to.equal('a');
        done();
      });
    });

    it('should add a steppe-suggestion-selected class on the currently selected suggestion', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      sendKey(KEYCODES.DOWN, function() {
        // Then
        var firstElement = $j($input.next().children()[0]);
        expect(firstElement).to.have.class('steppe-suggestion-selected');
        done();
      });
    });
  });

  describe('mousewheel', function() {
    function mouseWheelDown() {
      var event = Zepto.Event('mousewheel');
      event.wheelDelta = -1;
      input.trigger(event);
    }
    function mouseWheelUp() {
      var event = Zepto.Event('mousewheel');
      event.wheelDelta = 1;
      input.trigger(event);
    }

    it('should select first suggestion when rolling down', function() {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      mouseWheelDown();

      // Then
      expect(Steppe._private.selected).to.equal('a');
    });

    it('should select next suggestion when rolling down', function() {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      mouseWheelDown();
      mouseWheelDown();

      // Then
      expect(Steppe._private.selected).to.equal('b');
    });

    it('should select last suggestion when rolling down', function() {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      mouseWheelUp();

      // Then
      expect(Steppe._private.selected).to.equal('c');
    });

    it('should revert to first selection when rolling down and up', function() {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      updateValue('foo');

      // When
      mouseWheelDown();
      mouseWheelDown();
      mouseWheelUp();

      // Then
      expect(Steppe._private.selected).to.equal('a');
    });

    it('should prevent the default behavior of scrolling the page', function() {
      // Given
      initWithSuggestions(['a', 'b', 'c']);
      var event = Zepto.Event('mousewheel');
      event.wheelDelta = -1;
      sinon.stub(event, 'preventDefault');

      // When
      input.trigger(event);

      // Then
      expect(event.preventDefault).to.have.been.called;
    });
  });
});
