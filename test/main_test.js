'use strict';

describe('Steppe', function() {
  beforeEach(function() {
    fixture.load('index.html');
  });

  afterEach(function() {
    fixture.cleanup();
  });

  it('plays with the html fixture', function() {
    console.log(fixture.el);
    // expect(fixture.el.firstChild).to.equal(this.result[0][0]);
  });

  // Au focus, on ajoute un listener sur keypress
  // Au blur, on l'enleve
  // Au keypress, la méthode custom find est appellée
  // Au keypress, la méthode render est appellé autant de fois que le nombre de
  // retours de find, avec ces arguments
  // A l'init, un customWrapper est ajouté, mais il est masqué
  // Si focus et des résultats, il est affiché
  // Si blur et des résultats, il est masqué
  // Si focus et pas de résultats, il est masqué
  // Si custom render le contenu du wrapper le contient
  // Par défaut, pas de selection
  // Si keydown, selection est le premier
  // Si keyup, selection remonte
  // Si keydown en bas, selection du premier
  // Si keyup en haut, selection du dernier
  // Quand change selection, change affichage dans input
  // Classe spéciale CSS sur élément selectionné
  // Si enter, default submit

});
