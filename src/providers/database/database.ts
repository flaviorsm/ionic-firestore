import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

//Módulos Firebase e Firestore
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class DatabaseProvider {

  private  db      : any;
  readonly colecao : string = "teste-ortopedico";
  readonly pathJson: string = './assets/json/anatomia.json';

  constructor(public http: HttpClient) {
    this.db = firebase.firestore();
  }

  /**
   * Crie a coleção de banco de dados e defina um documento inicial
   * 'merge: true na promise' é necessário para garantir que a coleção 
   * não seja recriada repetidamente caso este método seja chamado novamente
   * @public
   * @method createDocuments
   * @param docID identificador do documento
   * @param entity A key / values do documento a serem adicionados
   */
  createDocuments(docID: string, entity: TesteOrtopedico) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
          .collection(this.colecao)
          .doc(docID)
          .set(Object.assign({}, entity), { merge: true })
          .then((entity: any) => {
            resolve(entity);
          })
          .catch((error: any) => {
            reject(error);
          })
    })
  }

  /**
   * Retorna documentos da coleção de banco de dados específica
   */
  getDocuments() : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(this.colecao)
        .get()
        .then((querySnapshot) => {
          let testes: TesteOrtopedico[] = [];
          querySnapshot.forEach((doc: any) => {
            let teste          = new TesteOrtopedico();
            teste.id           = doc.id;
            teste.nome         = doc.data().nome;
            teste.procedimento = doc.data().procedimento;
            teste.ativo        = doc.data().ativo;
            teste.anatomia_id  = doc.data().anatomia_id;
            teste.resultado    = doc.data().resultado;
            testes.push(teste);
          });
          resolve(testes);
        })
        .catch((error: any) => {
          reject(error);
        }); 
    });    
  }

  /**
   * Adiciona novo documento a coleção
   * @param entity A key / values do documento a serem adicionados
   */
  addDocument(entity: TesteOrtopedico) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(this.colecao)
        .add(Object.assign({}, entity))
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * Deleta documento por id na coleção
   * @param docID Identificador do documento
   */
  deleteDocument(docID: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(this.colecao)
        .doc(docID)
        .delete()
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  /**
   * 
   * @param docID Identificador do documento
   * @param entity A key / values do documento a serem adicionados
   */
  updateDocument(docID: string, entity: TesteOrtopedico) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(this.colecao)
        .doc(docID)
        .update(Object.assign({}, entity))
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
    
  getAnatomia() {
    return new Promise(resolve => {
      this.http.get(this.pathJson)
      .subscribe(data => {
        resolve(Object.keys(data).map(key => data[key]))
      }, err => {
        console.log(err);
      })
      
    });
  } 

}

export class TesteOrtopedico {
  id?         : string;
  nome        : string;
  procedimento: string;
  ativo       : boolean;
  anatomia_id : number; 
  resultado?  : string; 
}