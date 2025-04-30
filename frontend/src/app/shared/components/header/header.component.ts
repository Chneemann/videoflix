import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BtnLargeComponent } from '../buttons/btn-large/btn-large.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BtnLargeComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() showFullLogo: boolean = true;
  @Output() videosChange = new EventEmitter<any[]>();

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  /**
   * Emits the videosChange event with the newVideos array as the payload.
   * This is used to reset the videos displayed in the video-list component.
   * @param newVideos The new array of videos to be displayed.
   */
  backToOverview(newVideos: any[]) {
    this.videosChange.emit(newVideos);
  }

  /**
   * Logs out the user by calling the logout method of AuthService and clears the session using TokenService.
   * If an error occurs during the process, it is logged to the console.
   */
  async logout() {
    try {
      await this.authService.logout();
      this.tokenService.clearSession();
    } catch (error) {
      console.log(error);
    }
  }
}
