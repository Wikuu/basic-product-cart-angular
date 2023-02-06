// ** Angular Imports
import { Component } from '@angular/core';

// ** Type Imports
import { Product, CartProduct } from './types/Product';

// ** Angular Material Imports
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // Vars
  cartProducts = new MatTableDataSource<CartProduct>([]);

  hingeSides = ['L', 'R', '-'];
  exposedSides = ['L', 'R', 'B', '-'];

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
  addItemToTop: boolean = false;
  includeSetup: boolean = false;

  // Autocomplete get selected product and add to cart
  getSelectedProduct(product: Product) {
    const productExists = this.cartProducts.data.find(
      (cartProduct) => cartProduct.id === product.id
    );

    if (productExists) {
      productExists.quantity++;
      productExists.total = productExists.price * productExists.quantity;
    } else {
      const cartProduct: CartProduct = {
        ...product,
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

    this.updateCartProducts();
  }

  // Autocomplete display fn
  displayProduct(product: Product): string {
    return product && product.name ? product.name : '';
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

    this.updateCartProducts();
  }

  isChipSelected(val: string, equality: string) {
    return val === equality;
  }

  onSideChange(
    id: number,
    val: CartProduct['hingeSide'] | undefined,
    side: 'hinge' | 'exposed'
  ) {
    const product = this.cartProducts.data.find(
      (cartProduct) => cartProduct.id === id
    );

    if (product) {
      if (val === undefined) {
        val = '-';
      }

      if (side === 'hinge') {
        product.hingeSide = val;
      } else {
        product.exposedSide = val;
      }
    }

    this.updateCartProducts();
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

    this.updateCartProducts();
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

    this.updateCartProducts();
  }

  updateCartProducts() {
    this.cartProducts.data = this.cartProducts.data;
  }

  removeProduct(id: number) {
    this.cartProducts.data = this.cartProducts.data.filter(
      (cartProduct) => cartProduct.id !== id
    );
  }
}
