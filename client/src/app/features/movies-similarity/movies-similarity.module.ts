import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MoviesSimilarityComponent } from './movies-similarity.component';
import { MoviesListModule } from '../movies-list/movies-list.module';
import { MovieSearchModule } from '../movie-search/movie-search.module';



@NgModule({
  declarations: [MoviesSimilarityComponent],
  imports: [
    SharedModule,
    MoviesListModule,
    MovieSearchModule
  ],
  exports: [
    MoviesSimilarityComponent
  ]
})
export class MoviesSimilarityModule { }
