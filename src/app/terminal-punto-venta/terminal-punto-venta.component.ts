import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import * as moment from 'moment/moment';
import { CatalogoServices } from 'src/app/services/catalogo.services';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from "@angular/material/dialog";
import { ResumenComprasComponent } from '../modals/resumen-compras/resumen-compras.component';
import { VentasServices } from '../services/ventas.services';
import { ExcelServices } from '../services/excel.services';
import { ExcelVentasServices } from '../services/excelVentas.serices';
import { MatSort } from '@angular/material/sort';
import { ResumenTurnoComponent } from '../modals/resumen-turno/resumen-turno.component';
import { ResumenDiaComponent } from '../modals/resumen-dia/resumen-dia.component';
import { SeleccionarArticuloComponent } from '../modals/seleccionar-articulo/seleccionar-articulo.component';
import { LaminasComponent } from '../modals/laminas/laminas.component';
import 'animate.css';
import { RegistrarArticuloComponent } from '../modals/registrar-articulo/registrar-articulo.component';
import { AgregarStockComponent } from '../modals/agregar-stock/agregar-stock.component';
import { ModificarArticuloUsuarioComponent } from '../modals/modificar-articulo-usuario/modificar-articulo-usuario.component';
import { CerrarCajaComponent } from '../modals/cerrar-caja/cerrar-caja.component';
import { AgregarUsuarioRewardComponent } from '../modals/agregar-usuario-reward/agregar-usuario-reward.component';

@Component({
    selector: 'app-terminal-punto-venta',
    templateUrl: './terminal-punto-venta.component.html',
    styleUrls: ['./terminal-punto-venta.component.scss']
})
export class TerminalPuntoVentaComponent implements OnInit, AfterViewInit {
    @ViewChild(MatSort) sort: MatSort;

