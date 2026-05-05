import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Pokemon, PokemonsResponse, SimplePokemon } from '@pokemons/interfaces';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private http = inject(HttpClient);

  public getPokemonsWithTotal(
    page: number,
    limit: number,
  ): Observable<{ pokemons: SimplePokemon[]; total: number }> {
    return this.http
      .get<PokemonsResponse>(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${(page - 1) * limit}`,
      )
      .pipe(
        map((resp) => ({
          total: resp.count,
          pokemons: resp.results.map((pokemon) => {
            const id = Number(pokemon.url.split('/').filter(Boolean).pop());
            return {
              id,
              name: pokemon.name,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            };
          }),
        })),
      );
  }

  public getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }
}
