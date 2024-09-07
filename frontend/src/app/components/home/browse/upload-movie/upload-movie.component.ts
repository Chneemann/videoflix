import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ErrorService } from '../../../../services/error.service';
import { BtnLargeComponent } from '../../../../shared/components/buttons/btn-large/btn-large.component';
import { MovieService } from '../../../../services/movie.service';
import { LoadingDialogComponent } from '../../../../shared/components/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-upload-movie',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BtnLargeComponent,
    LoadingDialogComponent,
  ],
  templateUrl: './upload-movie.component.html',
  styleUrl: './upload-movie.component.scss',
})
export class UploadMovieComponent {
  @Output() toggleUploadMovieOverview = new EventEmitter<boolean>();
  errorMsgFileSize: string | null = null;
  maxFileSizeMB = 50;

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

  closeMovieUploadOverview() {
    this.toggleUploadMovieOverview.emit(false);
  }

  onFileChange(event: any) {
    this.isOneFile(event);
    this.isFileSize(event);
  }

  isOneFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.movieData.videoFile = file;
    }
  }
  isFileSize(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > this.maxFileSizeMB) {
        this.errorMsgFileSize = `The file must not be larger than ${this.maxFileSizeMB} MB.`;
        event.target.value = '';
      } else {
        this.errorMsgFileSize = null;
      }
    }
  }

  async onSubmit(ngForm: NgForm) {
    if (!ngForm.submitted || !ngForm.form.valid) return;

    try {
      this.movieData.send = true;
      let formData = this.createFormData();
      await this.movieService.uploadMovie(formData);
      ngForm.resetForm();
      this.closeMovieUploadOverview();
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
}
