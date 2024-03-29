import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoginServices {
    constructor(
        private firestore: AngularFirestore
    ) {}
    
    async login(usuario: any, password: any) {
        return await this.firestore.collection('usuarios').snapshotChanges();
    }
}