var input = $('#search');
var options = {
  find: function(input, callback) {
    var output = input ? ['Funambule', 'Nage', 'Brouette'] : [];
    callback(output);
  }
};
Steppe.init(input, options);
