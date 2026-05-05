import { SimplePokemon } from '@pokemons/interfaces';
import { Component, effect, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'pokemon-card',
  imports: [RouterLink],
  templateUrl: './pokemon-card.component.html',
})
export class PokemonCardComponent {
  pokemon = input.required<SimplePokemon>();
}
