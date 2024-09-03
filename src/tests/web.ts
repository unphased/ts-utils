import { test } from "tst";
import { JSDOM } from 'jsdom';
import { htmlify } from "../web/htmlify.js";

// Set up the JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const Event = dom.window.Event;

export const htmlify_simple = test('htmlify', ({ l, a: { eq, eqO } }) => {

  const simpleObj = htmlify({
    key1: 'value1',
    key2: 'value2'
  });

  eq(simpleObj.children.length, 2);
  eq(simpleObj.children[0].className, 'key1');
  eq(simpleObj.children[0].textContent, 'value1');
  eq(simpleObj.children[1].className, 'key2');
  eq(simpleObj.children[1].textContent, 'value2');
  eqO(simpleObj.outerHTML, '<div class="object"><div data-value="value1" class="key1">value1</div><div data-value="value2" class="key2">value2</div></div>');

  const nestedObj = htmlify({
    outer: { inner: 'value' }
  });

  l('nestedObj', nestedObj.outerHTML);
  eq(nestedObj.children.length, 1);
  eq(nestedObj.children[0].className, 'outer');
  eq(nestedObj.children[0].children[0].children[0].className, 'inner');
  eq(nestedObj.children[0].children[0].children[0].textContent, 'value');

  eq(htmlify([{a: 'aaa', b: 'bbb'}, {c: 'ccc'}]).outerHTML, '<div class="array"><div data-arridx="0"><div class="object"><div data-value="aaa" class="a">aaa</div><div data-value="bbb" class="b">bbb</div></div></div><div data-arridx="1"><div class="object"><div data-value="ccc" class="c">ccc</div></div></div></div>');
  l(htmlify({arr: [{a: 'aaa', b: 'bbb'}, {c: 'ccc'}]}, { input_binding: {
    pathTo: '.azr', // a non matching pathTo should get silently dropped
    type: 'text',
  }}).outerHTML);

  const x: {value: any} = { value: 'b' };
  const boundInput = htmlify({1: {2: {3: {4: 'a'}}}}, {
    input_binding: {
      pathTo: '.1.2.3.4',
      ref: x,
      prop: 'value',
      type: 'text'
    }
  });
  const input = boundInput.querySelector('input');
  eq(input.value, 'b');
  input.value = 'new value';
  input.dispatchEvent(new Event('change'));
  eq(x.value, 'new value');

  x.value = true;
  const boundInput2 = htmlify({1: {2: {3: {4: 'a'}}}}, {
    input_binding: {
      pathTo: '.1.2',
      ref: x,
      prop: 'value',
      type: 'checkbox'
    }
  });
  l('bI2', boundInput2.outerHTML);
  const input2 = boundInput2.querySelector('input');
  eq(input2.checked, true);
  input2.checked = false;
  input2.dispatchEvent(new Event('change'));
  eq(x.value, false);

});


