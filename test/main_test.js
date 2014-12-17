describe('Steppe', function() {
  var testInput;
  beforeEach(function() {
    testInput = $('<input type="text" id="testInput">');
  });

  describe('init', function() {
    it('should bind a custom keypress on focus, and unbind it on blur', function() {
      loadFixtures('test_html_mocks.html')
      //Given
      // sinon.stub(Steppe, '_onFocus', function(event) {
      //   console.log("pouet");
      // });

      // When
      Steppe.init(testInput);
      testInput.trigger('focus');

      // Then
    });
  });
});
