import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { HeroBannerComponent } from './hero-banner/hero-banner.component';
import { CategoriesComponent } from './categories/categories.component';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [HeaderComponent, HeroBannerComponent, CategoriesComponent],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
  movies = [
    {
      id: 1,
      title: 'Our Galaxy',
      description:
        'Experience the fascinating journey through the infinite expanse of our galaxy. "Our Galaxy" offers a detailed insight into the breathtaking structures, stars and planets of our cosmic home. Through stunning visual effects and comprehensive explanations, this documentary guides viewers through the mysteries of the universe and reveals the beauty and complexity of outer space. Perfect for astronomy lovers and the curious who want to learn more about the wonders of the universe',
      category: 'documentation',
      imgPath: 'galaxy.png',
      videoPath: 'galaxy.mp4',
    },
  ];
  currentMovie: any[] = [];

  ngOnInit(): void {
    this.currentMovie.length === 0 ? this.loadRandomMovie() : null;
  }

  loadRandomMovie(): void {
    const randomIndex = Math.floor(Math.random() * this.movies.length);
    this.currentMovie = [this.movies[randomIndex]];
  }

  currentMovieId(movieId: number) {
    let index = this.movies.findIndex((movie) => movie.id === movieId);
    if (index !== -1) {
      this.currentMovie = [];
      this.currentMovie.push(this.movies[index]);
    }
  }
}
