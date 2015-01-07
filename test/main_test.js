'use strict';

/**
 * steppe.js use a trick involving setTimeout to not wait for the `keyup`
 * event. It does make the tests a little trickier as they became asynchronous.
 * That's why some expectations need to be wrapped in `_.defer()` calls and
 * fire `done()` when done.
 **/

// Replace _private with getter methods
// Or find a way to expose .selected and .selectedIndex updated

describe('Steppe', function() {
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

  beforeEach(function() {
    fixture.load('index.html');
    // We here have both jQuery and Zepto.
    // Zepto is used by Steppe while jQuery is used for testing.
    input = $z(document.getElementById('search'));
    $input = $j(document.getElementById('search'));
    input.val('foo');
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('find', function() {
    it('should call custom find method on each keydown', function(done) {
      // Given
      var options = {
        find: sinon.stub()
      };
      Steppe.init(input, options);

      // When
      sendKey(KEYCODES.A, function() {
        // Then
        expect(options.find).to.have.been.called;
        expect(options.find).to.have.been.calledWith('foo');
        done();
      });
    });
  });

  describe('render', function() {
    it('should call custom render with each results of find', function(done) {
      // Given
      var options = {
        find: function(input, callback) {
          callback(['Anna', 'Barbara', 'Cassandra']);
        },
        render: sinon.stub()
      };
      Steppe.init(input, options);

      // When
      sendKey(KEYCODES.A, function() {
        // Then
        expect(options.render).to.have.been.called;
        expect(options.render).to.have.been.calledThrice;
        expect(options.render).to.have.been.calledWith('Anna');
        expect(options.render).to.have.been.calledWith('Barbara');
        expect(options.render).to.have.been.calledWith('Cassandra');
        done();
      });
    });

    it('should not render empty results', function(done) {
      // Given
      var options = {
        find: function(input, callback) {
          callback([]);
        },
        render: sinon.stub()
      };
      Steppe.init(input, options);

      // When
      sendKey(KEYCODES.A, function() {
        // Then
        expect(options.render).to.not.have.been.called;
        done();
      });
    });
  });

  describe('suggestionWrapper', function() {
    it('should be hidden on init', function() {
      // Given

      // When
      Steppe.init(input);

      // Then
      var actual = $input.next();
      expect(actual).to.have.class('steppe-wrapper');
      expect(actual).to.not.be.visible;
    });

    it('should be visible when we have results', function(done) {
      // Given
      initWithSuggestions(['Anna', 'Barbara', 'Cassandra']);

      // When
      sendKey(KEYCODES.A, function() {
        // Then
        var actual = $input.next();
        expect(actual).to.be.visible;
        done();
      });
    });

    it('should be hidden when we have no results', function(done) {
      // Given
      initWithSuggestions([]);

      // When
      sendKey(KEYCODES.A, function() {
        // Then
        var actual = $input.next();
        expect(actual).to.not.be.visible;
        done();
      });
    });

    it('should be hidden we bluring out of the field', function() {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      input.trigger('focusout');

      // Then
      var actual = $input.next();
      expect(actual).to.not.be.visible;
    });

    it('should be visible when focusing', function() {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      sendKey(KEYCODES.A, function() {
        input.trigger('focusout');
        input.focus();

        // Then
        var actual = $input.next();
        expect(actual).to.be.visible;
      });
    });

    it('should be hidden when focusing and no results', function() {
      // Given
      initWithSuggestions([]);
      input.blur();

      // When
      input.focus();

      // Then
      var actual = $input.next();
      expect(actual).to.not.be.visible;
    });

    it('should contain custom render output', function(done) {
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
      sendKey(KEYCODES.A, function() {
        // Then
        var actual = $input.next();
        expect(actual).to.have.html('<div class="foobar">foobar</div>');
        done();
      });
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

      // When
      sendKey(KEYCODES.A, function() {
        sendKey(KEYCODES.DOWN, function() {
          // Then
          expect(Steppe._private.selected).to.equal('a');
          expect(Steppe._private.selectedIndex).to.equal(0);
          done();
        });
      });

    });

    it('should select last if suggestions and pressing up', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      sendKey(KEYCODES.A, function() {
        sendKey(KEYCODES.UP, function() {
          // Then
          expect(Steppe._private.selected).to.equal('c');
          expect(Steppe._private.selectedIndex).to.equal(2);
          done();
        });
      });
    });

    it('should select next suggestion when pressing down', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      sendKey(KEYCODES.A, function() {
        sendKey(KEYCODES.DOWN, function() {
          sendKey(KEYCODES.DOWN, function() {
            // Then
            expect(Steppe._private.selected).to.equal('b');
            expect(Steppe._private.selectedIndex).to.equal(1);
            done();
          });
        });
      });
    });

    it('should select previous suggestion when pressing up', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      sendKey(KEYCODES.A, function() {
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
    });

    it('should select first when pressing down on last one', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      sendKey(KEYCODES.A, function() {
        sendKey(KEYCODES.UP, function() {
          sendKey(KEYCODES.DOWN, function() {
            // Then
            expect(Steppe._private.selected).to.equal('a');
            expect(Steppe._private.selectedIndex).to.equal(0);
            done();
          });
        });
      });
    });

    it('should select last when pressing up on first one', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      sendKey(KEYCODES.A, function() {
        sendKey(KEYCODES.DOWN, function() {
          sendKey(KEYCODES.UP, function() {
            // Then
            expect(Steppe._private.selected).to.equal('c');
            expect(Steppe._private.selectedIndex).to.equal(2);
            done();
          });
        });
      });
    });

    it('should change the value of the input when selecting a suggestion', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      sendKey(KEYCODES.A, function() {
        sendKey(KEYCODES.DOWN, function() {
          // Then
          expect(input.val()).to.equal('a');
          done();
        });
      });
    });

    it('should add a steppe-suggestion-selected class on the currently selected suggestion', function(done) {
      // Given
      initWithSuggestions(['a', 'b', 'c']);

      // When
      sendKey(KEYCODES.A, function() {
        sendKey(KEYCODES.DOWN, function() {
          // Then
          var firstElement = $j($input.next().children()[0]);
          expect(firstElement).to.have.class('steppe-suggestion-selected');
          done();
        });
      });
    });
  });

  // Si enter, default submit
});
