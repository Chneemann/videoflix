import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BtnLargeComponent } from '../buttons/btn-large/btn-large.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  backToOverview(newMovies: any[]) {
    this.moviesChange.emit(newMovies);
  }

  async logout() {
    try {
      await this.authService.logout();
      localStorage.clear();
      sessionStorage.clear();
      this.router.navigate(['/']);
    } catch (error) {
      console.log(error);
    }
  }
}
