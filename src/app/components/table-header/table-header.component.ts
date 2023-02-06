import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

// ** RxJS Imports
import { Observable, map, startWith } from 'rxjs';

// ** Type Imports
import { Product } from 'src/app/types/Product';

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
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class TableHeaderComponent {
  @Output() onProductSelectEvent: EventEmitter<Product> = new EventEmitter();
  @Output() onItemAddToTopEvent: EventEmitter<void> = new EventEmitter();

  filteredOptions: Observable<Product[]>;
  productOptions: Product[] = PRODUCTS;
  productAutocompleteControl = new FormControl<Product | string>('');

  ngOnInit() {
    this.filteredOptions = this.productAutocompleteControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.productOptions;
      })
    );
  }

  // Autocomplete filter fn
  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();

    return this.productOptions.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  // Autocomplete display fn
  displayProduct(product: Product): string {
    return product && product.name ? product.name : '';
  }

  onProductSelect(product: Product) {
    this.productAutocompleteControl.setValue('');
    this.onProductSelectEvent.emit(product);
  }

  onItemAddToTop() {
    this.onItemAddToTopEvent.emit();
  }
}
