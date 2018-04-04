// @flow
import _ from "lodash";

/**
 * This module calculates inclusive and exclusive taxes
 */

type Rate = {
  id: number,
  rate: string,
  compound: boolean
};

type Rates = Array<Rate>;

type Tax = {
  id: number,
  total: number
};

type Taxes = {
  taxes: Array<Tax>,
  totalTax: number
};

/**
 * calcExclusiveTax
 * @param price
 * @param rates
 * @returns {number}
 */
const calcExclusiveTax = (price: number, rates: Rates): Taxes => {
  let preCompoundTotalTax = 0;
  const taxes = [];

  _(rates).forEach(tax => {
    if (!tax.compound) {
      taxes.push({
        id: tax.id,
        total: price * (parseFloat(tax.rate) / 100)
      });
    }
  });

  preCompoundTotalTax = _.sumBy(taxes, "total");

  _(rates).forEach(tax => {
    if (tax.compound) {
      taxes.push({
        id: tax.id,
        total: (price + preCompoundTotalTax) * (parseFloat(tax.rate) / 100)
      });
    }
  });

  const totalTax = _.sumBy(taxes, "total");

  return { taxes, totalTax };
};

/**
 * calcInclusiveTax
 * @param price
 * @param rates
 * @returns {number}
 */
const calcInclusiveTax = (price: number, rates: Rates): Taxes => {
  let regularTaxRates = 0;
  let compoundTaxRates = 0;
  let nonCompoundPrice = 0;
  const taxes = [];

  _(rates).forEach(tax => {
    const rate = parseFloat(tax.rate) / 100;
    if (tax.compound) {
      compoundTaxRates += rate;
    } else {
      regularTaxRates += rate;
    }
  });

  nonCompoundPrice = price / (1 + compoundTaxRates);

  _(rates).forEach(tax => {
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

  const totalTax = _.sumBy(taxes, "total");

  return { taxes, totalTax };
};

/**
 * calcTaxes
 * @param price
 * @param rates
 * @param priceIncludeTax
 * @returns {number}
 */
const calcTaxes = (
  price: number,
  rates: Rates = [],
  priceIncludeTax: boolean = false
): Taxes =>
  priceIncludeTax
    ? calcInclusiveTax(price, rates)
    : calcExclusiveTax(price, rates);

export { calcExclusiveTax, calcInclusiveTax };

export default calcTaxes;
