import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll, LoadingController, IonContent } from '@ionic/angular';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
})
export class MoviesPage {
  movies: any[] = [];
  currentPage = 1;
  imageBaseUrl = environment.images;
  subscription!: Subscription;

  @ViewChild(IonContent, { static: true }) content!: IonContent;

  constructor(
    private movieService: MovieService,
    private loadingCtrl: LoadingController
  ) { }

  async ionViewDidEnter() {
    await this.loadMovies();
    this.setupScrollListener();
  }

  async loadMovies(event?: any) {
    const infiniteScroll = event ? event.target as IonInfiniteScroll : null;
    let loading: HTMLIonLoadingElement | null = null;

    if (!event) {
      loading = await this.loadingCtrl.create({
        message: 'Loading..',
        spinner: 'bubbles',
      });
      await loading.present();
    }

    this.subscription = this.movieService.getTopRatedMovies(this.currentPage).subscribe({
      next: (res) => {
        if (!event) {
          this.movies = res.results;
        } else {
          this.movies.push(...res.results);
        }

        if (infiniteScroll) {
          infiniteScroll.complete();
        }

        if (!event && loading) {
          loading.dismiss();
        }
      },
      error: (err) => {
        console.log(err);
        if (!event && loading) {
          loading.dismiss();
        }

        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      },
    });
  }

  async setupScrollListener() {
    this.content.ionScrollEnd.subscribe(async (event: any) => {
      const scrollElement = await this.content.getScrollElement();
      const scrollTop = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = scrollElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight) {
        this.loadMore(null);
      }
    });
  }

  loadMore(event: any) {
    this.currentPage++;
    this.loadMovies(event);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
