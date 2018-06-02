import { Component } from '@angular/core';  
import { NavController, AlertController } from 'ionic-angular';
import { DatabaseProvider, TesteOrtopedico } from '../../providers/database/database';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  models    : any = []
  anatomias : any = [];

  colecao   : string = "teste-ortopedico"
  docID     : string = "Xy76Re34SdFR1"; 
  entity    : TesteOrtopedico;
  
  constructor(public navCtrl: NavController, private db: DatabaseProvider, private alert: AlertController) {
    this.db.getAnatomia().then(data => {
      this.anatomias = data;
    });
  }

  ionViewDidEnter(){
    this.retrieveCollection();    
  }

  generateCollectionAndDocument() {
    this.db.createDocuments(this.colecao, this.docID, this.entity)
      .then((data: any) =>{
        console.dir(data);
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }

  retrieveCollection() {
    this.models = [];
    this.db.getDocuments(this.colecao)
      .then((data) => {
        if(data.length > 0) {
          this.models = data; 
        }
        else {
          //this.generateCollectionAndDocument();
        }
      })
      .catch();
  }


  removerTeste(obj: TesteOrtopedico) {
    this.db.deleteDocument(this.colecao, obj.id)
      .then((data: any) => {
        this.displayAlert('Sucesso', 'O teste ' + obj.nome + ' foi excluido com sucesso!');
      })
      .catch((error: any) =>{
        this.displayAlert('Erro', error.message);
      })
  }

  displayAlert(titulo: string, mensagem: string): void {
    let _alert : any = this.alert.create({
      title    : titulo,
      subTitle : mensagem,
      buttons  : [{
        text   : 'OK',
        handler: () => {
          this.retrieveCollection();
        }
      }]
    });
    _alert.present();
  }

  voltarPagina() {
    this.navCtrl.push(LoginPage);
  }
  
  addTeste() {
    this.navCtrl.push('manage-document');
  }

  editarTeste(obj: TesteOrtopedico) {
    let params : any = {
      _collection: this.colecao,
      data: obj
    };

    this.navCtrl.push('manage-document', { record: params, isEdited: true });
  }
}
