import calcTaxes from "../src";

describe("calcTaxes", () => {
  it("returns 0 tax if no tax rates provided", () => {
    expect(calcTaxes(9.99)).toEqual({
      taxes: [],
      totalTax: 0
    });
  });
  it("returns exclusive tax by default", () => {
    expect(calcTaxes(9.99, [{ id: 1, rate: "20.0000" }])).toEqual({
      taxes: [{ id: 1, total: 1.998 }],
      totalTax: 1.998
    });
  });
  it("returns inclusive tax with flag", () => {
    expect(calcTaxes(9.99, [{ id: 1, rate: "20.0000" }], true)).toEqual({
      taxes: [{ id: 1, total: 1.665 }],
      totalTax: 1.665
    });
  });
  it("returns compound exclusive tax with compound flag", () => {
    const rates = [
      { id: 1, rate: "5.0000", compound: false },
      { id: 2, rate: "8.5000", compound: true }
    ];
    expect(calcTaxes(100, rates)).toEqual({
      taxes: [{ id: 1, total: 5 }, { id: 2, total: 8.925 }],
      totalTax: 13.925
    });
  });
  it("returns compound inclusive tax with compound flag", () => {
    const rates = [
      { id: 1, rate: "5.0000", compound: false },
      { id: 2, rate: "8.5000", compound: true }
    ];
    expect(calcTaxes(100, rates, true)).toEqual({
      taxes: [{ id: 1, total: 4.3889 }, { id: 2, total: 7.8341 }],
      totalTax: 12.223
    });
  });
});
