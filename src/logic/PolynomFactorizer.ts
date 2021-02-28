import PolynomValue from '@/logic/PolynomValue';

export default class PolynomFactorizer {
  private maxGrad = 5;

  private bodyValue = 11;

  private polynom: PolynomValue[] = [];

  public constructor(maxGrad: number, bodyValue: number, polynomString: string) {
    this.maxGrad = maxGrad;
    this.bodyValue = bodyValue;
    this.polynom = PolynomFactorizer.parsePolynomString(polynomString);
  }

  /**
   * Factorizes the Restklassenkörper polynom
   */
  public factorization(): string {
    let factorization = '';
    let tempPolynom = this.polynom;
    for (let i = 0; i < this.maxGrad; i++) {
      const ns = PolynomFactorizer.guessNS(tempPolynom, this.bodyValue);
      factorization += ` (X - ${ns})`;
      tempPolynom = this.dividePolynomByNS(tempPolynom, ns);
    }

    return factorization;
  }

  public dividePolynomByNS(polynom: PolynomValue[], ns: number): PolynomValue[] {
    const newPolynom: PolynomValue[] = [];
    if (ns === -1) {
      console.error('Nullstelle konnte nicht geraten werden. Überprüfen Sie Ihre Eingabe.');
    }

    let newI: PolynomValue = polynom[0];
    for (let i = 0; i < polynom.length; i++) {
      if (i + 1 < polynom.length) { // j = i + 1
        newI = this.step(newI, polynom[i + 1], ns, newPolynom);
      }
    }

    return newPolynom;
  }

  /**
   *
   * @param i Ein Polynom-Wert
   * @param j Ein Polynom-Wert dessen Grad um 1 kleiner ist als von i
   * @param divider Eine geratene NS
   * @param newPolynom Referenz zum Array, in dem die neuen Polynom-Werte eingetragen werden.
   * @private
   */
  public step(i: PolynomValue, j: PolynomValue, divider: number, newPolynom: PolynomValue[]):
    PolynomValue {
    // Erster Polynom-Wert nach Gleichzeichen kann direkt bestimmt werden, da nur Reduktion
    // des Grads um 1
    const erg = {
      grad: i.grad - 1,
      value: i.value,
    };
    newPolynom.push(erg);

    // Rückmultiplikation des vorigen bestimmen Polynom-Wertes mit der Negation des divider
    // und Subtraktion mit j
    const newI: PolynomValue = {
      grad: erg.grad,
      value: (j.value - (erg.value * divider * (-1))) % this.bodyValue,
    };

    return newI;
  }

  /**
   * Das Modul (bodyValue) gibt an in welchem Zahlenbereich wir arbeiten.
   * Wenn Modul = 11, dann hat unser Restklassenkörper den Wertebereich {0, .., 10};
   * @param polynom
   * @param bodyValue
   */
  public static guessNS(polynom: PolynomValue[], bodyValue: number): number {
    for (let i = 0; i < bodyValue; i++) {
      let erg = 0;
      let j = 0;
      do {
        // e.g. 15X^5 mod 11 => 15*i^5 % 11
        erg += (polynom[j].value * (i ** polynom[j].grad)) % bodyValue;
        j++;
      } while (j < polynom.length);

      erg %= bodyValue;
      if (erg === 0) { // einsetzen eines i hat in Summe 0 ergeben => muss eine NS sein
        return i;
      }
    }

    return -1; // error
  }

  /**
   * Expects p(X) = yX^5 + xX^4 + zX^3 + rX^2 + sX^1 + tX^0 Form
   * You may ignore factors in between (e.g. X⁵ + X² + 5)
   * @private
   */
  public static parsePolynomString(polynomString: string): PolynomValue[] {
    if (polynomString == null) {
      return [];
    }

    const cleanPolynomString = polynomString.replace(/\s/g, '');

    const finalPolynom: PolynomValue[] = [];
    const tempPolynom: string[] = cleanPolynomString.split('+');

    // TODO pad missing polynom values

    // parse
    tempPolynom.forEach((t) => {
      finalPolynom.push(PolynomFactorizer.parseSinglePolynomValue(t) || {
        grad: 0,
        value: 0,
      });
    });

    // sort by grad ascend
    finalPolynom.sort((a: PolynomValue, b: PolynomValue) => {
      if (b.grad > a.grad) return 1;
      if (b.grad < a.grad) return -1;
      return 0;
    });

    return finalPolynom;
  }

  /**
   * Expects: p(X) = yX^z
   * @param str
   * @return {grad: z, value: y}
   */
  public static parseSinglePolynomValue(str: string): PolynomValue | null {
    const regex = /(\d*)X\^(\d*)/gm;
    /*
    * Found match, group 0: 15X^2   // Ignore this
    * Found match, group 1: 15      // value
    * Found match, group 2: 2       // grad
    */
    const m: RegExpExecArray | null = regex.exec(str);
    if (m == null) {
      console.log('Check your input!');
      return null;
    }
    return {
      value: parseInt(m[1], 10),
      grad: parseInt(m[2], 10),
    };
  }
}
