import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  public currentPage = input<number>(1);
  public pages = input<number>(0);
  public limit = input<number>(10);

  public pageChange = output<number>();
  public limitChange = output<number>();

  private delta = 1;

  public visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.pages();
    const d = this.delta;

    if (total <= 1) return [1];

    const range: (number | '...')[] = [];
    const start = Math.max(2, current - d);
    const end = Math.min(total - 1, current + d);

    range.push(1);
    if (start > 2) range.push('...');
    for (let i = start; i <= end; i++) range.push(i);
    if (end < total - 1) range.push('...');
    range.push(total);

    return range;
  });

  onLimitChange(value: string) {
    this.limitChange.emit(Number(value));
  }
}
