export type Product = {
  id: number;
  name: string;
  price: number;
  setupPrice: number;
};

export type CartProduct = Product & {
  quantity: number;
  hingeSide: 'L' | 'R' | '-';
  exposedSide: 'L' | 'R' | 'B' | '-';
  setupAdded: boolean;
  total: number;
};
