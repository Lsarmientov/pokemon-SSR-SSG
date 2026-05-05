import { Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PokemonService } from '@pokemons/services/pokemon.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PokemonListComponent } from '@pokemons/components/pokemon-list/pokemon-list.component';
import { PokemonListSkeletonComponent } from '@pokemons/components/ui/pokemon-list-skeleton/pokemon-list-skeleton.component';
import { switchMap, map, startWith, catchError, of, tap } from 'rxjs';
import { signal } from '@angular/core';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { Title } from '@angular/platform-browser';
import { RangePipe } from '../../shared/pipes/range.pipe';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'pokemons-page',
  imports: [PokemonListComponent, PokemonListSkeletonComponent, PaginationComponent],
  templateUrl: './pokemons-page.component.html',
  providers: [PaginationService],
})
export class PokemonsPageComponent {
  private pokemonService = inject(PokemonService);
  public pagination = inject(PaginationService);
  private title = inject(Title);

  // Reacciona a cambios en page/limit de la URL
  private state = toSignal(
    toObservable(
      computed(() => ({
        page: this.pagination.page(),
        limit: this.pagination.limit(),
      })),
    ).pipe(
      switchMap(({ page, limit }) =>
        this.pokemonService.getPokemonsWithTotal(page, limit).pipe(
          map(({ pokemons, total }) => {
            const pages = Math.ceil(total / limit);

            // Si la página pedida supera el total, redirigir a la última
            if (page > pages) {
              this.pagination.update({ page: pages });
            }

            return { pokemons, pages, isLoading: false };
          }),
          tap(() => this.title.setTitle(`Pokemons SSR - Page ${page}`)),
          startWith({ pokemons: [], pages: 0, isLoading: true }),
          catchError(() => of({ pokemons: [], pages: 0, isLoading: false })),
        ),
      ),
    ),
    { initialValue: { pokemons: [], pages: 0, isLoading: true } },
  );

  public pokemons = computed(() => this.state().pokemons);
  public pages = computed(() => this.state().pages);
  public isLoading = computed(() => this.state().isLoading);
}
