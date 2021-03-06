import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Firebase
import { environment } from '../environments/environment';
import firebase from 'firebase';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    firebase.firestore().enablePersistence()
      .then(() => {
        firebase.initializeApp(environment.firebase);
      })
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          console.log('Falha pré-condição' + err);
        } else if (err.code == 'unimplemented') {
          console.log('Não implementado' + err);;
        }
      });
    
  }
}

