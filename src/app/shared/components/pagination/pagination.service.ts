import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class PaginationService {
  private activated = inject(ActivatedRoute);
  private router = inject(Router);

  private readonly VALID_LIMITS = [10, 20, 50, 100];
  private readonly DEFAULT_LIMIT = 10;
  private readonly DEFAULT_PAGE = 1;

  // 🔹 PAGE
  public page = toSignal(
    this.activated.queryParamMap.pipe(
      map((params) => Number(params.get('page'))),
      tap((page) => {
        if (page < this.DEFAULT_PAGE) this.update({ page: this.DEFAULT_PAGE });
      }),
      map((page) => Math.max(this.DEFAULT_PAGE, page)),
    ),
    { initialValue: this.DEFAULT_PAGE },
  );

  // 🔹 LIMIT
  public limit = toSignal(
    this.activated.queryParamMap.pipe(
      map((params) => {
        const raw = Number(params.get('limit'));
        // Si el valor no está en la lista permitida, usar default
        return this.VALID_LIMITS.includes(raw) ? raw : this.DEFAULT_LIMIT;
      }),
      tap((limit) => {
        if (!this.VALID_LIMITS.includes(Number(this.activated.snapshot.queryParams['limit']))) {
          this.update({ limit });
        }
      }),
    ),
    { initialValue: this.DEFAULT_LIMIT },
  );

  /**
   * 🔥 Método central para actualizar query params
   */
  public update(params: { page?: number; limit?: number }) {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
