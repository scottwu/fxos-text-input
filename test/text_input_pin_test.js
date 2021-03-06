/*global assert,suite,setup,teardown,sinon,test*/
/*jshint maxlen:false*/

suite('fxos-text-input-pin', function() {
  'use strict';
  var dom;

  setup(function() {
    this.sinon = sinon.sandbox.create();
    dom = document.createElement('div');
    document.body.appendChild(dom);
  });

  teardown(function() {
    this.sinon.restore();
    dom.remove();
  });

  suite('length and maxlength', function() {
    test('it sets the length on create', function() {
      var el = create('length="5"');
      assert.equal(el.length, '5');
    });

    test('it sets the maxlength on create', function() {
      var el = create('maxlength="5"');
      assert.equal(el.maxlength, '5');
    });

    test('it adds as many cells as length', function() {
      var el = create('length="4"');
      assert(el.els.cells.length === 4);
    });

    test('it adds a new cell with value > length', function() {
      var el = create('length="4"');
      sendDigits(el, 5);
      assert(el.els.cells.length === 5);
    });

    test('it does not add new cells when > maxlength', function() {
      var el = create('length="4" maxlength="5"');
      sendDigits(el, 6);
      console.log(el.els.cells.length);
      assert(el.els.cells.length === 5);
    });

    test('it removes cells when < maxlength', function() {
      var el = create('length="4" maxlength="8"');
      sendDigits(el, 8);
      assert(el.els.cells.length === 8);
      backSpaces(el, 1);
      assert(el.els.cells.length === 7);
    });

    test('it does not remove cells when < length', function() {
      var el = create('length="4" maxlength="8"');
      sendDigits(el, 8);
      assert(el.els.cells.length === 8);
      backSpaces(el, 6);
      assert(el.els.cells.length === 4);
    });
  });

  suite('clear', function() {
    test('leaves as many cells as length', function() {
      var el = create('length="4" maxlength="8"');
      sendDigits(el, 5);
      el.clear();
      assert(el.value === '');
      assert(el.els.cells.length === 4);
    });
  });

  /**
   * Utils
   */

  function sendDigits(el, number) {
    for (var i = 0; i < number; i++) {
      el.value += '1';
      el.dispatchEvent(new CustomEvent('keyup'));
    }
  }

  function backSpaces(el, number) {
    for (var i = 0; i < number; i++) {
      el.value = el.value.slice(0, -1);
      el.dispatchEvent(new CustomEvent('keyup'));
    }
  }

  function create(attrs) {
    var div = document.createElement('div');
    div.innerHTML = `<fxos-text-input-pin ${attrs}></fxos-text-input>`;
    var result = div.firstElementChild;
    dom.appendChild(result);
    return result;
  }

});
