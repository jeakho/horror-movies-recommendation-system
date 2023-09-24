import { NgModule } from '@angular/core';
import { MovieDetailsComponent } from './movie-details.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    MovieDetailsComponent
  ],
  imports: [
    SharedModule
  ]
})
export class MovieDetailsModule { }
