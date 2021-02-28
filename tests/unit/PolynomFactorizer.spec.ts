import PolynomFactorizer from '@/logic/PolynomFactorizer';
import PolynomValue from '@/logic/PolynomValue';

describe('PolynomFactorizer.ts', () => {
  it('parses input string correctly', () => {
    const polynomString = '11X^5 + 5X^4 + 1X^3 + 5X^1 + 10X^0';

    expect(PolynomFactorizer.parsePolynomString(polynomString))
      .toStrictEqual([
        {
          grad: 5,
          value: 11,
        },
        {
          grad: 4,
          value: 5,
        },
        {
          grad: 3,
          value: 1,
        },
        {
          grad: 1,
          value: 5,
        },
        {
          grad: 0,
          value: 10,
        },
      ]);
  });

  it('parses single polynom value correctly', () => {
    const str = '15X^2';

    expect(PolynomFactorizer.parseSinglePolynomValue(str))
      .toStrictEqual({
        value: 15,
        grad: 2,
      });
  });

  it('guesses correctly a NS of 5X + 5 in Z11. X should be 10', () => {
    const polynom: PolynomValue[] = [
      {
        grad: 1,
        value: 5,
      },
      {
        grad: 0,
        value: 5,
      },
    ];
    const ns = PolynomFactorizer.guessNS(polynom, 11);
    expect(ns)
      .toBe(10);
  });

  it('step correctly calculates 2 steps of the division '
    + '1X^5 + 9X^4 + 5X^3 + 8X^2 + 5X^1 + 5X^0 : (X - 1) = 1X^4 + 10X^3 + ...', () => {
    const polynom = [
      {
        grad: 5,
        value: 1,
      },
      {
        grad: 4,
        value: 9,
      },
    ];
    const f: PolynomFactorizer = new PolynomFactorizer(5, 11, 'ist egal.');
    const newPolynom: PolynomValue[] = [];
    const newI = f.step(polynom[0], polynom[1], 1, newPolynom);
    f.step(newI, polynom[2], 1, newPolynom);
    expect(newPolynom)
      .toStrictEqual([
        {
          grad: 4,
          value: 1,
        },
        {
          grad: 3,
          value: 10,
        },
      ]);
  });

  it('dividePolynomByNS correctly divides'
    + '1X^5 + 9X^4 + 5X^3 + 8X^2 + 5X^1 + 5X^0 : (X - 1) = 1X^4 + 10X^3 + 4X^2 + 1X^1 + 6X^0', () => {
    const polynom = [
      {
        grad: 5,
        value: 1,
      },
      {
        grad: 4,
        value: 9,
      },
      {
        grad: 3,
        value: 5,
      },
      {
        grad: 2,
        value: 8,
      },
      {
        grad: 1,
        value: 5,
      },
      {
        grad: 0,
        value: 5,
      },
    ];
    const f: PolynomFactorizer = new PolynomFactorizer(5, 11, 'ist egal');
    expect(f.dividePolynomByNS(polynom, 1))
      .toStrictEqual([
        {
          grad: 4,
          value: 1,
        },
        {
          grad: 3,
          value: 10,
        },
        {
          grad: 2,
          value: 4,
        },
        {
          grad: 1,
          value: 1,
        },
        {
          grad: 0,
          value: 6,
        },
      ]);
  });

  it('factorizes A4 of Probeklausur 2021 correctly', () => {
    const str = '1X^5 + 9X^4 + 5X^3 + 8X^2 + 5X^1 + 5X^0';
    const f: PolynomFactorizer = new PolynomFactorizer(5, 11, str);

    const s: string = f.factorization();
    console.log(s);
    expect(s)
      .toMatch('(X - 1)');
    expect(s)
      .toContain('(X - 3)');
    expect(s)
      .toContain('(X - 9)');
    expect(s)
      .toContain('(X - 10)');
  });

  it('factorizes A4 of klaukry_20190215 correctly', () => {
    const str = '1X^5 + 0X^4 + 5X^3 + 17X^2 + 0X^1 + 0X^0';
    const f: PolynomFactorizer = new PolynomFactorizer(5, 19, str);

    const s: string = f.factorization();
    console.log(s);
    expect(s)
      .toMatch('(X - 0)');
    expect(s)
      .toContain('(X - 12)');
    expect(s)
      .toContain('(X - 14)');
  });

  it('factorizes A4 of klaukry_20190722 correctly', () => {
    const str = '1X^5 + 4X^4 + 2X^3 + 1X^2 + 2X^1 + 0X^0';
    const f: PolynomFactorizer = new PolynomFactorizer(5, 5, str);

    const s: string = f.factorization();
    console.log(s);
    expect(s)
      .toMatch('(X - 0)');
    expect(s)
      .toContain('(X - 1)');
    expect(s)
      .toContain('(X - 2)');
    expect(s)
      .toContain('(X - 4)');
  });

  it('factorizes A4 of klaukry_20200217 correctly', () => {
    const str = '1X^5 + 3X^4 + 1X^3 + 4X^2 + 5X^1 + 0X^0';
    const f: PolynomFactorizer = new PolynomFactorizer(5, 7, str);

    const s: string = f.factorization();
    console.log(s);
    expect(s)
      .toMatch('(X - 0)');
    expect(s)
      .toContain('(X - 1)');
    expect(s)
      .toContain('(X - 5)');
    expect(s)
      .toContain('(X - 6)');
  });

  it('factorizes A4 of klaukry_20201006 correctly', () => {
    const str = '1X^5 + 4X^4 + 1X^3 + 0X^2 + 4X^1 + 0X^0';
    const f: PolynomFactorizer = new PolynomFactorizer(5, 7, str);

    const s: string = f.factorization();
    console.log(s);
    expect(s)
      .toMatch('(X - 0)');
    expect(s)
      .toContain('(X - 2)');
    expect(s)
      .toContain('(X - 4)');
  });
});
