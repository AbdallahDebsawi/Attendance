import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], searchText: string, column: string): any[] {
    if (!value) return [];
    if (!searchText || !column) return value;

    searchText = searchText.toLowerCase();

    return value.filter(item => 
      item[column]?.toString().toLowerCase().includes(searchText)
    );
  }
}
