"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcInclusiveTax = exports.calcExclusiveTax = undefined;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * calcExclusiveTax
 * @param price
 * @param rates
 * @returns {number}
 */
const calcExclusiveTax = (price, rates) => {
  let preCompoundTotalTax = 0;
  const taxes = [];

  (0, _lodash2.default)(rates).forEach(tax => {
    if (!tax.compound) {
      taxes.push({
        id: tax.id,
        total: price * (parseFloat(tax.rate) / 100)
      });
    }
  });

  preCompoundTotalTax = _lodash2.default.sumBy(taxes, "total");

  (0, _lodash2.default)(rates).forEach(tax => {
    if (tax.compound) {
      taxes.push({
        id: tax.id,
        total: (price + preCompoundTotalTax) * (parseFloat(tax.rate) / 100)
      });
    }
  });

  const totalTax = _lodash2.default.sumBy(taxes, "total");

  return { taxes, totalTax };
};

/**
 * calcInclusiveTax
 * @param price
 * @param rates
 * @returns {number}
 */

const calcInclusiveTax = (price, rates) => {
  let regularTaxRates = 0;
  let compoundTaxRates = 0;
  let nonCompoundPrice = 0;
  const taxes = [];

  (0, _lodash2.default)(rates).forEach(tax => {
    const rate = parseFloat(tax.rate) / 100;
    if (tax.compound) {
      compoundTaxRates += rate;
    } else {
      regularTaxRates += rate;
    }
  });

  nonCompoundPrice = price / (1 + compoundTaxRates);

  (0, _lodash2.default)(rates).forEach(tax => {
    let theRate = parseFloat(tax.rate) / 100;
    let thePrice = 0;

    if (tax.compound) {
      thePrice = price;
      theRate /= 1 + compoundTaxRates;
    } else {
      thePrice = nonCompoundPrice;
      theRate /= 1 + regularTaxRates;
    }

    taxes.push({
      id: tax.id,
      total: theRate * thePrice
    });
  });

  const totalTax = _lodash2.default.sumBy(taxes, "total");

  return { taxes, totalTax };
};

/**
 * calcTaxes
 * @param price
 * @param rates
 * @param priceIncludeTax
 * @returns {number}
 */
const calcTaxes = (price, rates = [], priceIncludeTax = false) => priceIncludeTax ? calcInclusiveTax(price, rates) : calcExclusiveTax(price, rates);

exports.calcExclusiveTax = calcExclusiveTax;
exports.calcInclusiveTax = calcInclusiveTax;
exports.default = calcTaxes;