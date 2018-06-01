import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { DatabaseProvider, TesteOrtopedico } from '../../providers/database/database';

@IonicPage({
  name: 'manage-document'
})
@Component({
  selector: 'page-manage-document',
  templateUrl: 'manage-document.html',
})

export class ManageDocumentPage {

  public form       : any;
  public records    : any;
  public teste      : TesteOrtopedico;

  public isEditable : boolean = false;
  public title 		  : string	= 'Adicionar novo teste';
  
  private colecao		: string 	= 'teste-ortopedico';
  private docID     : string  = '';
  public  anatomias : any     = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private fb: FormBuilder, private db: DatabaseProvider,
              private alert: AlertController) {

      this.form = fb.group({
        'nome'        : ['', Validators.required],
        'procedimento': ['', Validators.required],
        'anatomia_id' : ['', Validators.required],
        'ativo'       : ['', Validators.nullValidator]
      });

      this.db.getAnatomia().then(data => {
        this.anatomias = data;
      });
      
      this.teste = new TesteOrtopedico();

      if(navParams.data.isEdited) {
        this.title = "Alterar teste"
        this.isEditable = true;
        this.colecao = this.navParams.data.record._collection;   
        let record = this.navParams.data.record.data;    
        this.docID = record.id;         
        this.teste.nome = record.nome;
        this.teste.procedimento = record.procedimento;
        this.teste.anatomia_id = record.anatomia_id;
        this.teste.ativo = record.ativo;
      }
  }

  saveTeste(val: TesteOrtopedico) {
    // this.teste.anatomia_id  = this.form.controls["anatomia_id"].value;
    // this.teste.nome	       	= this.form.controls["nome"].value;
    // this.teste.procedimento = this.form.controls["procedimento"].value;
    // this.teste.ativo        = this.form.controls['ativo'].value;
  
    if(this.isEditable) {
      this.db.updateDocument(this.colecao, this.docID, val)
        .then((data) => {
          this.clearForm();
          this.displayAlert('Sucesso', val.nome + ' alterado com sucesso');
        })
        .catch((error) => {
          this.displayAlert('Erro', 'Alteração falhou: ' + error.message);
        });
    }
    else {
      this.db.addDocument(this.colecao, val)
        .then((data) => {
          this.clearForm();
          this.displayAlert('Sucesso', val.nome + ' inserido com sucesso');
        })
        .catch((error) => {
          this.displayAlert('Erro', 'Alteração falhou: ' + error.message);
        });
    }
  }

  displayAlert(titulo: string, mensagem: string): void {
    let _alert : any = this.alert.create({
      title    : titulo,
      subTitle : mensagem,
      buttons  : ['OK']
    });
    _alert.present();
  }

  clearForm(){
    this.teste = new TesteOrtopedico();
  }
}
