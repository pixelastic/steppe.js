'use strict';

describe('Steppe fulltext mode', function() {
  var input;
  var $input;
  var output;
  var $j = jQuery;
  var $z = Zepto;

  function updateValue(value) {
    input.val(value);
    input.trigger('input');
  }

  beforeEach(function() {
    fixture.load('index-fulltext.html');
    // We here have both jQuery and Zepto.
    // Zepto is used by Steppe while jQuery is used for testing.
    input = $z(document.getElementById('search'));
    $input = $j(document.getElementById('search'));

    output = $z('#search-results');
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('init', function() {
    it('should allow selecting a mode of fulltext', function() {
      // Given

      // When
      Steppe.init(input, {
        mode: 'fulltext',
        output: output
      });

      // Then
      expect(Steppe._private.options.mode).to.equal('fulltext');
    });
    it('should throw an error if no output specified', function() {
      // Given

      // When
      var actual = function() {
        Steppe.init(input, {
          mode: 'fulltext',
          output: null
        });
      };

      // Then
      expect(actual).to.throw(TypeError);

    });
    it('should throw an error if output does not exist', function() {
      // Given

      // When
      var actual = function() {
        Steppe.init(input, {
          mode: 'fulltext',
          output: $('#foo-bar-undefined')
        });
      };

      // Then
      expect(actual).to.throw(TypeError);

    });
  });

  describe('output', function() {
    it('should contain custom render of search results', function() {
      // Given
      var options = {
        mode: 'fulltext',
        output: output,
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
});
