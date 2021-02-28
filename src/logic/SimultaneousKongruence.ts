/**
 * Efficient calculation of big numbers for e.g. DH and RSA
 * Also known as Chinesischer Restsatz
 */
import Kongruence from '@/logic/Kongruence';

export default class SimultaneousKongruence {
  private _kongruences: Kongruence[] = [];

  /**
   * Mi == m (overall moduleProduct) / mi (module of kongruence i)
   * @private
   */
  private _moduleProducts: number[] = [];

  /**
   * Mi^-1
   */
  private _inverseModuleProducts: number[] = [];

  private _condition = false;

  /**
   * Product of all modules (overall moduleProduct)
   */
  private _m = 1;

  /**
   * End result
   */
  private _x = 0;

  public constructor(kongruences: Kongruence[]) {
    this._kongruences = kongruences;
  }

  public calc(): string {
    this._condition = this.checkCondition();
    if (!this._condition) {
      console.warn('Die Bedingung, dass alle Module paarweise teilerfremd sein müssen'
        + 'ist nicht erfüllt. Kontrollieren Sie Ihre Eingabe.');
    }
    this.calcModuleProduct(); // m is now set
    this.calcSingleModuleProducts();
    this.calcMultInverse();
    this.calcSimultaneousCongruence();
    return '';
  }

  /**
   * Step 1
   * Module müssen paarweise teilerfremd zu einander sein
   */
  public checkCondition(): boolean {
    for (let i = 0; i < this._kongruences.length; i++) {
      if (i + 1 < this._kongruences.length) {
        const m1 = this._kongruences[i].modul;
        const m2 = this._kongruences[i + 1].modul;
        if (SimultaneousKongruence.euklid(m1, m2)[0] !== 1) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Step 2
   */
  public calcModuleProduct(): number {
    this._kongruences.forEach((k) => {
      this._m *= k.modul;
    });

    return this._m;
  }

  /**
   * Step 3
   *
   * Divide the overall moduleProduct by each module
   */
  public calcSingleModuleProducts(): number[] {
    for (let i = 0; i < this._kongruences.length; i++) {
      this._moduleProducts[i] = this._m / this._kongruences[i].modul;
    }

    return this._moduleProducts;
  }

  /**
   * Step 4
   */
  public calcMultInverse(): number[] {
    for (let i = 0; i < this._moduleProducts.length; i++) {
      const module = this._kongruences[i].modul;
      // use extended euklid in order to calculate the multiplicative inverse
      this._inverseModuleProducts[i] = SimultaneousKongruence
        .euklid(module, this._moduleProducts[i] % module)[1];
    }

    return this._inverseModuleProducts;
  }

  /**
   * Step 5 (final)
   */
  public calcSimultaneousCongruence(): number {
    for (let i = 0; i < this._inverseModuleProducts.length; i++) { // does not matter which iterable
      this._x += (this._kongruences[i].value * this._inverseModuleProducts[i]
        * this._moduleProducts[i]);
    }

    this._x %= this._m;

    return this._x;
  }

  get m(): number {
    return this._m;
  }

  set m(value: number) {
    this._m = value;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get kongruences(): Kongruence[] {
    return this._kongruences;
  }

  get moduleProducts(): number[] {
    return this._moduleProducts;
  }

  set moduleProducts(value: number[]) {
    this._moduleProducts = value;
  }

  get inverseModuleProducts(): number[] {
    return this._inverseModuleProducts;
  }

  set inverseModuleProducts(value: number[]) {
    this._inverseModuleProducts = value;
  }

  get condition(): boolean {
    return this._condition;
  }

  set condition(value: boolean) {
    this._condition = value;
  }

  /**
   * Greatest common divider with extended euklid algorithm (Prof. Burkhard Lenze)
   *
   * @param m
   * @param n
   * @return array: 0: gcd; 1, 2: multiplicative inverse. Depends on what values were given as
   * parameter. If m is the module and m >= n then the mult. inverse is on index 1. Usually the
   * bigger value should be m.
   * @private
   */
  public static euklid(m: number, n: number): number[] {
    let v = 0;
    const out: number[] = [3];
    const a: number[] = [3];
    const c: number[] = [3];
    const d: number[] = [3];
    c[0] = 1;
    c[1] = 0;
    d[0] = 0;
    d[1] = 1;
    a[0] = n;
    a[1] = m;
    do {
      a[2] = a[0] % a[1];
      v = Math.floor(a[0] / a[1]);
      c[2] = c[0] - v * c[1];
      d[2] = d[0] - v * d[1];
      a[0] = a[1];
      a[1] = a[2];
      c[0] = c[1];
      c[1] = c[2];
      d[0] = d[1];
      d[1] = d[2];
    } while (a[1] !== 0);

    while (c[0] < 0) {
      c[0] += m;
    }
    while (d[0] < 0) {
      d[0] += n;
    }
    out[0] = a[0];
    out[1] = c[0];
    out[2] = d[0];

    return out;
  }
}
