declare const _brand: unique symbol
export type Brand<T, B extends string> = T & { readonly [_brand]: B }

export type Seed = Brand<string, 'Seed'>
export type Identity = Brand<string, 'Identity'>
