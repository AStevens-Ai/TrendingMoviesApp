import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from 'src/app/services/movie.service';
import { environment } from 'src/environments/environment';

interface Movie {
  title: string;
  poster_path: string;
  genres: { id: number; name: string }[];
  tagline: string;
  budget: number;
  release_date: number;
  overview: string;
  adult: boolean;
  homepage: string;
}

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {
  movie: Movie | null = null;
  imageBaseUrl = environment.images;
  adult: boolean = false;

  constructor(private route: ActivatedRoute, private movieService: MovieService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.movieService.getMovieDetails(id).subscribe((res) => {
        console.log(res);
        this.movie = res as Movie;
      });
    }
  }

  openHomepage() {
    if (this.movie && this.movie.homepage) {
      window.open(this.movie.homepage);
    }
  }
}
