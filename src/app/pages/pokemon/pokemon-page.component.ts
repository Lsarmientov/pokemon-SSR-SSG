import { Component, inject, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Pokemon, SimplePokemon } from '@pokemons/interfaces';
import { PokemonService } from '@pokemons/services/pokemon.service';
import { tap } from 'rxjs';

@Component({
  selector: 'pokemon-page',
  imports: [],
  templateUrl: './pokemon-page.component.html',
})
export class PokemonPageComponent implements OnInit {
  private pokemonService = inject(PokemonService);
  private route = inject(ActivatedRoute);
  public pokemon = signal<Pokemon | null>(null);
  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    if (!name) return;
    this.pokemonService
      .getPokemonByName(name)
      .pipe(
        tap((pokemon) => {
          const pageTitle = `${pokemon.name} - #${pokemon.id}`;
          const pageDescription = `Información sobre ${pokemon.name}`;
          this.title.setTitle(pageTitle);
          this.meta.updateTag({
            name: 'description',
            content: pageDescription,
          });
          this.meta.updateTag({
            name: 'og:title',
            content: pageTitle,
          });
          this.meta.updateTag({
            name: 'og:description',
            content: pageDescription,
          });
          this.meta.updateTag({
            name: 'og:image',
            content: pokemon.sprites.other?.['official-artwork']?.front_default ?? '',
          });
        }),
      )
      .subscribe(this.pokemon.set);
  }
}
