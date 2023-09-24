import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MoviesSimilarityModule } from './features/movies-similarity/movies-similarity.module';

// Angular Material
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from './shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { MoviesQualityModule } from './features/movies-quality/movies-quality.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MovieDetailsModule } from './features/movie-details/movie-details.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,

    MoviesSimilarityModule,
    MoviesQualityModule,
    MovieDetailsModule,

    // Material
    MatTabsModule,
    MatCardModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
