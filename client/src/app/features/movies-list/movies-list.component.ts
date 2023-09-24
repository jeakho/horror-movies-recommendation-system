import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { MovieInfo } from 'src/app/types';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.css']
})
export class MoviesListComponent implements OnInit, OnDestroy {
  @Input() movies!: MovieInfo[] | null;
  @Output() onMovieSelected = new EventEmitter<MovieInfo>();
  @Output() onListEnd = new EventEmitter<void>();

  scroll$ = new Subject<Event>();
  scrollSubscription!: Subscription;

  onClick(movie: MovieInfo) {
    this.onMovieSelected.emit(movie);
  }

  handleScroll(event: Event) {
    const element = event.target as HTMLElement;
    const atBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;

    if (atBottom) {
      this.onListEnd.emit();
    }
  }

  ngOnInit() {
    this.scrollSubscription = this.scroll$.pipe(
      debounceTime(20),
    ).subscribe(this.handleScroll.bind(this))
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }
}
