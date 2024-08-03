import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BtnLargeComponent } from '../../../shared/components/btn-large/btn-large.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, BtnLargeComponent, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  authData = {
    mail: '',
    password: '',
    passwordConfirm: '',
  };

  sendMailSuccess: boolean = false;
  queryEmail: boolean = false;
  queryEmailSuccess: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.authData.mail = params['mail'] || '';
      this.queryEmailSuccess = params['pw-change'] || '';
    });
  }

  isUserEmailValid(emailValue: string) {
    const emailRegex = /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailValue);
  }

  onSubmit(ngForm: NgForm, mailInput: any) {
    if (ngForm.submitted && ngForm.form.valid) {
      if (mailInput.name === 'mail') {
        ngForm.form.reset();
        this.sendMailSuccess = true;
      } else if (mailInput.name === 'password') {
        ngForm.form.reset();
        this.queryEmail = false;
        this.queryEmailSuccess = true;
      }
      console.log(this.authData);
    } else {
      mailInput.control.markAsTouched();
    }
  }
}
