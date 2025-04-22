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
  @Output() moviesChange = new EventEmitter<any[]>();

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  backToOverview(newMovies: any[]) {
    this.moviesChange.emit(newMovies);
  }

  async logout() {
    try {
      await this.authService.logout();
      this.tokenService.clearSession();
    } catch (error) {
      console.log(error);
    }
  }
}
