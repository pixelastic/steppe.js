'use strict';

describe('Steppe', function() {
  var input;

  function expectToHaveCSSClass(element, cssClass) {
    expect(element.attr('class')).to.contain(cssClass);
  }

  beforeEach(function() {
    fixture.load('index.html');
    input = $('#search');
    input.val('foo');
  });

  afterEach(function() {
    fixture.cleanup();
  });

  describe('find', function() {
    it('should call custom find method on each keypress', function() {
      // Given
      var options = {
        find: sinon.stub()
      };
      Steppe.init(input, options);

      // When
      input.trigger('keydown');

      // Then
      expect(options.find).to.have.been.called;
      expect(options.find).to.have.been.calledWith('foo');
    });
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
      input.trigger('keydown');

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
      input.trigger('keydown');

      // Then
      expect(options.render).to.not.have.been.called;
    });
  });

  describe('suggestionWrapper', function() {
    function initAndPopulate(suggestions) {
      var options = {
        find: function(input, callback) {
          callback(suggestions);
        }
      };
      Steppe.init(input, options);
      input.trigger('keydown');
    }

    it('should be hidden on init', function() {
      // Given

      // When
      Steppe.init(input);

      // Then
      var actual = input.next();
      expect(actual).to.have.class('steppe-wrapper');
      expect(actual).to.not.be.visible;
    });

    it('should be visible when we have results', function() {
      // Given

      // When
      initAndPopulate(['Anna', 'Barbara', 'Cassandra']);

      // Then
      var actual = input.next();
      expect(actual).to.be.visible;

    });

    it('should be hidden when we have no results', function() {
      // Given

      // When
      initAndPopulate([]);

      // Then
      var actual = input.next();
      expect(actual).to.not.be.visible;
    });

    it('should be hidden we bluring out of the field', function() {
      // Given
      initAndPopulate(['a', 'b', 'c']);

      // When
      input.blur();

      // Then
      var actual = input.next();
      expect(actual).to.not.be.visible;
    });

    it('should be visible when focusing', function() {
      // Given
      initAndPopulate(['a', 'b', 'c']);
      input.blur();

      // When
      input.focus();

      // Then
      var actual = input.next();
      expect(actual).to.be.visible;
    });

    it('should be hidden when focusing and no results', function() {
      // Given
      initAndPopulate([]);
      input.blur();

      // When
      input.focus();

      // Then
      var actual = input.next();
      expect(actual).to.not.be.visible;
    });

    it('should contain custom render output', function() {
      // Given
      var options = {
        find: function(input, callback) {
          callback(['foobar']);
        },
        render: function(suggestion) {
          return '<div class="foobar">'+suggestion+'</div>';
        }
      };
      Steppe.init(input, options);

      // When
      input.trigger('keydown');

      // Then
      var actual = input.next();
      expect(actual).to.have.html('<div class="foobar">foobar</div>');
    });
  });

  // Par défaut, pas de selection
  // Si keydown, selection est le premier
  // Si keyup, selection remonte
  // Si keydown en bas, selection du premier
  // Si keyup en haut, selection du dernier
  // Quand change selection, change affichage dans input
  // Classe spéciale CSS sur élément selectionné
  // Si enter, default submit

});
