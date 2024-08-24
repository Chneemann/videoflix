import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BtnLargeComponent } from '../buttons/btn-large/btn-large.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [BtnLargeComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() browse: boolean = false;
  @Output() moviesChange = new EventEmitter<any[]>();

  constructor(private router: Router) {}

  backToOverview(newMovies: any[]) {
    this.moviesChange.emit(newMovies);
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
