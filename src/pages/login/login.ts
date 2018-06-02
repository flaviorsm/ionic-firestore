import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  
  loginForm: FormGroup;
	loginError: string;
	versaoApp: string;

	constructor(private navCtrl: NavController, private fb: FormBuilder) {
		this.loginForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]			
		});
  }
  
  login() {
		let data = this.loginForm.value;

		if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password
		};
	}

	goToListarTestes() {
		this.navCtrl.push(HomePage);
	}
}
