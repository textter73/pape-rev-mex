import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class RewardsServices {

  constructor(
    private firestore: AngularFirestore
  ) {}

  saveUser(id: any, data: any) {
    return this.firestore.collection('userRewards/').doc(id).set(data);
  }

  getUser(number: any) {
    return this.firestore.collection(`userRewards/`).doc(number).valueChanges();
  }

}
