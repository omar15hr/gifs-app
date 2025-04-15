import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Gif } from '../interfaces/gig.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { GiphyResponse } from '../interfaces/giphy.interface';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>({});
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
        },
      })
      .subscribe((resp) => {
        const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
        this.trendingGifs.set(gifs);
        this.trendingGifsLoading.set(false);
      });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: 20,
          q: query,
        },
      }).pipe(
        map( ({data}) => data ),
        map( (items) => GifMapper.mapGiphyItemsToGifArray(items)),
        tap( items => {
          this.searchHistory.update(history => ({
            ...history,
            [query.toLowerCase()]:items,
          }))
        })
      );
      // .subscribe((resp) => {
      //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      // });
  }

  gifHistoryGifs(query:string):Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
