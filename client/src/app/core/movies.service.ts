import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { MovieDetailedInfo, MovieTitle } from '../types';
import { MovieInfo } from '../types';

@Injectable()
export class MoviesService {

  constructor(private http: HttpClient) { }

  getMoviesTitlesBySubstr$(substr: string, maxCount: number): Observable<MovieTitle[]> {
    return (this.http.get('http://localhost:5000/movietitles' + (substr ? '/' + substr : '') + `?limit=${maxCount}`) as Observable<MovieTitle[]>).pipe(
      catchError(_ => of([]))
    )
  }

  getMoviesTitlesByIds$(ids: number[]): Observable<MovieTitle[]> {
    return (this.http.get('http://localhost:5000/movietitles/ids/' + encodeURIComponent(JSON.stringify(ids))) as Observable<MovieTitle[]>).pipe(
      catchError(_ => of([]))
    )
  }

  getMoviePageWithRespectToRatings$(pageNumber: number, order: number): Observable<MovieInfo[]> {
    return (this.http.get(`http://localhost:5000/movies/best?order=${order}&page_no=${pageNumber}`)) as Observable<MovieInfo[]>;
  }

  getMostSimilarMovies$(movieId: number, modelType: string, topn: number): Observable<MovieInfo[]>  {
    return (this.http.get(`http://localhost:5000/movies/${movieId}?topn=${topn}&modelType=${modelType}`)) as Observable<MovieInfo[]>;
  }

  getMovieDetails$(movieId: number, includePredictedRating = false): Observable<MovieDetailedInfo> {
    return (this.http.get(
      `http://localhost:5000/movieDetails/${movieId}?with_predicted_rating=${includePredictedRating ? 1 : 0}`
      )) as Observable<MovieDetailedInfo>;
  }
}
