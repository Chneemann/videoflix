import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ErrorService } from '../../../services/error.service';
import { BtnLargeComponent } from '../../../shared/components/buttons/btn-large/btn-large.component';
import { VideoService } from '../../../services/video.service';
import { LoadingDialogComponent } from '../../../shared/components/loading-dialog/loading-dialog.component';
import { Video } from '../../../interfaces/video.interface';

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
  maxFileSizeMB = 20;

  videoData = {
    title: '',
    description: '',
    genre: '',
    file: null as File | null,
    send: false,
  };

  constructor(
    public errorService: ErrorService,
    private videoService: VideoService
  ) {}

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  closeVideoUploadOverview() {
    this.toggleUploadVideoOverview.emit(false);
  }

  onFileChange(event: any) {
    this.isOneFile(event);
    this.isFileSize(event);
  }

  isOneFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.videoData.file = file;
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
      this.videoData.send = true;
      const formData = this.createFormData();
      const uploaded = await this.videoService.uploadVideo(formData);

      this.uploadedVideo.emit(uploaded);

      ngForm.resetForm();
      this.closeVideoUploadOverview();
      this.videoData.send = false;
      this.errorService.clearError();
    } catch (error) {
      this.errorService.handleError(error);
    }
  }

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
