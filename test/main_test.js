'use strict';

/**
 * steppe.js use a trick involving setTimeout to not wait for the `keyup`
 * event. It does make the tests a little trickier as they became asynchronous.
 * That's why some expectations need to be wrapped in `_.defer()` calls and
 * fire `done()` when done.
 *
 * Note: Caret handling is not covered by tests. Caret should always be set at
 * the end of input when selecting a suggestion.
 **/

describe('Steppe main', function() {
  var input;
  var $input;
  var $j = jQuery;
  var $z = Zepto;

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

  describe('init', function() {
    it('should select dropdown mode as a default', function() {
      // Given

      // When
      Steppe.init(input);

      // Then
      expect(Steppe._private.options.mode).to.equal('dropdown');
    });
  });

  describe('find', function() {
    it('should call custom find method when value changes', function() {
      // Given
      var options = {
        find: sinon.stub()
      };
      Steppe.init(input, options);

      // When
      updateValue('foo');

      // Then
      expect(options.find).to.have.been.called;
      expect(options.find).to.have.been.calledWith('foo');
    });



    // Si plusieurs find sont fire (un par keystroke), et que les callbacks
    // sont fire dans le désordre, il faut empecher un des premiers callbacks,
    // en retard, de modifier els résultats d'un des derniers
    // En gros, on n'accepte un callback que si son fire est plus récent que le
    // fire du précédent callback


  });

  describe('render', function() {
    it('should call custom render with each results of find', function() {
      // Given
      var options = {
        find: function(input, callback) {
          callback(['Anna', 'Barbara', 'Cassandra']);
        },
        render: sinon.stub()
      };
      Steppe.init(input, options);

      // When
      updateValue('foo');

      // Then
      expect(options.render).to.have.been.called;
      expect(options.render).to.have.been.calledThrice;
      expect(options.render).to.have.been.calledWith('Anna');
      expect(options.render).to.have.been.calledWith('Barbara');
      expect(options.render).to.have.been.calledWith('Cassandra');
    });

    it('should not render empty results', function() {
      // Given
      var options = {
        find: function(input, callback) {
          callback([]);
        },
        render: sinon.stub()
      };
      Steppe.init(input, options);

      // When
      updateValue('foo');

      // Then
      expect(options.render).to.not.have.been.called;
    });
  });

  it('should not render if a newer result has already been rendered', function() {
    // Given
    var trappedCallbacks = {};
    var options = {
      find: function(keyword, callback) {
        // We simply trap callbacks to call them later
        trappedCallbacks[keyword] = function() {
          callback(keyword);
        };
      },
      render: sinon.stub()
    };
    Steppe.init(input, options);

    // Calling values in order
    updateValue('a');
    updateValue('b');
    updateValue('c');

    // When
    trappedCallbacks.b();
    trappedCallbacks.c();
    trappedCallbacks.a();

    // Then
    expect(options.render).to.have.been.calledWith('b');
    expect(options.render).to.have.been.calledWith('c');
    expect(options.render).to.not.have.been.calledWith('a');

  });
});
