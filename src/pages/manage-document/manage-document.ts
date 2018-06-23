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
  
  docID      : string  = '';
  anatomias  : any     = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private fb: FormBuilder, private db: DatabaseProvider,
              private alert: AlertController) {
                
      this.form = fb.group({
        'nome'        : ['', Validators.required],
        'procedimento': ['', Validators.required],
        'anatomia_id' : ['', Validators.required],
        'ativo'       : ['', Validators.nullValidator],
        'resultado'   : ['']
      });

      this.preencherAnatomias();    

      this.teste = new TesteOrtopedico();
      this.teste.ativo = true;
      this.title = "Adicionar novo teste";
      
      if(navParams.data.isEdited) {
        this.title = "Alterar teste"
        this.isEditable = true;   
        let record = this.navParams.data.record.data;    
        this.docID = record.id;         
        this.teste.nome = record.nome;
        this.teste.procedimento = record.procedimento;
        this.teste.anatomia_id = record.anatomia_id;
        this.teste.ativo = record.ativo;
        this.teste.resultado = record.resultado;
      }
  }
  private preencherAnatomias() {
    this.db.getAnatomia().then(data => {
      this.anatomias = data;
    });
  }
  
  saveTeste(entity: TesteOrtopedico) {
    if(this.isEditable) {
      this.db.updateDocument(this.docID, entity)
        .then((data) => {
          this.clearForm();
          this.displayAlert('Sucesso', entity.nome + ' alterado com sucesso');
        })
        .catch((error) => {
          this.displayAlert('Erro', 'Alteração falhou: ' + error.message);
        });
    } else {
      this.db.addDocument(entity)
        .then((data) => {
          this.clearForm();
          this.displayAlert('Sucesso', entity.nome + ' inserido com sucesso');
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
    this.teste.anatomia_id = 0;

    this.title = "Adicionar novo teste";
    this.isEditable = false;
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
