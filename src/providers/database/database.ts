import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

//Módulos Firebase e Firestore
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class DatabaseProvider {

  private db : any;

  constructor(public http: HttpClient) {
    this.db = firebase.firestore();
  }

  /**
   * Crie a coleção de banco de dados e defina um documento inicial
   * 'merge: true na promise' é necessário para garantir que a coleção 
   * não seja recriada repetidamente caso este método seja chamado novamente
   * @public
   * @method createDocuments
   * @param _collection Coleção no Firestore que irá criar
   * @param docID identificador do documento
   * @param entity A key / values do documento a serem adicionados
   */
  createDocuments(_collection: string, docID: string, entity: TesteOrtopedico) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
          .collection(_collection)
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
   * @param _collection Coleção no Firestore
   */
  getDocuments(_collection: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(_collection)
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
   * @param _collection Coleção no Firestore
   * @param entity A key / values do documento a serem adicionados
   */
  addDocument(_collection: string, entity: TesteOrtopedico) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(_collection)
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
   * @param _collection Coleção no Firestore 
   * @param docID Identificador do documento
   */
  deleteDocument(_collection: string, docID: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(_collection)
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
   * @param _collection Coleção no Firestore
   * @param docID Identificador do documento
   * @param entity A key / values do documento a serem adicionados
   */
  updateDocument(_collection: string, docID: string, entity: TesteOrtopedico) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(_collection)
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
  
  private end: string = '../assets/anatomia.json'  
  getAnatomia() {
    return new Promise(resolve => {
      this.http.get(this.end)
      .subscribe(data => {
        resolve(Object.keys(data).map(key => data[key]))
      }, err => {
        console.log(err);
      })
      
    });
  } 

}

export class TesteOrtopedico {
  id?: string;
  nome: string;
  procedimento: string;
  ativo: boolean;
  anatomia_id: number; 
}