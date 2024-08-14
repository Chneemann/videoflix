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
    if (!ngForm.submitted || !ngForm.form.valid) return;

    try {
      this.movieData.send = true;

      const formData = this.createFormData();
      const response = await this.movieService
        .uploadMovie(formData)
        .toPromise();
      const videoId = response.id;

      await this.waitForThumbnailCreation(videoId);

      ngForm.resetForm();
      this.uploadMovieOverview();
      this.movieData.send = false;
      window.location.reload();
      this.errorService.clearError();
    } catch (error) {
      this.errorService.handleError(error);
    }
  }

  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.movieData.title);
    formData.append('description', this.movieData.description);
    formData.append('film_genre', this.movieData.filmGenre);
    if (this.movieData.videoFile) {
      formData.append('video_file', this.movieData.videoFile);
    }
    return formData;
  }

  private async waitForThumbnailCreation(videoId: number) {
    while (true) {
      const statusResponse = await this.movieService
        .checkThumbnailStatus(videoId)
        .toPromise();
      if (statusResponse?.thumbnail_created) break;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}
