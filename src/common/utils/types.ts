
export type AnyObject = Record<keyof any, any>

export type ArrayValues<obj extends any[]> =
  obj[number];

export type ObjectValues<T extends AnyObject> = T[keyof T];

export type UnionToIntersection<Union> =
  (Union extends any ? (x: Union) => void : never) extends ((x: infer intersection) => void)
    ? intersection
    : never;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U2>
      ? ReadonlyArray<DeepPartial<U2>>
      : DeepPartial<T[P]>
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends Array<infer U>
    ? Array<DeepRequired<U>>
    : T[P] extends ReadonlyArray<infer U2>
      ? ReadonlyArray<DeepRequired<U2>>
      : DeepRequired<T[P]>
};

export type ArrayOrPlain<T extends any> = T[] | T;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type VoidFunction = () => void;

export type Merge<A, B> = Omit<A, keyof B> & B;
// export type MergeAll<Arr extends any[]> = {
//   empty: {};
//   cons: ((...args: Arr) => any) extends ((x: infer X, ...xs: infer Xs) => any)
//     ? Merge<X, MergeAll<Xs>>
//     : never;
// }[Arr extends [] ? 'empty' : 'cons'];

export type OmitConstructor<A> = Omit<A, 'constructor'>;

export type OptionalPropertyKeys<T extends object> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
    ? never
    : K
}[keyof T], undefined>;

export type RequiredPropertyKeys<T extends object> = Exclude<{
  [K in keyof T]: T extends Record<K, T[K]>
    ? K
    : never
}[keyof T], undefined>;

export type OnlyOptional<T extends object> = Pick<T, OptionalPropertyKeys<T>>;
export type OnlyRequired<T extends object> = Pick<T, RequiredPropertyKeys<T>>;

export interface NominalTyped<T extends string | symbol> {
  readonly _type: T;
}

export type ExtractRecordKey<R extends Record<any, any>> = R extends Record<infer I, any> ? I : never;


export type GetFirstArgumentType<T> = T extends (arg1: infer T, ...args: any[]) => any ? T : never

export type UnpackPromise<T> = T extends Promise<infer A> ? A : T

export type IfDefined<Check, True = Check, False = never> = Check extends undefined ? False : True
export type IfTrue<Check extends true | false, True, False = never> = Check extends true ? True : False
