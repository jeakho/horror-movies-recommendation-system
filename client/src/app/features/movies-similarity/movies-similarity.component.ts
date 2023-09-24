import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { BehaviorSubject, Observable, switchMap, tap, Subscription, Subject, distinctUntilChanged, delay } from 'rxjs';
import { MoviesService } from 'src/app/core/movies.service';
import { MovieDetailedInfo, MovieInfo, MovieTitle } from 'src/app/types';



@Component({
  selector: 'app-movies-similarity',
  templateUrl: './movies-similarity.component.html',
  styleUrls: ['./movies-similarity.component.css']
})
export class MoviesSimilarityComponent implements OnInit, OnDestroy {
  availableModels = [
    'Encoder (TF-IDF)',
    'Deep encoder (TF-IDF)',
    'Encoder (Bag-of-Words)',
    'Deep encoder (Bag-of-Words)',
    'RAE',
    'Doc-2-Vec'
  ]

  selectedMovieTitle$: Subject<MovieTitle>;
  selectedMovie$: Subject<MovieInfo>;
  selectedMovieDetails$: Subject<MovieDetailedInfo>;
  settings$: BehaviorSubject<{ modelType: string, noMovies: number }>;
  isLoading$: BehaviorSubject<boolean>;

  suggestedMovieTitles$!: Observable<MovieTitle[]>;
  topNMovies$!: Observable<MovieInfo[]>

  selectedMovieSubscription!: Subscription;

  optionsFormGroup = this.formBuilder.group({
    modelType: ['0'],
    noMovies: [10, [Validators.required, Validators.pattern(/^([1-9]|10)$/)]]
  })


  constructor(
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private moviesService: MoviesService
  ) {
    this.selectedMovieTitle$ = new Subject<MovieTitle>();
    this.selectedMovie$ = new Subject();
    this.selectedMovieDetails$ = new Subject();
    this.settings$ = new BehaviorSubject(this.optionsFormValue);
    this.isLoading$ = new BehaviorSubject(false);
  }

  get optionsFormValue() {
    return this.optionsFormGroup.value as { modelType: string, noMovies: number };
  }

  displayTitle(movieTitle: MovieTitle) {
    return movieTitle ? movieTitle.title : '';
  }

  onMovieSelected(selectedMovieTitle: MovieTitle) {
    this.selectedMovieTitle$.next(selectedMovieTitle)
  }

  applySettingsChanges() {
    if (!this.optionsFormGroup.valid) {
      alert('Not all settings values are valid!');
      return;
    }

    this.settings$.next(this.optionsFormValue);
  }

  ngOnInit(): void {
    this.topNMovies$ = this.selectedMovieTitle$.pipe(
      switchMap(movieTitle => this.settings$.pipe(
        distinctUntilChanged((prev, cur) => prev.modelType === cur.modelType && prev.noMovies === cur.noMovies),
        tap(_ => this.isLoading$.next(true)),
        switchMap(settings => this.moviesService.getMostSimilarMovies$(movieTitle.id, settings.modelType, settings.noMovies)),
        delay(1000),
        tap(_ => this.isLoading$.next(false))
      ))
    )

    this.selectedMovieSubscription = this.selectedMovie$.pipe(
      tap(_ => this.isLoading$.next(true)),
      switchMap(movie => this.moviesService.getMovieDetails$(movie.id)),
      tap(_ => this.isLoading$.next(false))
    ).subscribe(movieDetails =>
        this.matDialog.open(MovieDetailsComponent, {
        width: '700px',
        maxHeight: '700px',
        data: movieDetails
      })
    )
  }

  ngOnDestroy(): void {
    this.selectedMovieSubscription.unsubscribe();
  }
}
