import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, delay, map, scan, shareReplay, startWith, switchMap, tap, Subscription } from 'rxjs';
import { MoviesService } from 'src/app/core/movies.service';
import { MovieInfo, MovieTitle } from 'src/app/types';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';

@Component({
  selector: 'app-movies-quality',
  templateUrl: './movies-quality.component.html',
  styleUrls: ['./movies-quality.component.css']
})
export class MoviesQualityComponent implements OnInit, OnDestroy {
  // sorting
  sortingOrderChanged$ = new Subject<boolean>();
  sortingOrder$!: Observable<number>;
  sortingOrderLabel$!: Observable<string>;

  // movies
  selectedMovie$ = new Subject<MovieTitle>();
  topNMovies$!: Observable<MovieInfo[]>;

  // scroll
  scrollReachedEnd$ = new Subject<any>();

  // loading
  isLoading$ = new BehaviorSubject<boolean>(false);

  // subscriptions
  selectedMovieSubscription!: Subscription;

  constructor(private moviesService: MoviesService, private matDialog: MatDialog) { }


  onMovieSelected(selectedMovieTitle: MovieTitle) {
    this.selectedMovie$.next(selectedMovieTitle)
  }

  ngOnInit() {
    this.sortingOrder$ = this.sortingOrderChanged$.pipe(
      startWith(true),
      scan((order, _) => order *= -1, -1),
      shareReplay()
    )

    this.sortingOrderLabel$ = this.sortingOrder$.pipe(
      map(order => order === 1 ? 'Descending' : 'Ascending')
    )

    // Query movies
    this.topNMovies$ = this.sortingOrder$.pipe(
      switchMap(sortingOrder => this.scrollReachedEnd$.pipe(
        startWith(true),
        scan((curPageNumber, _) => ++curPageNumber, 0),
        tap(_ => this.isLoading$.next(true)),
        switchMap(curPageNum => this.moviesService.getMoviePageWithRespectToRatings$(curPageNum, sortingOrder)),
        delay(500),
        tap(_ => this.isLoading$.next(false)),
        scan((allMovies, curPageMovies) => [...allMovies, ...curPageMovies])
      ))
    )


    this.selectedMovieSubscription = this.selectedMovie$.pipe(
      tap(_ => this.isLoading$.next(true)),
      switchMap(movie => this.moviesService.getMovieDetails$(movie.id, true)),
      tap(_ => this.isLoading$.next(false))
    ).subscribe(movieDetails =>
      this.matDialog.open(MovieDetailsComponent, {
        width: '700px',
        maxHeight: '700px',
        data: movieDetails
      })
    );
  }

  ngOnDestroy(): void {
    this.selectedMovieSubscription.unsubscribe();
  }
}
