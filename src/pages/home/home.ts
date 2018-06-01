import { Component } from '@angular/core';  
import { NavController, AlertController } from 'ionic-angular';
import { DatabaseProvider, TesteOrtopedico } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private colecao : string = "teste-ortopedico"
  private docID   : string = "Xy76Re34SdFR1"; 

  //Usado para armazenar / fornecer os dados do documento inicial para a coleta de banco de dados
  private entity: TesteOrtopedico;
  //Propriedade para armazenar os documentos retornados da coleção de banco de dados
  private models: any; 
  
  constructor(public navCtrl: NavController, private db: DatabaseProvider, private alert: AlertController) {}

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
    this.db.getDocuments(this.colecao)
      .then((data) => {
        if(data.length === 0){
          this.generateCollectionAndDocument();
        }
        else {
          this.models = data;
        }
      })
      .catch();
  }

  addDocument() {
    this.navCtrl.push('manage-document');
  }

  updateDocument(obj) {
    let params : any = {
      _collection: this.colecao,
      data: obj
    };

    this.navCtrl.push('manage-document', { record: params, isEdited: true });
  }

  deleteDocument(obj: any) {
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
}
