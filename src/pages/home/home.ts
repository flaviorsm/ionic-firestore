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
    this.entity = new TesteOrtopedico();
    this.entity.nome = 'Teste Dev';
    this.entity.procedimento = 'Procedimento dev';
    this.entity.ativo = false;
    this.entity.anatomia_id = 1;

    this.db.createDocuments(this.docID, this.entity)
      .then((data: any) =>{
        console.dir(data);
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }

  retrieveCollection() {
    this.models = [];
    this.db.getDocuments()
      .then((data) => {
        if(data.length > 0) {
          this.models = data; 
        }
        else {
          this.generateCollectionAndDocument();
        }
      })
      .catch();
  }


  removerTeste(obj: TesteOrtopedico) {
    this.db.deleteDocument(obj.id)
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
      data: obj
    };

    this.navCtrl.push('manage-document', { record: params, isEdited: true });
  }
}
