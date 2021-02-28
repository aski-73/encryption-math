import SimultaneousKongruence from '@/logic/SimultaneousKongruence';
import Kongruence from '@/logic/Kongruence';

describe('Simultaneous Kongruence Test', () => {
  it('euklid(10,9) = 1', () => {
    const e = SimultaneousKongruence.euklid(10, 9);
    console.log(e);
    expect(e[0])
      .toBe(1);
  });

  it('euklid(12,4) = 4', () => {
    const e = SimultaneousKongruence.euklid(12, 4);
    console.log(e);
    expect(e[0])
      .toBe(4);
  });

  it('checkCondition, calcModuleProduct, calcSingleModuleProducts,'
    + 'inverseModuleProducts, calcSimultaneousCongruence work correctly'
    + '(A2 of Probeklausur 2021)', () => {
    const k: Kongruence[] = [
      {
        modul: 10,
        value: 4,
      },
      {
        modul: 9,
        value: 1,
      },
      {
        modul: 13,
        value: 11,
      },
      {
        modul: 7,
        value: 1,
      },
    ];
    const sk = new SimultaneousKongruence(k);
    expect(sk.checkCondition())
      .toBeTruthy();
    expect(sk.calcModuleProduct())
      .toBe(8190);
    expect(sk.calcSingleModuleProducts())
      .toStrictEqual([
        819, 910, 630, 1170,
      ]);
    expect(sk.calcMultInverse())
      .toStrictEqual([
        9, 1, 11, 1,
      ]);
    expect(sk.calcSimultaneousCongruence())
      .toBe(1324);
  });

  it('calcs A2 of klaukry_20190722 correctly', () => {
    const k: Kongruence[] = [
      {
        modul: 2,
        value: 1,
      },
      {
        modul: 3,
        value: 2,
      },
      {
        modul: 5,
        value: 3,
      },
    ];
    const sk = new SimultaneousKongruence(k);
    sk.calc();
    expect(sk.x)
      .toBe(23);
  });

  it('calcs A2 of klaukry_20200217 correctly', () => {
    const k: Kongruence[] = [
      {
        modul: 2,
        value: 1,
      },
      {
        modul: 9,
        value: 6,
      },
      {
        modul: 7,
        value: 6,
      },
      {
        modul: 29,
        value: 22,
      },
    ];
    const sk = new SimultaneousKongruence(k);
    sk.calc();
    expect(sk.x)
      .toBe(573);
  });

  it('calcs A2 of klaukry_20201006 correctly', () => {
    const k: Kongruence[] = [
      {
        modul: 7,
        value: 2,
      },
      {
        modul: 4,
        value: 3,
      },
      {
        modul: 5,
        value: 1,
      },
      {
        modul: 23,
        value: 21,
      },
    ];
    const sk = new SimultaneousKongruence(k);
    sk.calc();
    expect(sk.x)
      .toBe(1171);
  });

  /**
   * HIER EINTRAGEN
   */
  it('calcs A2 of klaukry_20210301 correctly', () => {
    const k: Kongruence[] = [
      {
        modul: 7,
        value: 2,
      },
      {
        modul: 4,
        value: 3,
      },
      {
        modul: 5,
        value: 1,
      },
      {
        modul: 23,
        value: 21,
      },
    ];
    const sk = new SimultaneousKongruence(k);
    sk.calc();
    console.log(`m: ${sk.m}`);
    for (let i = 0; i < sk.moduleProducts.length; i++) {
      console.log(`M${i + 1}: ${sk.moduleProducts[i]}`);
    }

    for (let i = 0; i < sk.inverseModuleProducts.length; i++) {
      console.log(`M${i + 1}^-1 (y${i + 1}): ${sk.inverseModuleProducts[i]}`);
    }

    let s = '';
    for (let i = 0; i < sk.inverseModuleProducts.length; i++) { // does not matter which iterable
      s += `(${sk.kongruences[i].value} * ${sk.inverseModuleProducts[i]} * ${sk.moduleProducts[i]})`;
      if (i < sk.inverseModuleProducts.length - 1) s += ' + ';
      else s += ` (mod ${sk.m}) `;
    }
    console.log(`x = ${s} = ${sk.x}`);
  });
});
