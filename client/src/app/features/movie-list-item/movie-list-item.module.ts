import { NgModule } from '@angular/core';
import { MovieListItemComponent } from './movie-list-item.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    MovieListItemComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [MovieListItemComponent]
})
export class MovieListItemModule { }
