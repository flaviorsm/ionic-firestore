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
  createDocuments(_collection: string, docID: string, entity: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
          .collection(_collection)
          .doc(docID)
          .set(entity, { merge: true })
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
          let obj: any = [];
          querySnapshot.forEach((doc: any) => {
            obj.push({
              id           : doc.id,
              nome         : doc.data().nomeTeste,
              procedimento : doc.data().procedimento,
              ativo        : doc.data().ativo,
              anatomia_id  : doc.data().ativo,
            });
          });
          resolve(obj);
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
  addDocument(_collection: string, entity: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection(_collection).add(entity)
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
  updateDocument(_collection: string, docID: string, entity: any) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection(_collection)
        .doc(docID)
        .update(entity)
        .then((obj: any) => {
          resolve(obj);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}
