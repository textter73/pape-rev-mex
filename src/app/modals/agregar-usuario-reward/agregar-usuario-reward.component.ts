import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material/dialog";
import { CatalogoServices } from "src/app/services/catalogo.services";
import Swal from "sweetalert2";
import { AgregarCategoriaComponent } from "../agregar-categoria/agregar-categoria.component";
import { AgregarMarcaComponent } from "../agregar-marca/agregar-marca.component";
import { RewardsServices } from "src/app/services/rewards.services";

@Component({
  selector: 'app-agregar-usuario-reward',
  templateUrl: './agregar-usuario-reward.component.html',
  styleUrls: ['./agregar-usuario-reward.component.scss']
})
export class AgregarUsuarioRewardComponent implements OnInit {

  catalogoMarcasAux: any = [];
  catalogoMarcas: any = [];
  catalogoCategorias: any = [];
  catalogoCategoriasAux: any = [];
  options = [
    { name: '3%', value: 0.3 },
    { name: '4%', value: 0.4 },
    { name: '5%', value: 0.5 },
    { name: '6%', value: 0.6 },
    { name: '7%', value: 0.8 },
  ];
  checkoutForm: any;
  existe: Boolean = false;
  userData = '';

  getLocalStorage(): void {
    this.userData = `${localStorage.getItem("usuario")}`;
  }


  constructor(
    public dialogRef: MatDialogRef<AgregarUsuarioRewardComponent>,
    private _catalogoServices: CatalogoServices,
    private _rewardServices: RewardsServices,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.checkoutForm = this.formBuilder.group({
      nombre: new FormControl('', [Validators.required]),
      apellidoPaterno: new FormControl('', [Validators.required]),
      apellidoMaterno: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  validarDatos(): void {
    Swal.showLoading();
    let mensajes = '';
    let errores = false;

    if (this.checkoutForm.get('nombre').status === 'INVALID') {
      mensajes += `<p>-Campo nombre del usuario obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('apellidoPaterno').status === 'INVALID') {
      mensajes += `<p>-Campo Apellido Paterno del usuario obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('apellidoMaterno').status === 'INVALID') {
      mensajes += `<p>-Campo Apellido Materno del usuario obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('telefono').status === 'INVALID') {
      mensajes += `<p>-Campo Telefóno del usuario obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('password').status === 'INVALID') {
      mensajes += `<p>-Campo Contraseña obligatorio</p>`
      errores = true;
    }

    if (this.checkoutForm.get('password').value.length !== 4) {
      mensajes += `<p>-La contraseña debe estar conformada por 4 digitos</p>`
      errores = true;
    }

    if (errores) {
      Swal.close();
      Swal.fire({
        title: 'Oops...',
        icon: 'error',
        html: mensajes,
        confirmButtonText: 'Ok'
      })
    } else {
      this.guardarUsuario();
    }
  }

  guardarUsuario(): void {

    this._rewardServices.getUser(this.checkoutForm.get('telefono').value).subscribe((findUser: any) => {
      console.log(findUser);
      console.log('xxxxxxxxxxxxxxxxxx');
      if (findUser.length && findUser.length > 0) {
        Swal.close();
        Swal.fire({
          title: '!Error!',
          icon: 'error',
          text: 'Ya se encuentra el número registrado con otros usuario',
        });
      } else {
        let alta = new Date();
        let data = {
          id: 1,
          nombre: this.checkoutForm.get('nombre').value,
          apllPtrn: this.checkoutForm.get('apellidoPaterno').value,
          apllMtrn: this.checkoutForm.get('apellidoMaterno').value,
          activo: true,
          fechaAlta: alta,
          fechaModificacion: alta,
          usuarioCrea: this.userData,
          perfil: 1,
          telefono: this.checkoutForm.get('telefono').value,
          password: this.checkoutForm.get('password').value
        };

        this._rewardServices.saveUser(this.checkoutForm.get('telefono').value + '', data)
          .then(() => {
            Swal.close();
            Swal.fire({
              title: '!Éxito!',
              icon: 'success',
              text: 'Usuario guardado',
              confirmButtonText: 'Ok',
            })
              .then(result => {
                this.onNoClick();
              });
          }, (error) => {
            Swal.close();
            Swal.fire({
              title: '!Error!',
              icon: 'error',
              text: 'Ocurrió un error al guardar el artículo',
            });
          });
      }
    });

  }

  ngOnInit() {
    this.getLocalStorage();
    //this.getMarcas();
    //this.getCategorias();
    console.log('acaaaaaaaaaaaaaaa')
  }

  getMarcas(): void {
    this._catalogoServices.getMarcas().subscribe((listItems) => {
      this.catalogoMarcas = [];
      listItems.forEach((item) => {
        const marca = item.payload.doc.data();
        this.catalogoMarcas.push(marca);
      });
    });
  }

  filtrarMarca(value: any): any {
    const filterValue = this.RemoveAccents(value.target.value).toLowerCase();
    this.catalogoMarcasAux = this.catalogoMarcas.filter((option: any) => this.RemoveAccents(option.nombre).toLowerCase().includes(filterValue));
  }

  RemoveAccents(str: string): string {
    const accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    const accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
    const str1 = str.split('');
    const strLen = str.length;
    let i, x;
    for (i = 0; i < strLen; i++) {
      if ((x = accents.indexOf(str1[i])) !== -1) {
        str1[i] = accentsOut[x];
      }
    }
    return str1.join('');
  }

  filtrarCategoria(value: any): any {
    const filterValue = this.RemoveAccents(value.target.value).toLowerCase();
    this.catalogoCategoriasAux = this.catalogoCategorias.filter((option: any) => this.RemoveAccents(option.nombre).toLowerCase().includes(filterValue));
  }

  getCategorias(): void {
    this._catalogoServices.getCategorias().subscribe((listItems) => {
      this.catalogoCategorias = [];
      listItems.forEach((item) => {
        const marca = item.payload.doc.data();
        this.catalogoCategorias.push(marca);
      });

    });
  }

  onCodigo(codigo: any): void {
    let buscarCodigo = codigo.target.value;
    this.existe = false;
    this.data.items.forEach((item: any) => {
      if (item.codigo === buscarCodigo) {
        this.existe = true;
        Swal.fire({
          title: 'Oops...',
          icon: 'warning',
          html: `<b>${item.codigo} - ${item.nombre.toUpperCase()}</b> <br> !Este artículo ya se encuentra registrado! <br>`,
          confirmButtonText: 'Ok'
        })
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  nuevaCategoria(): void {
    const dialogRef = this.dialog.open(AgregarCategoriaComponent, {
      width: '500px',
      data: {
        items: this.catalogoCategorias
      }
    });
  }

  nuevaMarca(): void {
    const dialogRef = this.dialog.open(AgregarMarcaComponent, {
      width: '500px',
      data: {
        items: this.catalogoMarcas
      }
    });
  }

}
