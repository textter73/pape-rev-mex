import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-resumen-compras',
  templateUrl: './resumen-compras.component.html',
  styleUrls: ['./resumen-compras.component.scss']
})
export class ResumenComprasComponent  implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ResumenComprasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.data.cantidadRecibida = '';
  }

  onNoClick(): void {
    this.dialogRef.close({pagar: false});
  }

  pagar(): void {
    this.dialogRef.close({pagar: true});
  }

  onKeypressEvent() {
    this.data.cantidadCambio = (+this.data.cantidadRecibida - +this.data.totalCarrito);
  }
}
