import { Component, input } from '@angular/core';
import { RangePipe } from '../../../../shared/pipes/range.pipe';

@Component({
  selector: 'pokemon-list-skeleton',
  imports: [RangePipe],
  templateUrl: './pokemon-list-skeleton.component.html',
})
export class PokemonListSkeletonComponent {
  public limit = input.required<number>();
}
