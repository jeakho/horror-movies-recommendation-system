import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoviesListComponent } from './movies-list.component';
import { MovieListItemModule } from '../movie-list-item/movie-list-item.module';



@NgModule({
  declarations: [
    MoviesListComponent
  ],
  imports: [
    CommonModule,
    MovieListItemModule
  ],
  exports: [MoviesListComponent]
})
export class MoviesListModule { }