    value = '';
    itemsListAux: any = [];
    itemsList: any = [];
    principalList: any = [];
    userData = '';
    profile = 0;
    isLoading = true;
    fechaActual: String = '';
    infoPreview: any = {};
    displayedColumnsSalesList: string[] = ['number', 'items', 'quantity', 'amount', 'vendor' ,'saleDay', 'actions'];


    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    options = [
        { id: 1, itemName: 'Espiral 250 hojas', branch: 'Espiraflex', quantityAvailable: 0, saleAmount: 2, category: 'DULCE' },
        { id: 2, itemName: 'Silicon Liquido', branch: 'Pelikan', quantityAvailable: 2, saleAmount: 2, category: 'DULCE' },
        { id: 3, itemName: 'Escaneo de documentos', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
        { id: 4, itemName: 'Prit', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
        { id: 5, itemName: 'Lapiz', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
        { id: 6, itemName: 'Goma', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
    ];
    itemList = [
        { id: 1, itemName: 'Espiral 250 hojas', branch: 'Espiraflex', quantityAvailable: 0, saleAmount: 2, category: 'DULCE' },
        { id: 2, itemName: 'Silicon Liquido', branch: 'Pelikan', quantityAvailable: 2, saleAmount: 2, category: 'DULCE' },
        { id: 3, itemName: 'Escaneo de documentos', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
        { id: 4, itemName: 'Prit', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'RECARGA' },
        { id: 5, itemName: 'Lapiz', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
        { id: 6, itemName: 'Goma', branch: 'Servicio', quantityAvailable: 2, saleAmount: 2, category: 'LAPIZ' },
    ];

    myControl = new FormControl('');
    filteredOptions: Observable<any[]>;
    dataSource = new MatTableDataSource<any>();

    carShop: any = [];
    totalAmountCar: any = 0;

    listaVentasHoy: any = [];

    existeCaja = false;
    totalVentas = 0;
    cajaCerrada = false;
    panelOpenState = false;
    dineroEnCaja = 0;
    totalPapeleria = 0;
    totalRecargas = 0;
    totalDulce = 0;
    dataSourceVentasHoy: MatTableDataSource<any>;

    candyLits: any = [];
    rechargeLits: any = [];
    isLoadingSales = false;
    contadorArticulos: any = 0;

    getLocalStorage(): void {
        this.userData = `${localStorage.getItem("usuario")}`;
        this.profile = parseInt(`${localStorage.getItem("perfil")}`);
        this.cdr.detectChanges();
    }

    /********* RELOJ */

    /**VARIABLES DEL FLUJO */
    constructor(
        private router: Router,
        private _catalogoServices: CatalogoServices,
        private _ventasServices: VentasServices,
        private _excelServices: ExcelServices,
        private _excelVentasServices: ExcelVentasServices,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) {
        const fecha = new Date();
        const añoActual = fecha.getFullYear();
        const hoy = fecha.getDate();
        const mesActual = fecha.getMonth() + 1;
        const formatHoy = hoy < 10 ? '0' + hoy : hoy;

        this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
    }

    private _filter(value: any): any {
        if (value && value.length && value.length > 3 && value !== ' ') {
            const filterValue = value.toLowerCase();

            return this.options.filter(option => option['itemName'].toLowerCase().includes(filterValue));
        }
    }

    ngOnInit(): void {
        this.getLocalStorage();

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );

        this.existeVenta();

        this.dataSource = new MatTableDataSource<any>([
            { id: 1, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 2, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 3, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 4, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 5, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 6, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 7, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 8, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 9, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 10, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 11, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 12, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 13, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 14, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' },
            { id: 15, itemName: '', branch: '', quantityAvailable: 0, saleAmount: 0, categroy: '' }
        ]);

        this.existBox();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    existBox(): void {
    
        this._ventasServices.verificaCaja(this.fechaActual).subscribe((sales: any) => {
            if (sales === undefined) {
                this.existeCaja = false;
                this.isLoading = false;
            } else if (sales['cajaAbierta']) {
                this.existeCaja = true;
                this.dineroEnCaja = sales['caja'];
                this.getCatalog();
            } else {
                this.existeCaja = false;
                this.cajaCerrada = true;
                this.isLoading = false;
            }
        });

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    getCatalog(): void {
        this.isLoading = true;
        this._catalogoServices.getCatalogV2().subscribe((listItems: any) => {

            this.itemsList = [];
            let temporal: any[] = [];
            listItems.forEach((item: any) => {
                temporal.push(item);
            });

            let activos = [];
            for (const item of temporal) {
                if (item.activo) {
                    activos.push({
                        id: +item.id,
                        itemName: item.nombre,
                        branch: item.marca,
                        quantityAvailable: +item.cantidad,
                        saleAmount: item.costoPublico,
                        category: item.categoria,
                        ...item
                    })
                }
            }

            this.itemsList = activos.slice();
            this.itemList = activos.slice();
            this.options = activos.slice();

            let temporalCandy: any = [];

            this.candyLits = [];
            this.rechargeLits = [];

            for (let item of activos) {
                if (item.category.toUpperCase() === 'DULCE') {
                    temporalCandy.push(item);
                }
    
                if (item.category.toUpperCase() === 'RECARGA') {
                    this.rechargeLits.push(item);
                }
            }

            setTimeout(() => {
                this.candyLits = temporalCandy.sort(function(a: any, b: any){
                    if(a.itemName+'' < b.itemName+'') { return -1; }
                    if(a.itemName+'' > b.itemName+'') { return 1; }
                    return 0;
                })
            }, 1000);

            this.filteredOptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
            );
            this.isLoading = false;
        });
    }

    existeVenta(): void {
        this._ventasServices.ventasHoy(this.fechaActual).subscribe((ventas) => {
            this.listaVentasHoy = [];
            let listaVentasTemporal: any = [];
            let sortList = [];
            if (ventas && ventas.length > 0) {
                for (const item of ventas) {
                    listaVentasTemporal.push(item);
                }
                sortList = [];
                for (const item of listaVentasTemporal) {
                    sortList.push({
                        ...item,
                        orden: parseInt(item.order)
                    });
                }
                this.listaVentasHoy = [];
                this.listaVentasHoy = sortList.sort(({ orden: b }, { orden: a }) => a - b);
                this.sumaTotal();
            }

        });
    }

    sumaTotal(): void {
        this.totalVentas = 0;
        this.totalRecargas = 0;
        this.totalPapeleria = 0;
        this.totalDulce = 0;
        for (const item of this.listaVentasHoy) {
            this.totalVentas += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));

            if (item.categoria && item.categoria.toUpperCase() === 'RECARGA') {
                this.totalRecargas += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
            } else if (item.categoria && item.categoria.toUpperCase() === 'DULCE') {
                this.totalDulce += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
            } else {
                this.totalPapeleria += (parseFloat(item.costoPublico) * (parseFloat(item.cantidadVendida)));
            }
        }

        this.dataSourceVentasHoy = new MatTableDataSource<any>(this.listaVentasHoy);

    }

    productSelected(item: any): any {
        let findInex = this.carShop.findIndex((x: any) => +x.id === +item.option.value['id']);
        this.dataSource = new MatTableDataSource<any>([]);
        if (findInex < 0) {
            if (+item.option.value['quantityAvailable'] > 0) {
                this.carShop.push({
                    quantity: 1,
                    subtotal: (1 * item.option.value['saleAmount']),
                    category: item.categoria,
                    ...item.option.value
                });
                
                this.infoPreview = {
                    quantity: 1,
                    subtotal: (1 * item.option.value['saleAmount']),
                    category: item.categoria,
                    ...item.option.value
                };
                this.dataSource = new MatTableDataSource<any>(this.carShop);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 2000
                })
                this.dataSource = new MatTableDataSource<any>(this.carShop);
            }

        } else {
            if (+this.carShop[findInex]['quantityAvailable'] !== +this.carShop[findInex]['quantity']) {
                this.carShop[findInex]['quantity'] = +this.carShop[findInex]['quantity'] + 1;
                this.carShop[findInex]['subtotal'] = (+this.carShop[findInex]['quantity'] * +this.carShop[findInex]['saleAmount']);
                this.infoPreview = {
                    subtotal: (1 * item.option.value['saleAmount']),
                    category: item.categoria,
                    ...item.option.value
                };
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
            this.dataSource = new MatTableDataSource<any>(this.carShop);
        }
        this.myControl.setValue('');

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );

        this.calculateTotalAmount();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    calculateTotalAmount(): any {
        this.totalAmountCar = 0;
        for (const item of this.carShop) {
            this.totalAmountCar += item['subtotal'];
        }
    }

    addItem(findInex: any): any {
        this.dataSource = new MatTableDataSource<any>([]);
        
        if (+this.carShop[findInex]['quantityAvailable'] !== +this.carShop[findInex]['quantity']) {
            this.carShop[findInex]['quantity'] = +this.carShop[findInex]['quantity'] + 1;
            this.carShop[findInex]['subtotal'] = (+this.carShop[findInex]['quantity'] * +this.carShop[findInex]['saleAmount']);
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Sin stock',
                showConfirmButton: false,
                timer: 2000
            })
        }
        this.dataSource = new MatTableDataSource<any>(this.carShop);
        this.calculateTotalAmount();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    removedItem(findInex: any): any {
        this.dataSource = new MatTableDataSource<any>([]);
        if (+this.carShop[findInex]['quantity'] > 0) {
            this.carShop[findInex]['quantity'] = +this.carShop[findInex]['quantity'] - 1;
            this.carShop[findInex]['subtotal'] = (+this.carShop[findInex]['quantity'] * +this.carShop[findInex]['saleAmount']);

            if (this.carShop[findInex]['quantity'] === 0) {
                this.carShop.splice(findInex, 1);
            }
        } else {
            this.carShop.splice(findInex, 1);
        }
        this.dataSource = new MatTableDataSource<any>(this.carShop);
        this.calculateTotalAmount();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    openBox(abrirCaja: any): void {
        const fecha = new Date();
        const añoActual = fecha.getFullYear();
        const hoy = fecha.getDate();
        const mesActual = fecha.getMonth() + 1;
        const formatHoy = hoy < 10 ? '0' + hoy : hoy;

        this.fechaActual = formatHoy + '' + mesActual + '' + añoActual;
        let fechaInicio = new Date();

        let dineroCaja = 0;
        if (!this.cajaCerrada && abrirCaja) {
            Swal.fire({
                title: 'Dinero en caja',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                showLoaderOnConfirm: true,
            }).then((result) => {
                if (result.isConfirmed && result.value.length > 0) {
                    dineroCaja = result.value
                    this.dineroEnCaja = dineroCaja;
                    let data = {
                        fechaInicio: fechaInicio,
                        caja: dineroCaja,
                        totalVentas: this.totalVentas,
                        papeleria: this.totalPapeleria,
                        recargas: this.totalRecargas,
                        activo: true,
                        usuario: this.userData,
                        contado: false,
                        cajaAbierta: true
                    };

                    this._ventasServices.abrirCaja(this.fechaActual, data)
                        .then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Excelente turno',
                                showConfirmButton: false,
                                timer: 4000
                            })
                        }, (error) => {
                            Swal.fire({
                                title: '!Error!',
                                icon: 'error',
                                text: 'Ocurrió un error al guardar la venta',
                            });
                        });
                }
            })

        } else {
            let data = {
                cajaAbierta: abrirCaja,
                totalVentas: this.totalVentas,
                papeleria: this.totalPapeleria,
                recargas: this.totalRecargas,
            };
            this._ventasServices.abrirCajaNuevamente(this.fechaActual, data)
                .then(() => {
                    if (abrirCaja) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Excelente turno',
                            showConfirmButton: false,
                            timer: 4000
                        })
                    } else {
                        this.cerrarCajaEvent();
                        /**let cont = 0;
                        let excelPapeleria: any = [];
                        let excelRecargas: any = [];
                        let excelDulces: any = [];
                        for (const row of this.listaVentasHoy) {
                            cont++
                            if (row.categoria && row.categoria.toUpperCase() === 'RECARGA') {
                                excelRecargas.push({
                                    '#': cont,
                                    'Usuario': row.vendedor,
                                    'Articulo': row.nombre,
                                    'Cantidad': row.cantidadVendida,
                                    'Costo': (row.cantidadVendida * row.costoPublico),
                                });
                            } else if (row.categoria && row.categoria.toUpperCase() === 'DULCE') {
                                excelDulces.push({
                                    '#': cont,
                                    'Usuario': row.vendedor,
                                    'Articulo': row.nombre,
                                    'Cantidad': row.cantidadVendida,
                                    'Costo': (row.cantidadVendida * row.costoPublico),
                                });
                            } else {
                                excelPapeleria.push({
                                    '#': cont,
                                    'Usuario': row.vendedor,
                                    'Articulo': row.nombre,
                                    'Cantidad': row.cantidadVendida,
                                    'Costo': (row.cantidadVendida * row.costoPublico),
                                });
                            }

                        }
                        this._excelVentasServices.exportAsExcelFile(excelPapeleria, excelRecargas, excelDulces, this.fechaActual + '_' + this.userData);
                        const dialogRef = this.dialog.open(ResumenTurnoComponent, {
                            data: {
                                caja: (this.dineroEnCaja) * 1,
                                papeleria: this.totalPapeleria,
                                recargas: this.totalRecargas,
                                subtotal: (this.totalPapeleria + this.totalRecargas),
                                total: this.totalVentas,
                                dulce: this.totalDulce
                            }
                        });

                        dialogRef.afterClosed().subscribe(result => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Gracias',
                                showConfirmButton: false,
                                timer: 4000
                            })
                        })*/
                    }

                }, (error) => {
                    Swal.fire({
                        title: '!Error!',
                        icon: 'error',
                        text: 'Ocurrió un error al guardar la venta',
                    });
                });
        }
        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    cerrarCajaEvent(): void {
        let cont = 0;
        let excelRecargas = [];
        let excelDulces = [];
        let excelPapeleria = [];

        let totalPapeleria = 0;
        let totalDulce = 0;
        let totalRecargas = 0;

        for (const row of this.listaVentasHoy) {
            cont++
            if (row.categoria && row.categoria.toUpperCase() === 'RECARGA') {
                excelRecargas.push(row);
                totalRecargas += (row.cantidadVendida * row.costoPublico);
            } else if (row.categoria && row.categoria.toUpperCase() === 'DULCE') {
                excelDulces.push(row);
                totalDulce += (row.cantidadVendida * row.costoPublico);
            } else {
                excelPapeleria.push(row);
                totalPapeleria += (row.cantidadVendida * row.costoPublico);
            }

        }

        const dialogRef = this.dialog.open(CerrarCajaComponent, {
            width: '90%',
            data: {
                papeleria: excelPapeleria,
                totalPapeleria: totalPapeleria,
                recargas: excelRecargas,
                totalRecargas: totalRecargas,
                dulces: excelDulces,
                totalDulce: totalDulce,
                totalCaja: this.dineroEnCaja ? this.dineroEnCaja : 0
            },
        });
    } 

    cerrarDia(): any {
        let cont = 0;
        let excelRecargas = [];
        let excelDulces = [];
        let excelPapeleria = [];

        let totalPapeleria = 0;
        let totalDulce = 0;
        let totalRecargas = 0;

        for (const row of this.listaVentasHoy) {
            cont++
            if (row.categoria && row.categoria.toUpperCase() === 'RECARGA') {
                excelRecargas.push(row);
                totalRecargas += (row.cantidadVendida * row.costoPublico);
            } else if (row.categoria && row.categoria.toUpperCase() === 'DULCE') {
                excelDulces.push(row);
                totalDulce += (row.cantidadVendida * row.costoPublico);
            } else {
                excelPapeleria.push(row);
                totalPapeleria += (row.cantidadVendida * row.costoPublico);
            }

        }

        const dialogRef = this.dialog.open(ResumenDiaComponent, {
            width: '90%',
            data: {
                papeleria: excelPapeleria,
                totalPapeleria: totalPapeleria,
                recargas: excelRecargas,
                totalRecargas: totalRecargas,
                dulces: excelDulces,
                totalDulce: totalDulce,
                totalCaja: this.dineroEnCaja ? this.dineroEnCaja : 0
            },
        });
    }

    exportarExcel(): void {
        const excel: any = [];
        let cont = 0;
        for(const item of this.listaVentasHoy) {
          cont++;
          excel.push({
            '#': cont,
            'Fecha': this.fechaActual,
            'Articulo': item.nombre,
            'Cantidad': item.cantidadVendida,
            'Costo': (item.cantidadVendida * item.costoPublico),
            'Fecha venta': item.fechaVenta,
            'Usuario': item.vendedor
          });
        }
        this._excelServices.exportAsExcelFile(excel,this.fechaActual+'');
    }

    async anotarImpresiones(): Promise<void> {
        const { value: cantidad } = await Swal.fire({
            title: '',
            input: 'number',
            inputLabel: 'Costo de las impresiones',
        });
        if (cantidad > 0) {
            this.carShop.push(
                {
                    id: 11,
                    itemName: 'Impresiones',
                    branch: 'impresiones',
                    quantityAvailable: 1000,
                    category: "impresiones",
                    saleAmount: 1,
                    quantity: +cantidad,
                    subtotal: +cantidad,
                    marca: '',
                    imagen: 'https://openclipart.org/image/800px/339926'
                },
            );
        }

        this.dataSource = new MatTableDataSource<any>(this.carShop);

        this.calculateTotalAmount();
        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    showItemList(term: any): any {
        let temporalList: any = [];

        for (let item of this.itemsList) {
            if (item.category.toUpperCase() === term.toUpperCase()) {
                temporalList.push(item);
            }
        }

        
        let temporalListOrder = temporalList.sort(function(a: any, b: any){
            if(a.branch.toUpperCase()+'' < b.branch.toUpperCase()+'') { return -1; }
            if(a.branch.toUpperCase()+'' > b.branch.toUpperCase()+'') { return 1; }
            return 0;
        })
        

        const dialogRef = this.dialog.open(SeleccionarArticuloComponent, {
            width: '600px',
            data: {
                candyList: temporalListOrder,
                title: term
            },
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result['data'].length > 0) {
                for (let article of result['data']) {
                    this.saveCarShop(article);
                }
            }
        });
    }

    saveCarShop(item: any): any {
        let findInex = this.carShop.findIndex((x: any) => +x.id === +item['id']);
        this.dataSource = new MatTableDataSource<any>([]);
        if (findInex < 0) {
            if (+item['quantityAvailable'] > 0) {
                this.carShop.push({
                    quantity: 1,
                    subtotal: (1 * item['saleAmount']),
                    category: item.categoria,
                    ...item
                });

                this.infoPreview = {
                    quantity: 1,
                    subtotal: (1 * item['saleAmount']),
                    category: item.categoria,
                    ...item
                };
                this.dataSource = new MatTableDataSource<any>(this.carShop);
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 2000
                })
                this.dataSource = new MatTableDataSource<any>(this.carShop);
            }

        } else {
            if (+this.carShop[findInex]['quantityAvailable'] !== +this.carShop[findInex]['quantity']) {
                this.carShop[findInex]['quantity'] = +this.carShop[findInex]['quantity'] + 1;
                this.carShop[findInex]['subtotal'] = (+this.carShop[findInex]['quantity'] * +this.carShop[findInex]['saleAmount']);
                this.infoPreview = {
                    quantity: 1,
                    subtotal: (1 * item['saleAmount']),
                    category: item.categoria,
                    ...item
                };
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
            this.dataSource = new MatTableDataSource<any>(this.carShop);
        }
        this.myControl.setValue('');

        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );

        this.calculateTotalAmount();

        this.cdr.detectChanges();

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    lamina(): void {
        const dialogRef = this.dialog.open(LaminasComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    payment(): void {
        const dialogRef = this.dialog.open(ResumenComprasComponent, {
            width: '350px',
            data: {
                salesList: this.carShop,
                totalCarrito: this.totalAmountCar
            },
        });

        dialogRef.afterClosed().subscribe(async result => {
            if (result.pagar) {
                let alta = new Date();
                let indexAuto = this.listaVentasHoy.length;
                this.isLoadingSales = true;
                this.contadorArticulos = 0;

                for (const element of this.carShop) {
                    indexAuto++;

                    let data = {
                        cantidadVendida: element.quantity,
                        costoPublico: element.saleAmount,
                        fechaVenta: alta,
                        idArticulo: element.id,
                        nombre: element.itemName,
                        vendedor: this.userData,
                        order: (this.listaVentasHoy.length + 1).toString(),
                        activo: true,
                        categoria: element.category,
                        marca: element.marca,
                        withoutRegistration: element.withoutRegistration === true,
                        imagen: element.imagen
                    };

                    await this._ventasServices.creaVentasHoy(this.fechaActual, data, ((indexAuto).toString()))
                        .then(async () => {
                            let data = {
                                cantidad: (+element.quantityAvailable - +element.quantity),
                                fechaModificacion: alta,
                                comprarDespues: !((+element.quantityAvailable - +element.quantity) <= 3)
                            };

                            let id = element.id;
                            await this._catalogoServices.actualizaArticulo(id + '', data)
                                .then(() => {
                                    this.contadorArticulos++;
                                }, (error) => {
                                    Swal.fire({
                                        title: '!Error!',
                                        icon: 'error',
                                        text: 'Ocurrió un error al guardar el artículo',
                                    });
                                });
                        }, (error) => {
                            Swal.fire({
                                title: '!Error!',
                                icon: 'error',
                                text: 'Ocurrió un error al guardar la venta',
                            });
                        });
                }

                if (this.contadorArticulos === this.carShop.length) {
                    this.isLoadingSales = false;
                    this.totalAmountCar = 0;
                    this.carShop = [];
                    this.dataSource = new MatTableDataSource<any>(this.carShop);
                    Swal.fire({
                        icon: 'success',
                        title: 'Venta registrada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }
        });
    }

    infoTarjeta(): void {
        Swal.fire({
            title: "PAGOS POR TRANSFERENCIA",
            html: `
                    <h2>BANORTE</h2>  
                    <h1>072441012149331668</h1>
                    <h3>JUAN ANGEL ORTIZ CONTRERAS</H3>
                `,
        });
    }

    infoTarjetaActas(): void {
        Swal.fire({
            title: "PAGO DE ACTAS DE NACIMIENTO",
            html: `
                    <p style="color: red">*Verificar stock en el sistema</p> 
                    <h1>
                        5579099009660723 <br>
                        08/26 <br>
                        997
                    </h1>
                `,
        });
    }

    infoPlataformas(): void {
        Swal.fire({
            title: "PLATAFORMAS DIGITALES",
            html: `
                    <hr>
                    <h1>COMBO DISNEY PLUS + STAR PLUS $45</h1>
                    <p>
                        <b>Usuario:</b> jangelortizc7@gmail.com <br>
                        <b>Contraseña:</b> rango@23H <br>
                        <br>
                        Disponibles: <b>0</b>
                    </p>
                    <hr>
                    <h1>HBO MAX $45</h1>
                    <p>
                        <b>Usuario:</b> texttter73@gmail.com <br>
                        <b>Contraseña:</b> rango@23H <br>
                        <br>
                        Disponibles: <b>1</b>
                    </p>
                    <hr>
                    <h1>SPOTIFY $47</h1>
                    <p>
                        Funciona con cuenta free
                    </p>
                    <p>Disponibles <b>0</b></p>
                    <hr>
                    <p style="color: red">*Fecha limite para pagar, los días 15 de cada mes</p> 
                `,
        });
    }

    registerUserReward(): void {
        const dialogRef = this.dialog.open(AgregarUsuarioRewardComponent, {
            width: '55%',
            data: {
              panelClass: 'mat-dialog-container',
              items: this.itemsList,
              title: 'Venta de producto no registrado'
            }
          });
    }

    productoNoRegistrado(): void {
        const dialogRef = this.dialog.open(RegistrarArticuloComponent, {
            width: '55%',
            data: {
              panelClass: 'mat-dialog-container',
              items: this.itemsList,
              title: 'Venta de producto no registrado'
            }
          });

        dialogRef.afterClosed().subscribe(async result => {
            if (+result.cantidad > 0) {
                this.carShop.push(
                    {
                        id: +result.id,
                        itemName: result.nombre,
                        branch: result.marca && result.marca.length > 0 ? result.marca : 'S/M',
                        quantityAvailable: result.cantidad,
                        category: result.categoria,
                        saleAmount: +result.costoPublico,
                        quantity: +result.cantidad,
                        subtotal: (+result.cantidad * +result.costoPublico),
                        marca: result.marca,
                        withoutRegistration: true,
                        result: result.imagen ? result.imagen : ''
                    }
                );
            }
    
            this.dataSource = new MatTableDataSource<any>(this.carShop);
    
            this.calculateTotalAmount();
            this.cdr.detectChanges();
    
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            Swal.close();
        });
    }

    showAddStock(): any {
        const dialogRef = this.dialog.open(AgregarStockComponent, {
            width: '600px',
            data: {
                filteredOptions: this.itemsList
            }
        });
    }

    modificarArticulo(): void {
        const dialogRef = this.dialog.open(ModificarArticuloUsuarioComponent, {
            width: '80%',
            data: {
                itemList: this.itemList
            },
        });

    }

    pagoTransferencia(value: any, element: any) {
        let data = {
            pagoTransferencia: value
        };
        console.log(data);
        console.log(value);
        console.log(element);
    }

}


