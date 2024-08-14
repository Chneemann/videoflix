import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ErrorService } from '../../../../services/error.service';
import { BtnLargeComponent } from '../../../../shared/components/buttons/btn-large/btn-large.component';
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
    videoFile: '',
  };

  constructor(public errorService: ErrorService) {}

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  uploadMovieOverview() {
    this.toggleUploadMovieOverview.emit(false);
  }

  async onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid) {
      console.log('send');
    }
  }
}
