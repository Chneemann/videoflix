import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ErrorService } from '../../../services/error.service';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { VideoService } from '../../../services/video.service';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';
import { Video } from '../../../interfaces/video.interface';
import { GenreService } from '../../../services/genre.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';

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
  uploadProgress: number | null = null;

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
   * Initializes the UploadVideoComponent with the ErrorService, VideoService and GenreService.
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
   * Handles form submission by validating the form and uploading the video.
   * @param ngForm - The submitted Angular form
   */
  async onSubmit(ngForm: NgForm): Promise<void> {
    if (ngForm.submitted && ngForm.form.valid) {
      this.videoData.send = true;
      this.uploadProgress = 0;

      this.videoService
        .uploadVideoWithProgress(this.createFormData())
        .subscribe({
          next: (event) => this.handleUploadEvent(event, ngForm),
          error: (err) => this.handleUploadError(err),
        });
    }
  }

  /**
   * Handles upload progress and response events.
   * @param event - The HTTP event from the upload observable
   * @param ngForm - The form instance used for resetting after upload
   */
  private handleUploadEvent(event: HttpEvent<any>, ngForm: NgForm): void {
    if (event.type === HttpEventType.UploadProgress && event.total) {
      this.uploadProgress = Math.round(100 * (event.loaded / event.total));
    } else if (event.type === HttpEventType.Response) {
      this.uploadedVideo.emit(event.body);
      ngForm.resetForm();
      this.closeVideoUploadOverview();
      this.errorService.clearError();
      this.uploadProgress = null;
      this.videoData.send = false;
    }
  }

  /**
   * Handles upload errors and resets UI state.
   * @param err - The error from the upload observable
   */
  private handleUploadError(err: unknown): void {
    if (err instanceof HttpErrorResponse) {
      this.errorService.handleError(err);
    } else {
      console.error('An unknown error occurred during upload:', err);
    }
    this.uploadProgress = null;
    this.videoData.send = false;
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
