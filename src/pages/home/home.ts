import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ManageDocumentPage } from '../manage-document/manage-document';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private colecao : string = "teste-ortopedico"
  private docID   : string = "Xy76Re34SdFR1"; 

  //Usado para armazenar / fornecer os dados do documento inicial para a coleta de banco de dados
  private entity   : any;
  //Propriedade para armazenar os documentos retornados da coleção de banco de dados
  private models    : any; 
  
  constructor(public navCtrl: NavController, private db: DatabaseProvider, private alert: AlertController) {
    this.entity = {
      nome: '',
      procedimento: '',
      ativo: '',
      anatomia_id: 0
    };
  }

  ionViewDidEnter(){
    this.retrieveCollection();
  }

  generateCollectionAndDocument(): void {
    this.db.createDocuments(this.colecao, this.docID, this.entity)
      .then((data: any) =>{
        console.dir(data);
      })
      .catch((error: any) => {
        console.dir(error);
      });
  }

  retrieveCollection() : void {
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

  addDocument() : void {
    this.navCtrl.push(ManageDocumentPage)
  }

  updateDocument(obj) : void {
    let params : any = {
      _collection: this.colecao,
      data: obj
    };

    this.navCtrl.push(ManageDocumentPage, { record : params, isEdited : true });
  }

  deleteDocument(obj) : void {
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
