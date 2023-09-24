import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, debounceTime, map, switchMap } from 'rxjs';
import { MoviesService } from 'src/app/core/movies.service';
import { MovieTitle } from 'src/app/types';

@Component({
  selector: 'app-movie-search',
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  defaultMovieIds = [7162, 6606, 7132, 7161, 7050]

  model = {
    movieTitle: ''
  }

  @Output() onMovieSelect = new EventEmitter<MovieTitle>();

  titleSubstr$ = new BehaviorSubject<string>('');
  suggestedMovieTitles$!: Observable<MovieTitle[]>;


  constructor(private moviesService: MoviesService) { }


  displayTitle(movieTitle: MovieTitle) {
    return movieTitle ? movieTitle.title : '';
  }

  onInputChange(value: any) {
    if (typeof value !== "string") {
      return;
    }

    this.titleSubstr$.next(value);
  }

  ngOnInit() {
    this.suggestedMovieTitles$ = this.titleSubstr$.pipe(
      debounceTime(250),
      map(titleSubstr => titleSubstr.toLowerCase()),
      switchMap(titleSubstr => titleSubstr
        ? this.moviesService.getMoviesTitlesBySubstr$(titleSubstr, 5)
        : this.moviesService.getMoviesTitlesByIds$(this.defaultMovieIds)
      )
    )
  }
}
