import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { DatabaseProvider, TesteOrtopedico } from '../../providers/database/database';
import { HomePage } from '../home/home';

@IonicPage({
  name: 'manage-document'
})
@Component({
  selector: 'page-manage-document',
  templateUrl: 'manage-document.html',
})

export class ManageDocumentPage {

  form       : any;
  records    : any;
  teste      : TesteOrtopedico;

  isEditable : boolean = false;
  title 		 : string	= '';
  
  colecao		 : string 	= 'teste-ortopedico';
  docID      : string  = '';
  anatomias  : any     = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private fb: FormBuilder, private db: DatabaseProvider,
              private alert: AlertController) {
                
      this.form = fb.group({
        'nome'        : ['', Validators.required],
        'procedimento': ['', Validators.required],
        'anatomia_id' : ['', Validators.required],
        'ativo'       : ['', Validators.nullValidator]
      });

      this.preencherAnatomias();    

      this.teste = new TesteOrtopedico();
      this.teste.ativo = true;
      this.title = "Adicionar novo teste";
      
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
  private preencherAnatomias() {
    this.db.getAnatomia().then(data => {
      this.anatomias = data;
    });
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

  clearForm(){
    this.teste = new TesteOrtopedico();
    this.teste.nome = "";
    this.teste.procedimento = "";
    this.teste.ativo = true;
    this.anatomias = [];
    this.title = "Adicionar novo teste";
    this.isEditable = false;
    this.preencherAnatomias();
  }

  backLista() {
    this.navCtrl.push(HomePage);
  }

  displayAlert(titulo: string, mensagem: string){
    let _alert : any = this.alert.create({
      title    : titulo,
      subTitle : mensagem,
      buttons  : [{
        text   : 'Voltar',
        handler: () => {
          this.backLista();
        }
      },
      {
        text   : 'Novo'
      }]
    });
    _alert.present();
  }

  
}
