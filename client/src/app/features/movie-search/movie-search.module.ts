import { NgModule } from '@angular/core';
import { MovieSearchComponent } from './movie-search.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    MovieSearchComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [MovieSearchComponent]
})
export class MovieSearchModule { }
