/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() { return width * height; },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  Object.assign(obj, JSON.parse(json));
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
class CssSelectorBuilder {
  constructor() {
    this.selectors = [{ selectorName: '', selector: '' }];
    this.order = ['', 'element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
  }

  element(value) {
    const self = new CssSelectorBuilder();
    self.selectors = this.selectors.slice();
    const prevSelector = self.selectors.pop();
    if (prevSelector.selectorName === 'element') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (self.order.slice(2).includes(prevSelector.selectorName)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    self.selectors.push({ selectorName: 'element', selector: value });
    return self;
  }

  id(value) {
    const self = new CssSelectorBuilder();
    self.selectors = this.selectors.slice();
    const prevSelector = self.selectors.pop();
    if (prevSelector.selectorName === 'id') {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (self.order.slice(3).includes(prevSelector.selectorName)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    self.selectors.push(prevSelector);
    self.selectors.push({ selectorName: 'id', selector: `#${value}` });
    return self;
  }

  class(value) {
    const self = new CssSelectorBuilder();
    self.selectors = this.selectors.slice();
    const prevSelector = self.selectors.pop();
    if (self.order.slice(4).includes(prevSelector.selectorName)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    self.selectors.push(prevSelector);
    self.selectors.push({ selectorName: 'class', selector: `.${value}` });
    return self;
  }

  attr(value) {
    const self = new CssSelectorBuilder();
    self.selectors = this.selectors.slice();
    const prevSelector = self.selectors.pop();
    if (self.order.slice(5).includes(prevSelector.selectorName)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    self.selectors.push(prevSelector);
    self.selectors.push({ selectorName: 'attr', selector: `[${value}]` });
    return self;
  }

  pseudoClass(value) {
    const self = new CssSelectorBuilder();
    self.selectors = this.selectors.slice();
    const prevSelector = self.selectors.pop();
    if (self.order.slice(6).includes(prevSelector.selectorName)) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    self.selectors.push(prevSelector);
    self.selectors.push({ selectorName: 'pseudoClass', selector: `:${value}` });
    return self;
  }

  pseudoElement(value) {
    const self = new CssSelectorBuilder();
    self.selectors = this.selectors.slice();
    const prevSelector = self.selectors.pop();
    if (prevSelector) {
      if (prevSelector.selectorName === 'pseudoElement') {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      self.selectors.push(prevSelector);
    }
    self.selectors.push({ selectorName: 'pseudoElement', selector: `::${value}` });
    return self;
  }

  combine(selector1, combinator, selector2) {
    const self = new CssSelectorBuilder();
    self.selectors = this.selectors.slice();
    self.selectors = self.selectors.concat(selector1.selectors, ' ', combinator, ' ', selector2.selectors);
    return self;
  }

  stringify() {
    const str = this.selectors.map((currSelector) => (typeof (currSelector) === 'object' ? currSelector.selector : currSelector)).join('');
    return str;
  }
}
const cssSelectorBuilder = new CssSelectorBuilder();


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
