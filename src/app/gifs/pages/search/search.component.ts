import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'app-search',
  imports: [GifListComponent],
  templateUrl: './search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchComponent {
  gifService = inject(GifsService);

  onSearch(query: string) {
    this.gifService.searchGifs(query);
  }
}
