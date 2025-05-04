import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ErrorService } from '../../../services/error.service';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { VideoService } from '../../../services/video.service';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';
import { Video } from '../../../interfaces/video.interface';
import { GenreService } from '../../../services/genre.service';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BtnLargeComponent,
    LoadingDialogComponent,
  ],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.scss',
})
export class UploadVideoComponent {
  @Output() toggleUploadVideoOverview = new EventEmitter<boolean>();
  @Output() uploadedVideo = new EventEmitter<Video>();

  errorMsgFileSize: string | null = null;
  readonly maxFileSizeMB = 20;

  videoData = {
    title: '',
    description: '',
    genre: '',
    file: null as File | null,
    send: false,
  };

  genres$ = this.genreService.getGenres();

  /**
   * Initializes the HomeComponent with the ErrorService, VideoService and GenreService.
   */
  constructor(
    public errorService: ErrorService,
    private videoService: VideoService,
    private genreService: GenreService
  ) {}

  /**
   * Stops event propagation for click events
   * @param event MouseEvent
   */
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * Close the video upload overview when the user decides
   */
  closeVideoUploadOverview(): void {
    this.toggleUploadVideoOverview.emit(false);
  }

  /**
   * Handles file input changes. Checks for single file selection and file size validation.
   * @param event File input change event
   */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.isOneFile(input);
      this.isFileSize(input);
    }
  }

  /**
   * Validates that only one file is selected
   * @param input File input element
   */
  private isOneFile(input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (file) {
      this.videoData.file = file;
    }
  }

  /**
   * Validates the size of the selected file
   * @param input File input element
   */
  private isFileSize(input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > this.maxFileSizeMB) {
        this.errorMsgFileSize = `The file must not be larger than ${this.maxFileSizeMB} MB.`;
        input.value = '';
      } else {
        this.errorMsgFileSize = null;
      }
    }
  }

  /**
   * Handles the video upload form submission.
   * @param ngForm The video upload form
   */
  async onSubmit(ngForm: NgForm): Promise<void> {
    if (ngForm.submitted && ngForm.form.valid) {
      try {
        this.videoData.send = true;
        const uploadedVideo = await this.videoService.uploadVideo(
          this.createFormData()
        );
        this.uploadedVideo.emit(uploadedVideo);
        ngForm.resetForm();
        this.closeVideoUploadOverview();
        this.errorService.clearError();
      } catch (error) {
        this.errorService.handleError(error);
      } finally {
        this.videoData.send = false;
      }
    }
  }

  /**
   * Creates a FormData object containing the video data.
   * @returns The FormData for the video upload
   */
  private createFormData(): FormData {
    const formData = new FormData();
    formData.append('title', this.videoData.title);
    formData.append('description', this.videoData.description);
    formData.append('genre', this.videoData.genre);
    if (this.videoData.file) {
      formData.append('file_path', this.videoData.file);
    }
    return formData;
  }
}
