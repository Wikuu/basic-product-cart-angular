// ** Angular Imports
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

// ** RxJS Imports
import { Observable, map, startWith } from 'rxjs';

// ** Type Imports
import { Product, CartProduct } from './types/Product';

// ** Angular Material Imports
import { MatTableDataSource } from '@angular/material/table';

const PRODUCTS: Product[] = [
  { id: 1, name: 'B2', price: 100, setupPrice: 50 },
  { id: 2, name: 'B4', price: 200, setupPrice: 100 },
  { id: 3, name: 'B6', price: 300, setupPrice: 150 },
  { id: 4, name: 'B8', price: 400, setupPrice: 200 },
  { id: 5, name: 'B10', price: 500, setupPrice: 250 },
  { id: 6, name: 'B12', price: 600, setupPrice: 300 },
  { id: 7, name: 'B14', price: 700, setupPrice: 350 },
  { id: 8, name: 'B16', price: 800, setupPrice: 400 },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Vars
  cartProducts = new MatTableDataSource<CartProduct>([
    {
      id: 1,
      name: 'B2',
      price: 100,
      setupPrice: 50,
      quantity: 1,
      hingeSide: '-',
      exposedSide: '-',
      setupAdded: false,
      total: 100,
    },
  ]);

  hingeSides = ['L', 'R', '-'];
  exposedSides = ['L', 'R', 'B', '-'];

  productOptions: Product[] = PRODUCTS;
  filteredOptions: Observable<Product[]>;
  displayedColumns: string[] = [
    'id',
    'quantity',
    'name',
    'hingeSide',
    'exposedSide',
    'price',
    'setupPrice',
    'total',
    'actions',
  ];

  // Form Controls
  productAutocompleteControl = new FormControl<Product | string>('');
  addItemToTop: boolean = false;
  includeSetup: boolean = false;

  ngOnInit() {
    this.filteredOptions = this.productAutocompleteControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.productOptions;
      })
    );
  }

  // Autocomplete get selected product and add to cart
  getSelectedProduct(product: Product) {
    const productExists = this.cartProducts.data.find(
      (cartProduct) => cartProduct.id === product.id
    );

    this.productAutocompleteControl.setValue('');

    if (productExists) {
      productExists.quantity++;
      productExists.total = productExists.price * productExists.quantity;
    } else {
      const cartProduct: CartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        setupPrice: product.setupPrice,
        setupAdded: this.includeSetup,
        quantity: 1,
        hingeSide: '-',
        exposedSide: '-',
        total: this.includeSetup
          ? product.price + product.setupPrice
          : product.price,
      };

      this.addItemToTop
        ? this.cartProducts.data.unshift(cartProduct)
        : this.cartProducts.data.push(cartProduct);
    }

    this.cartProducts.data = this.cartProducts.data;
  }

  // Autocomplete display fn
  displayProduct(product: Product): string {
    return product && product.name ? product.name : '';
  }

  // Autocomplete filter fn
  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();

    return this.productOptions.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  addItemToTopHandler() {
    this.addItemToTop = !this.addItemToTop;
  }

  quantityHandler(id: number, action: 'increase' | 'decrease') {
    const product = this.cartProducts.data.find(
      (cartProduct) => cartProduct.id === id
    );

    if (product) {
      if (product.quantity === 1 && action === 'decrease') {
        this.cartProducts.data = this.cartProducts.data.filter(
          (cartProduct) => cartProduct.id !== id
        );
        return;
      }

      action === 'increase' ? product.quantity++ : product.quantity--;
      product.total = product.price * product.quantity;
    }

    this.cartProducts.data = this.cartProducts.data;
  }

  isChipSelected(val: string, equality: string) {
    return val === equality;
  }

  onHingeSideChange(id: number, val: CartProduct['hingeSide'] | undefined) {
    const product = this.cartProducts.data.find(
      (cartProduct) => cartProduct.id === id
    );

    if (product) {
      if (val === undefined) {
        val = '-';
      }

      product.hingeSide = val;
    }

    this.cartProducts.data = this.cartProducts.data;
  }

  onExposedSideChange(id: number, val: CartProduct['exposedSide'] | undefined) {
    const product = this.cartProducts.data.find(
      (cartProduct) => cartProduct.id === id
    );

    if (product) {
      if (val === undefined) {
        val = '-';
      }

      product.exposedSide = val;
    }

    this.cartProducts.data = this.cartProducts.data;
  }

  onIncludeSetupChange() {
    this.includeSetup = !this.includeSetup;

    this.cartProducts.data.forEach((cartProduct) => {
      cartProduct.setupAdded = this.includeSetup;
      const total = cartProduct.price * cartProduct.quantity;
      cartProduct.total = this.includeSetup
        ? total + cartProduct.setupPrice
        : total;
    });

    this.cartProducts.data = this.cartProducts.data;
  }

  onElementSetupChange(id: number) {
    const product = this.cartProducts.data.find(
      (cartProduct) => cartProduct.id === id
    );

    if (product) {
      if (product.setupAdded) {
        product.total = product.total - product.setupPrice;
      } else {
        product.total = product.total + product.setupPrice;
      }
      product.setupAdded = !product.setupAdded;
    }

    if (this.cartProducts.data.every((cartProduct) => cartProduct.setupAdded)) {
      this.includeSetup = true;
    } else {
      this.includeSetup = false;
    }

    this.cartProducts.data = this.cartProducts.data;
  }

  removeProduct(id: number) {
    this.cartProducts.data = this.cartProducts.data.filter(
      (cartProduct) => cartProduct.id !== id
    );
  }
}
