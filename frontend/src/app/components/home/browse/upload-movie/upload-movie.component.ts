import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ErrorService } from '../../../../services/error.service';
import { BtnLargeComponent } from '../../../../shared/components/buttons/btn-large/btn-large.component';
import { MovieService } from '../../../../services/movie.service';

@Component({
  selector: 'app-upload-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, BtnLargeComponent],
  templateUrl: './upload-movie.component.html',
  styleUrl: './upload-movie.component.scss',
})
export class UploadMovieComponent {
  @Output() toggleUploadMovieOverview = new EventEmitter<boolean>();

  movieData = {
    title: '',
    description: '',
    filmGenre: '',
    videoFile: null as File | null,
    send: false,
  };

  constructor(
    public errorService: ErrorService,
    private movieService: MovieService
  ) {}

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  uploadMovieOverview() {
    this.toggleUploadMovieOverview.emit(false);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.movieData.videoFile = file;
    }
  }

  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      const formData = new FormData();
      formData.append('title', this.movieData.title);
      formData.append('description', this.movieData.description);
      formData.append('film_genre', this.movieData.filmGenre);
      if (this.movieData.videoFile) {
        formData.append('video_file', this.movieData.videoFile);
      }
      try {
        await this.movieService.uploadMovie(formData);
        this.movieData.send = true;
        setTimeout(() => {
          ngForm.resetForm();
          this.uploadMovieOverview();
          this.movieData.send = false;
          window.location.reload();
        }, 1000);
        this.errorService.clearError();
      } catch (error) {
        this.errorService.handleError(error);
      }
    }
  }
}
