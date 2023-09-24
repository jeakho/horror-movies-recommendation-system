import { NgModule } from '@angular/core';
import { MoviesQualityComponent } from './movies-quality.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MovieSearchModule } from '../movie-search/movie-search.module';
import { MoviesListModule } from '../movies-list/movies-list.module';



@NgModule({
  declarations: [MoviesQualityComponent],
  imports: [
    SharedModule,
    MovieSearchModule,
    MoviesListModule
  ],
  exports: [MoviesQualityComponent]
})
export class MoviesQualityModule { }
