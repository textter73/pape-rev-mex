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
    displayedColumnsSalesList: string[] = ['number', 'image', 'items', 'quantity', 'amount', 'vendor', 'saleDay'];


    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    options = [
        {
            "id": 1,
            "itemName": "cubo de regalo",
            "branch": "S/M",
            "quantityAvailable": 2,
            "saleAmount": 27,
            "category": "REGALOS",
            "imagen": "https://previews.123rf.com/images/albund/albund1801/albund180100012/92910538-un-regalo-en-forma-de-cubo-envuelto-en-papel-de-embalaje-modelado-coraz%C3%B3n-y-atado-con-un-lazo-y-una.jpg",
            "categoría": "REGALOS",
            "nombre": "cubo de regalo",
            "marca": "S/M",
            "costoPublico": 27,
            "codigo": "cuboderegalo",
            "fechaModificacion": {
                "seconds": 1714616641,
                "nanoseconds": 679000000
            },
            "usuarioCrea": "aortiz",
            "comprarDespues": true,
            "fechaAlta": {
                "seconds": 1703291021,
                "nanoseconds": 570000000
            },
            "categoria": "REGALOS",
            "cantidad": 2,
            "costo": 27,
            "activo": true,
            "caja": 27
        },
        {
            "id": 10,
            "itemName": "silicon liquido 30 ml",
            "branch": "pelikan",
            "quantityAvailable": 12,
            "saleAmount": 14,
            "category": "silicon",
            "nombre": "silicon liquido 30 ml",
            "usuarioCrea": "aortiz",
            "caja": 95,
            "categoría": "silicon",
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_662660-MLM44839437438_022021-O.jpg",
            "activo": 1,
            "categoria": "silicon",
            "comprarDespues": true,
            "cantidad": 12,
            "fechaModificacion": {
                "seconds": 1720052737,
                "nanoseconds": 570000000
            },
            "marca": "pelikan",
            "costo": 8,
            "costoPublico": 14,
            "fechaAlta": {
                "seconds": 1643658073,
                "nanoseconds": 34000000
            },
            "codigo": "7501015220641"
        },
        {
            "id": 100,
            "itemName": "puntillas negras minas 0.5 mm elephant",
            "branch": "AZOR",
            "quantityAvailable": 42,
            "saleAmount": 8,
            "category": "ESCOLAR",
            "caja": 0,
            "marca": "AZOR",
            "cantidad": 42,
            "costoPublico": 8,
            "fechaModificacion": {
                "seconds": 1714616998,
                "nanoseconds": 840000000
            },
            "codigo": "7501428769096",
            "activo": true,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmA9JQAytr5wpcv92XR178j_an7AdAmpXmGOffMQ685ZbDO7KSAw2L_09ETetrlX42qRg&usqp=CAU",
            "comprarDespues": true,
            "costo": 2,
            "categoría": "ESCOLAR",
            "nombre": "puntillas negras minas 0.5 mm elephant",
            "categoria": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1646071209,
                "nanoseconds": 860000000
            },
            "usuarioCrea": "aortiz"
        },
        {
            "id": 1000,
            "itemName": "escaneo de documentos",
            "branch": "S/M",
            "quantityAvailable": 63,
            "saleAmount": 2,
            "category": "OFICINA",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "fechaModificacion": {
                "seconds": 1720634359,
                "nanoseconds": 950000000
            },
            "comprarDespues": true,
            "fechaAlta": {
                "seconds": 1684458765,
                "nanoseconds": 960000000
            },
            "categoría": "OFICINA",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEOJf8TX7wtQcoRbZuBrq1vTIjk0Yn3qpZQcJ-RVin8A&s",
            "costoPublico": 2,
            "activo": true,
            "nombre": "escaneo de documentos",
            "marca": "S/M",
            "cantidad": 63,
            "codigo": "escaneo",
            "categoria": "OFICINA",
            "costo": 2
        },
        {
            "id": 1001,
            "itemName": "bola de unicel #9",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 12,
            "category": "ESCOLAR",
            "caja": 0,
            "fechaAlta": {
                "seconds": 1684808073,
                "nanoseconds": 6000000
            },
            "fechaModificacion": {
                "seconds": 1714667869,
                "nanoseconds": 603000000
            },
            "costoPublico": 12,
            "nombre": "bola de unicel #9",
            "marca": "S/M",
            "activo": true,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_981019-MLM53457729397_012023-O.webp",
            "categoria": "ESCOLAR",
            "categoría": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "cantidad": "0",
            "costo": 12,
            "codigo": "bolaunicel#9"
        },
        {
            "id": 1002,
            "itemName": "hoja de acetato",
            "branch": "S/M",
            "quantityAvailable": 76,
            "saleAmount": 3,
            "category": "OFICINA",
            "fechaAlta": {
                "seconds": 1684896941,
                "nanoseconds": 467000000
            },
            "costoPublico": 3,
            "caja": 0,
            "fechaModificacion": {
                "seconds": 1716253888,
                "nanoseconds": 264000000
            },
            "costo": 3,
            "categoria": "OFICINA",
            "nombre": "hoja de acetato",
            "categoría": "OFICINA",
            "usuarioCrea": "aortiz",
            "cantidad": 76,
            "marca": "S/M",
            "comprarDespues": true,
            "activo": true,
            "codigo": "hojaacetato",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKicMX0fBau6luCSz_KgiYN_hTV1dhfRvSf9NlpQAmoQ&s"
        },
        {
            "id": 1003,
            "itemName": "Tramite del NSS y vigencia de derechos",
            "branch": "S/M",
            "quantityAvailable": 94,
            "saleAmount": 15,
            "category": "servicio",
            "costo": 15,
            "fechaModificacion": {
                "seconds": 1714617065,
                "nanoseconds": 270000000
            },
            "categoría": "servicio",
            "cantidad": 94,
            "nombre": "Tramite del NSS y vigencia de derechos",
            "usuarioCrea": "aortiz",
            "comprarDespues": true,
            "categoria": "servicio",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBjHUoMMab3TdSoqqd1WP3DYh1YbopCsh0UeQ9j8e-BA&s",
            "codigo": "tramitenssvigencia",
            "activo": true,
            "marca": "S/M",
            "costoPublico": 15,
            "caja": 0,
            "fechaAlta": {
                "seconds": 1685548608,
                "nanoseconds": 145000000
            }
        },
        {
            "id": 1004,
            "itemName": "navaja cutter grueso (venta individual)",
            "branch": "MAE",
            "quantityAvailable": 2,
            "saleAmount": 3,
            "category": "OFICINA",
            "codigo": "navajaindividualgruesa",
            "cantidad": 2,
            "comprarDespues": false,
            "fechaModificacion": {
                "seconds": 1720631915,
                "nanoseconds": 908000000
            },
            "activo": 1,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_909121-MLM43173515632_082020-O.webp",
            "nombre": "navaja cutter grueso (venta individual)",
            "marca": "MAE",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "categoria": "OFICINA",
            "costo": 3,
            "fechaAlta": {
                "seconds": 1685567829,
                "nanoseconds": 827000000
            },
            "costoPublico": 3,
            "categoría": "OFICINA"
        },
        {
            "id": 1005,
            "itemName": "tijera diferentes figuras ",
            "branch": "TRYME",
            "quantityAvailable": 9,
            "saleAmount": 19,
            "category": "tijeras",
            "fechaModificacion": {
                "seconds": 1718668998,
                "nanoseconds": 990000000
            },
            "nombre": "tijera diferentes figuras ",
            "categoria": "tijeras",
            "comprarDespues": true,
            "categoría": "tijeras",
            "imagen": "https://trymebh.com/wp-content/uploads/2022/03/3010-370x278.jpg",
            "costo": 10,
            "codigo": "tijerasdiferentecorte",
            "caja": 100,
            "activo": true,
            "usuarioCrea": "dcamacho",
            "cantidad": 9,
            "costoPublico": 19,
            "fechaAlta": {
                "seconds": 1685671723,
                "nanoseconds": 935000000
            },
            "marca": "TRYME"
        },
        {
            "id": 1006,
            "itemName": "marcador para vidrio",
            "branch": "PENMAX",
            "quantityAvailable": 4,
            "saleAmount": 60,
            "category": "OFICINA",
            "costoPublico": 60,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_986335-MLM43788279537_102020-O.webp",
            "activo": 1,
            "cantidad": 4,
            "marca": "PENMAX",
            "categoría": "OFICINA",
            "categoria": "OFICINA",
            "costo": 34,
            "fechaAlta": {
                "seconds": 1685673375,
                "nanoseconds": 925000000
            },
            "codigo": "marcadorvidrio",
            "nombre": "marcador para vidrio",
            "fechaModificacion": {
                "seconds": 1714617131,
                "nanoseconds": 594000000
            },
            "usuarioCrea": "aortiz",
            "caja": 0,
            "comprarDespues": true
        },
        {
            "id": 1007,
            "itemName": "plastilina barra cafe",
            "branch": "PELIKAN",
            "quantityAvailable": 0,
            "saleAmount": 13,
            "category": "ESCOLAR",
            "activo": 1,
            "costo": 8,
            "nombre": "plastilina barra cafe",
            "codigo": "plastilinabarracafe",
            "marca": "PELIKAN",
            "categoría": "ESCOLAR",
            "comprarDespues": false,
            "categoria": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1719358444,
                "nanoseconds": 311000000
            },
            "usuarioCrea": "aortiz",
            "cantidad": 0,
            "fechaAlta": {
                "seconds": 1685674706,
                "nanoseconds": 933000000
            },
            "caja": 0,
            "costoPublico": 13,
            "imagen": "https://www.officedepot.com.mx/medias/100047893.jpg-1200ftw?context=bWFzdGVyfHJvb3R8NDI0NTUzfGltYWdlL2pwZWd8YURNMUwyaGpPQzh4TURFek9UUTVNekl3TXprNU9DOHhNREF3TkRjNE9UTXVhbkJuWHpFeU1EQm1kSGN8NzVhOGI5M2NjOTdkMjdmZThiZmNmYTkxZDM3N2JmNTAxNjdlNTFjOGM5NjQwY2Q2NmRlNGRhNWVlZjFhN2VmMg"
        },
        {
            "id": 1008,
            "itemName": "pinzas de madera bamboo grandes",
            "branch": "KINTONG",
            "quantityAvailable": 1,
            "saleAmount": 15,
            "category": "ESCOLAR",
            "costo": 8,
            "usuarioCrea": "aortiz",
            "nombre": "pinzas de madera bamboo grandes",
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_830959-MLM44118369828_112020-O.webp",
            "costoPublico": 15,
            "cantidad": 1,
            "categoria": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1685674958,
                "nanoseconds": 517000000
            },
            "codigo": "pinzasgrandes",
            "marca": "KINTONG",
            "comprarDespues": true,
            "activo": true,
            "categoría": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1716345826,
                "nanoseconds": 649000000
            },
            "caja": 0
        },
        {
            "id": 1009,
            "itemName": "pinzas de madera klaus chicas",
            "branch": "klaus",
            "quantityAvailable": 2,
            "saleAmount": 22,
            "category": "OFICINA",
            "costoPublico": 22,
            "marca": "klaus",
            "costo": 14,
            "imagen": "https://www.hobbees.com.mx/cdn/shop/products/481511_01_600x.jpg?v=1486533998",
            "categoría": "OFICINA",
            "comprarDespues": true,
            "caja": 0,
            "fechaAlta": {
                "seconds": 1685675093,
                "nanoseconds": 873000000
            },
            "codigo": "pinzasmaderachicas",
            "fechaModificacion": {
                "seconds": 1714616893,
                "nanoseconds": 617000000
            },
            "activo": true,
            "categoria": "OFICINA",
            "nombre": "pinzas de madera klaus chicas",
            "usuarioCrea": "aortiz",
            "cantidad": 2
        },
        {
            "id": 101,
            "itemName": "LIBRETA PROFESIONAL MIXTA ",
            "branch": "SCRIBE",
            "quantityAvailable": 31,
            "saleAmount": 28,
            "category": "libreta",
            "imagen": "https://www.lahidalgo.com/wp-content/uploads/2020/05/CUADERNO-SCRIBE-PROFESIONAL-ESPIRAL-MIXTA-7517-C-100H.jpg",
            "cantidad": 31,
            "fechaModificacion": {
                "seconds": 1714617183,
                "nanoseconds": 551000000
            },
            "caja": 0,
            "activo": true,
            "usuarioCrea": "aortiz",
            "codigo": "7506129430986",
            "fechaAlta": {
                "seconds": 1646230812,
                "nanoseconds": 92000000
            },
            "costo": 710,
            "nombre": "LIBRETA PROFESIONAL MIXTA ",
            "categoria": "libreta",
            "costoPublico": 28,
            "categoría": "libreta",
            "comprarDespues": true,
            "marca": "SCRIBE"
        },
        {
            "id": 1010,
            "itemName": "pinzas de madera  chicas klaus colores",
            "branch": "klaus",
            "quantityAvailable": 2,
            "saleAmount": 22,
            "category": "OFICINA",
            "costoPublico": 22,
            "costo": 14,
            "comprarDespues": true,
            "usuarioCrea": "aortiz",
            "marca": "klaus",
            "fechaModificacion": {
                "seconds": 1714616922,
                "nanoseconds": 164000000
            },
            "fechaAlta": {
                "seconds": 1685675148,
                "nanoseconds": 492000000
            },
            "categoría": "OFICINA",
            "imagen": "https://fantasiasmiguel.com/cdn/shop/products/5415-12132_fecf87b8-e1ac-451b-931d-7be9be863cbb_395x.jpg?v=1635685036",
            "categoria": "OFICINA",
            "caja": 0,
            "activo": true,
            "nombre": "pinzas de madera  chicas klaus colores",
            "cantidad": 2,
            "codigo": "pinzasmaderachicascolores"
        },
        {
            "id": 1011,
            "itemName": "caja clips de colores",
            "branch": "LOMAREY",
            "quantityAvailable": 5,
            "saleAmount": 17,
            "category": "OFICINA",
            "cantidad": 5,
            "costoPublico": 17,
            "categoría": "OFICINA",
            "fechaAlta": {
                "seconds": 1685675432,
                "nanoseconds": 296000000
            },
            "fechaModificacion": {
                "seconds": 1710884449,
                "nanoseconds": 476000000
            },
            "codigo": "clipscolorescaja",
            "categoria": "OFICINA",
            "comprarDespues": true,
            "costo": 10,
            "imagen": "data:image/jpeg;base64,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",
            "caja": 0,
            "marca": "LOMAREY",
            "activo": true,
            "usuarioCrea": "aortiz",
            "nombre": "caja clips de colores"
        },
        {
            "id": 1013,
            "itemName": "seguros no #0 plata  3 x 1 ",
            "branch": "SELANUSA",
            "quantityAvailable": 65,
            "saleAmount": 1,
            "category": "MERCERIA",
            "caja": 0,
            "costo": 1,
            "marca": "SELANUSA",
            "nombre": "seguros no #0 plata  3 x 1 ",
            "usuarioCrea": "csanchez",
            "comprarDespues": true,
            "codigo": "segurosno.0",
            "costoPublico": 1,
            "cantidad": 65,
            "activo": true,
            "fechaAlta": {
                "seconds": 1686077722,
                "nanoseconds": 117000000
            },
            "categoría": "MERCERIA",
            "categoria": "MERCERIA",
            "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhEIBwgVFQkQFRcWFxAYGBsZHhUYIB0XFhgdGhkkHTQmGCYxGx8eIT0mJis3MjIvIyQ1PDs4QzQ5MzcBCgoKDgwNGA8QFjclICUwNzctNS03Ky0tNzUtKystNS0tKysrKystKy0rKys1Ky0tKystNy0tKy0tLS0rLCstN//AABEIAQIAwwMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAABAECBQYDB//EADEQAQABBAAEAwYFBQEAAAAAAAABAgMEEQUSITFBUWETIjJxwfAGFEJS0WKBkaHhI//EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABgRAQEBAQEAAAAAAAAAAAAAAAABYTER/9oADAMBAAIRAxEAPwD9xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiZiO4Mm3D49+I8PhGqL1U1ZFcTNNqnW5iPiqnwppjp709OsR3nT58L41kZeLRlXcPVq5G/cq59R0mN9I7xMT02nsHoBpauRcp5qZ6N1AAAAAAAAAAAAAAAAAAAGJnUATOnE/EXG7fC8beua/VuKLe9c0+s/piO8z4R/hdm5kWdUxG7tXw0ef8Qjq4LYzqZq4laiuurvE9ojy+Xbp2+fWZlweH4Jw2vi1FzjfFK6q7NdVPLMTNM5Ne9UU0dfctRPaP1dZnpuau5xGc33rmFgTdyJtTVVYqrmimZiN26t9oq5+kdpnc9em49LlWosU0V02o5bU7iiOkR0mI1HycvKs12MiL9VU3OIXdRTa3qinyjl8oidzVO5184YsVR+GL9d7B3VVMxHL1nvO6aapmfnM7/u7qThmJTh4kWondXeata5qp6zOvD5eEahW3OIAKAAAAAAAAAAAAAAAAMTOoRZuX7KYt243eq+Gn6z9/WY2zMqberdqnd6rtT9Z+/rMbYeJFjdy5O79Xer6R9/SIg0wsL2Uzdv1c1+rvV5ekLewmz8yjEs89XWqekUx3mfKFE/FL+qfY26d3a+kR9Z+/rLThvDqrNyb+Rd579Ua5vKO+ojw69Znx/tDbAxq4qm/kdb9ff8Apjyj7/mejTGoTRmOgCgAAAAAAAAAAAAAAAAlzcqLFHSN1z0pp85fTJvU2LU11z0hNgWa7tz85kR78/DT+2P5++m5hB9cLFm1u7dnd+rvPl6QqE2dmWsOzNy7V8o8ZnyiPGVGczLt4lmblyekf79IQ4dm5kXfzWVHv/pp/ZH8/fpHzxca9l34y82Na+C3+31nzl16KIphBminlhsCgAAAAAAAAAAAAAAAAADz/Fr2Tk5v5bCt01VW4iuqmqZiPGKYmdT3mP8AG/NfwvNu3aZtZtj2eRHeNxMT6xPjCDMrysDi1dcYlVVi7yzFdMb6xGpirXafn0nfc9nxDiFUV8s2adTHXU1a8PSJ7+fh471lXSzuJWsaYtURz5FXw247z6z+2PWf+JsXBuXb/wCazqua/wCER8NEeUR9VGBw2zh0/wDnG6571z1mqfOZnrK6I0qMU0xENgUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z",
            "fechaModificacion": {
                "seconds": 1718764832,
                "nanoseconds": 319000000
            }
        },
        {
            "id": 1014,
            "itemName": "papel cascaron 1/2",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 25,
            "category": "ESCOLAR",
            "categoría": "ESCOLAR",
            "nombre": "papel cascaron 1/2",
            "codigo": "papelcascaron1/2",
            "fechaAlta": {
                "seconds": 1686103000,
                "nanoseconds": 550000000
            },
            "costoPublico": 25,
            "costo": 25,
            "cantidad": 0,
            "activo": 1,
            "categoria": "ESCOLAR",
            "marca": "S/M",
            "usuarioCrea": "aortiz",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLxMO-DNRYowZcGtFZBxWX8NZKGEAON3-GUhfBQIHVZA&s",
            "caja": 0,
            "fechaModificacion": {
                "seconds": 1705526463,
                "nanoseconds": 171000000
            }
        },
        {
            "id": 1015,
            "itemName": "pintura vinci azul ultramar",
            "branch": "VINCI",
            "quantityAvailable": 7,
            "saleAmount": 13,
            "category": "ESCOLAR",
            "categoría": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1714617203,
                "nanoseconds": 158000000
            },
            "marca": "VINCI",
            "activo": 1,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6WZDhJv2wWwJJaiH_ZuyDEc7qhDBYD2F37uhJqkQJVA&s",
            "fechaAlta": {
                "seconds": 1686191984,
                "nanoseconds": 961000000
            },
            "caja": 0,
            "costoPublico": 13,
            "nombre": "pintura vinci azul ultramar",
            "comprarDespues": true,
            "cantidad": 7,
            "categoria": "ESCOLAR",
            "codigo": "vinciazulultramar",
            "usuarioCrea": "aortiz",
            "costo": 13
        },
        {
            "id": 1016,
            "itemName": "bolsita cuentas para pulsera de corazon",
            "branch": "S/M",
            "quantityAvailable": 10,
            "saleAmount": 10,
            "category": "DIDÁCTICO",
            "fechaAlta": {
                "seconds": 1687549789,
                "nanoseconds": 362000000
            },
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_803014-MLM44671354623_012021-O.webp",
            "categoria": "DIDÁCTICO",
            "cantidad": 10,
            "usuarioCrea": "aortiz",
            "nombre": "bolsita cuentas para pulsera de corazon",
            "comprarDespues": true,
            "costoPublico": 10,
            "caja": 0,
            "codigo": "cuantaspulseracorazon",
            "marca": "S/M",
            "activo": true,
            "fechaModificacion": {
                "seconds": 1714617213,
                "nanoseconds": 233000000
            },
            "costo": 10,
            "categoría": "DIDÁCTICO"
        },
        {
            "id": 1017,
            "itemName": "post it cuadrado",
            "branch": "SOFIA",
            "quantityAvailable": 2,
            "saleAmount": 20,
            "category": "ESCOLAR",
            "codigo": "postitcuadro",
            "imagen": "https://pedidos.com/myfotos/xLarge/(X)P3M-PST-2018LA.webp",
            "fechaAlta": {
                "seconds": 1687807650,
                "nanoseconds": 703000000
            },
            "costo": 12,
            "cantidad": 2,
            "categoría": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "activo": 1,
            "nombre": "post it cuadrado",
            "fechaModificacion": {
                "seconds": 1717437468,
                "nanoseconds": 54000000
            },
            "comprarDespues": false,
            "marca": "SOFIA",
            "caja": 19,
            "categoria": "ESCOLAR",
            "costoPublico": 20
        },
        {
            "id": 1018,
            "itemName": "Papel america dorado",
            "branch": "S/M",
            "quantityAvailable": 45,
            "saleAmount": 10,
            "category": "ESCOLAR",
            "cantidad": 45,
            "costoPublico": 10,
            "fechaModificacion": {
                "seconds": 1717463403,
                "nanoseconds": 667000000
            },
            "categoria": "ESCOLAR",
            "imagen": "https://cdn11.bigcommerce.com/s-ekt7a8p7f0/images/stencil/1280x1280/products/1443/11964/GAL603706__25877.1674389671.jpg?c=1",
            "codigo": "papelamericadorado",
            "costo": 9,
            "fechaAlta": {
                "seconds": 1688091287,
                "nanoseconds": 701000000
            },
            "usuarioCrea": "dcamacho",
            "activo": true,
            "marca": "S/M",
            "nombre": "Papel america dorado",
            "caja": 0,
            "comprarDespues": true,
            "categoría": "ESCOLAR"
        },
        {
            "id": 1019,
            "itemName": "papel america dorado 1/2",
            "branch": "S/M",
            "quantityAvailable": 50,
            "saleAmount": 5,
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1715916913,
                "nanoseconds": 651000000
            },
            "caja": 4.5,
            "categoria": "ESCOLAR",
            "nombre": "papel america dorado 1/2",
            "categoría": "ESCOLAR",
            "activo": true,
            "marca": "S/M",
            "costoPublico": 5,
            "costo": 4.5,
            "comprarDespues": true,
            "cantidad": "50",
            "fechaAlta": {
                "seconds": 1688091454,
                "nanoseconds": 485000000
            },
            "imagen": "https://cdn11.bigcommerce.com/s-ekt7a8p7f0/images/stencil/1280x1280/products/1443/11964/GAL603706__25877.1674389671.jpg?c=1",
            "codigo": "Papel america 1/2 dorado",
            "usuarioCrea": "dcamacho"
        },
        {
            "id": 102,
            "itemName": "block de papel marquilla 30H",
            "branch": "monky",
            "quantityAvailable": 1,
            "saleAmount": 75,
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1694121295,
                "nanoseconds": 488000000
            },
            "nombre": "block de papel marquilla 30H",
            "activo": true,
            "costo": 50,
            "marca": "monky",
            "categoría": "ESCOLAR",
            "caja": 0,
            "fechaAlta": {
                "seconds": 1646231418,
                "nanoseconds": 588000000
            },
            "imagen": "data:image/jpeg;base64,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",
            "usuarioCrea": "dcamacho",
            "cantidad": 1,
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "codigo": "602760000513",
            "costoPublico": 75
        },
        {
            "id": 1020,
            "itemName": "hoja decorada (diferentes figuras)",
            "branch": "S/M",
            "quantityAvailable": 5,
            "saleAmount": 1,
            "category": "ESCOLAR",
            "codigo": "hojadecorada",
            "fechaModificacion": {
                "seconds": 1717447069,
                "nanoseconds": 236000000
            },
            "usuarioCrea": "aortiz",
            "cantidad": 5,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_702320-MLM44728963656_012021-O.webp",
            "costo": 1,
            "costoPublico": 1,
            "categoria": "ESCOLAR",
            "nombre": "hoja decorada (diferentes figuras)",
            "caja": 0,
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1689012769,
                "nanoseconds": 931000000
            },
            "activo": 1,
            "comprarDespues": true,
            "marca": "S/M"
        },
        {
            "id": 1021,
            "itemName": "impresion de tenencia y/o refrendo",
            "branch": "S/M",
            "quantityAvailable": 15,
            "saleAmount": 6,
            "category": "ESCOLAR",
            "imagen": "https://www.eleconomista.com.mx/__export/1708731056973/sites/eleconomista/img/2024/02/23/tenencia_refrendo_edomex_2024_x1x-min.png_554688468.png",
            "fechaAlta": {
                "seconds": 1689297101,
                "nanoseconds": 784000000
            },
            "categoria": "ESCOLAR",
            "marca": "S/M",
            "categoría": "ESCOLAR",
            "costoPublico": 6,
            "usuarioCrea": "aortiz",
            "nombre": "impresion de tenencia y/o refrendo",
            "costo": 6,
            "activo": true,
            "fechaModificacion": {
                "seconds": 1716338934,
                "nanoseconds": 389000000
            },
            "comprarDespues": true,
            "caja": 0,
            "codigo": "tenenciarefrendo",
            "cantidad": 15
        },
        {
            "id": 1022,
            "itemName": "hojas blancas oficio 3 x 1",
            "branch": "S/M",
            "quantityAvailable": 76,
            "saleAmount": 0.5,
            "category": "ESCOLAR",
            "costo": 1,
            "categoría": "ESCOLAR",
            "activo": 1,
            "caja": 0,
            "fechaModificacion": {
                "seconds": 1720206585,
                "nanoseconds": 699000000
            },
            "usuarioCrea": "dcamacho",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQJR8nbnn4hoCjWyX8Inlzje5pxOqe09MRUfJe51A5IQ&s",
            "codigo": "hojasblancasoficio",
            "categoria": "ESCOLAR",
            "nombre": "hojas blancas oficio 3 x 1",
            "costoPublico": 0.5,
            "comprarDespues": true,
            "cantidad": 76,
            "fechaAlta": {
                "seconds": 1689297313,
                "nanoseconds": 678000000
            },
            "marca": "S/M"
        },
        {
            "id": 1024,
            "itemName": "Pelón Pelorico",
            "branch": "Pelonpelorico",
            "quantityAvailable": 1,
            "saleAmount": 8,
            "category": "Dulce",
            "costoPublico": 8,
            "costo": 60.5,
            "categoria": "Dulce",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "fechaAlta": {
                "seconds": 1689732547,
                "nanoseconds": 83000000
            },
            "fechaModificacion": {
                "seconds": 1701197350,
                "nanoseconds": 122000000
            },
            "nombre": "Pelón Pelorico",
            "codigo": "pelonpelorico",
            "cantidad": 1,
            "marca": "Pelonpelorico",
            "imagen": "data:image/jpeg;base64,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",
            "categoría": "Dulce",
            "activo": 1
        },
        {
            "id": 1025,
            "itemName": "lustre azul turquesa",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 5,
            "category": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "codigo": "Lustreazulturquesa",
            "categoria": "ESCOLAR",
            "categoría": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1714777287,
                "nanoseconds": 96000000
            },
            "marca": "S/M",
            "fechaAlta": {
                "seconds": 1691011185,
                "nanoseconds": 266000000
            },
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcqmUufcvEuMJhRsqNmQluHom2SRVWpnbITNxocH3Cfw&s",
            "caja": 0,
            "costoPublico": 5,
            "activo": true,
            "nombre": "lustre azul turquesa",
            "costo": 5,
            "comprarDespues": false,
            "cantidad": 0
        },
        {
            "id": 1026,
            "itemName": "juego de geometria  tryme",
            "branch": "TRYME",
            "quantityAvailable": 1,
            "saleAmount": 90,
            "category": "ESCOLAR",
            "nombre": "juego de geometria  tryme",
            "activo": true,
            "marca": "TRYME",
            "categoria": "ESCOLAR",
            "cantidad": 1,
            "caja": 0,
            "fechaModificacion": {
                "seconds": 1718671307,
                "nanoseconds": 490000000
            },
            "usuarioCrea": "dcamacho",
            "categoría": "ESCOLAR",
            "costo": 90,
            "fechaAlta": {
                "seconds": 1691011271,
                "nanoseconds": 54000000
            },
            "costoPublico": 90,
            "codigo": "6971249520946",
            "comprarDespues": true,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1vormGFFDdxCvPRkMixxwcihXHVNL1Lb90mP1gyrnuQ&s"
        },
        {
            "id": 1027,
            "itemName": "papel china verde bandera ",
            "branch": "S/M",
            "quantityAvailable": 5,
            "saleAmount": 2,
            "category": "MANUALIDADES",
            "fechaModificacion": {
                "seconds": 1713854263,
                "nanoseconds": 301000000
            },
            "marca": "S/M",
            "costo": "2",
            "cantidad": 5,
            "codigo": "chinaverdebandera",
            "usuarioCrea": "csanchez",
            "categoria": "MANUALIDADES",
            "activo": true,
            "nombre": "papel china verde bandera ",
            "costoPublico": 2,
            "fechaAlta": {
                "seconds": 1691076580,
                "nanoseconds": 856000000
            },
            "caja": 0,
            "imagen": ""
        },
        {
            "id": 1028,
            "itemName": "post it colores transparente",
            "branch": "sticky note",
            "quantityAvailable": 0,
            "saleAmount": 20,
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1717437468,
                "nanoseconds": 54000000
            },
            "usuarioCrea": "dtorres",
            "categoria": "ESCOLAR",
            "cantidad": 0,
            "fechaAlta": {
                "seconds": 1691430518,
                "nanoseconds": 610000000
            },
            "comprarDespues": false,
            "activo": true,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8Uf3oGyvENEbtZqYqC25kI7nepey-_-SfwQ&usqp=CAU",
            "costoPublico": 20,
            "marca": "sticky note",
            "costo": "20",
            "codigo": "postitcolorestransparente",
            "nombre": "post it colores transparente",
            "caja": 0
        },
        {
            "id": 1029,
            "itemName": "post it cuadro negro",
            "branch": "sofia",
            "quantityAvailable": 2,
            "saleAmount": 16,
            "category": "ESCOLAR",
            "costoPublico": 16,
            "codigo": "postitcuadradonegro",
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691430811,
                "nanoseconds": 420000000
            },
            "nombre": "post it cuadro negro",
            "cantidad": 2,
            "fechaModificacion": {
                "seconds": 1714777561,
                "nanoseconds": 309000000
            },
            "marca": "sofia",
            "activo": 1,
            "usuarioCrea": "aortiz",
            "imagen": "https://m.media-amazon.com/images/I/61AWW2tnskL._AC_UF894,1000_QL80_.jpg",
            "caja": 0,
            "categoria": "ESCOLAR",
            "costo": 16,
            "comprarDespues": true
        },
        {
            "id": 103,
            "itemName": "cartulina blanca ",
            "branch": "APSA",
            "quantityAvailable": 81,
            "saleAmount": 5,
            "category": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1646418593,
                "nanoseconds": 669000000
            },
            "costo": 275,
            "costoPublico": 5,
            "categoria": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "comprarDespues": true,
            "fechaModificacion": {
                "seconds": 1720141395,
                "nanoseconds": 780000000
            },
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_660820-MLM46090690928_052021-O.webp",
            "marca": "APSA",
            "activo": true,
            "codigo": "790209603606",
            "cantidad": 81,
            "nombre": "cartulina blanca ",
            "categoría": "ESCOLAR",
            "caja": 0
        },
        {
            "id": 1030,
            "itemName": "marcatextos azor amarillo",
            "branch": "AZOR",
            "quantityAvailable": 3,
            "saleAmount": 14,
            "category": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "caja": 0,
            "costo": 7.5,
            "fechaAlta": {
                "seconds": 1691431160,
                "nanoseconds": 27000000
            },
            "cantidad": 3,
            "activo": 1,
            "categoría": "ESCOLAR",
            "categoria": "ESCOLAR",
            "codigo": "7501428722794",
            "imagen": "https://papeleriadelahorro.mx/cdn/shop/products/623109_b67557b0-83d2-4495-9f5b-9db01f90b2b0.jpg?v=1666622780",
            "nombre": "marcatextos azor amarillo",
            "fechaModificacion": {
                "seconds": 1707863820,
                "nanoseconds": 224000000
            },
            "marca": "AZOR",
            "costoPublico": 14
        },
        {
            "id": 1031,
            "itemName": "marcatextos azor naranja",
            "branch": "AZOR",
            "quantityAvailable": 5,
            "saleAmount": 14,
            "category": "ESCOLAR",
            "activo": 1,
            "categoria": "ESCOLAR",
            "nombre": "marcatextos azor naranja",
            "fechaModificacion": {
                "seconds": 1714774039,
                "nanoseconds": 897000000
            },
            "cantidad": 5,
            "costoPublico": 14,
            "costo": 14,
            "imagen": "https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00750142872466L1.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
            "comprarDespues": true,
            "usuarioCrea": "aortiz",
            "caja": 0,
            "fechaAlta": {
                "seconds": 1691431264,
                "nanoseconds": 277000000
            },
            "marca": "AZOR",
            "categoría": "ESCOLAR",
            "codigo": "7501428722817"
        },
        {
            "id": 1032,
            "itemName": "marcatextos azor azul",
            "branch": "AZOR",
            "quantityAvailable": 1,
            "saleAmount": 14,
            "category": "ESCOLAR",
            "costo": 14,
            "marca": "AZOR",
            "cantidad": 1,
            "caja": 0,
            "imagen": "https://www.cyberpuerta.mx/img/product/S/CP-AZOR-3012300AZ-1.jpg",
            "codigo": "7591628722890",
            "activo": 1,
            "fechaModificacion": {
                "seconds": 1696372226,
                "nanoseconds": 380000000
            },
            "usuarioCrea": "aortiz",
            "nombre": "marcatextos azor azul",
            "categoria": "ESCOLAR",
            "costoPublico": 14,
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691431669,
                "nanoseconds": 259000000
            }
        },
        {
            "id": 1033,
            "itemName": "marcatextos pastel retractil",
            "branch": "CHOSCH",
            "quantityAvailable": 2,
            "saleAmount": "20",
            "category": "ESCOLAR",
            "caja": 0,
            "codigo": "6924247417367",
            "costo": "20",
            "fechaAlta": {
                "seconds": 1691432138,
                "nanoseconds": 65000000
            },
            "fechaModificacion": {
                "seconds": 1701205461,
                "nanoseconds": 223000000
            },
            "costoPublico": "20",
            "nombre": "marcatextos pastel retractil",
            "cantidad": 2,
            "imagen": "https://cf.shopee.ph/file/5444f40b35ed7f4881770c16f22a9c91",
            "marca": "CHOSCH",
            "activo": true,
            "comprarDespues": true,
            "usuarioCrea": "dcamacho",
            "categoria": "ESCOLAR"
        },
        {
            "id": 1034,
            "itemName": "calculadora practica eco calc",
            "branch": "datexx",
            "quantityAvailable": 0,
            "saleAmount": "35",
            "category": "ESCOLAR",
            "codigo": "6746943123",
            "caja": 0,
            "marca": "datexx",
            "activo": true,
            "nombre": "calculadora practica eco calc",
            "cantidad": 0,
            "usuarioCrea": "dcamacho",
            "categoria": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1713572276,
                "nanoseconds": 426000000
            },
            "costoPublico": "35",
            "imagen": "data:image/jpeg;base64,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",
            "costo": "35",
            "comprarDespues": true,
            "fechaAlta": {
                "seconds": 1691433271,
                "nanoseconds": 154000000
            }
        },
        {
            "id": 1035,
            "itemName": "calculadora cientifica ",
            "branch": "karuida",
            "quantityAvailable": 0,
            "saleAmount": "100",
            "category": "ESCOLAR",
            "imagen": "data:image/jpeg;base64,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",
            "usuarioCrea": "dcamacho",
            "comprarDespues": true,
            "costo": "100",
            "codigo": "6926801900827",
            "fechaAlta": {
                "seconds": 1691433518,
                "nanoseconds": 332000000
            },
            "caja": 0,
            "cantidad": 0,
            "costoPublico": "100",
            "marca": "karuida",
            "fechaModificacion": {
                "seconds": 1708649313,
                "nanoseconds": 392000000
            },
            "categoria": "ESCOLAR",
            "activo": true,
            "nombre": "calculadora cientifica "
        },
        {
            "id": 1036,
            "itemName": "rotuladores fine line 12pza",
            "branch": "marker",
            "quantityAvailable": 1,
            "saleAmount": 40,
            "category": "ESCOLAR",
            "nombre": "rotuladores fine line 12pza",
            "cantidad": 1,
            "marca": "marker",
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691433811,
                "nanoseconds": 279000000
            },
            "costo": 75,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_620117-MLM74623083916_022024-O.webp",
            "usuarioCrea": "aortiz",
            "activo": true,
            "fechaModificacion": {
                "seconds": 1714777886,
                "nanoseconds": 82000000
            },
            "costoPublico": 40,
            "caja": 0,
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "codigo": "6970899228240"
        },
        {
            "id": 1037,
            "itemName": "plumones markcolor",
            "branch": "TRYME",
            "quantityAvailable": 0,
            "saleAmount": "32",
            "category": "ESCOLAR",
            "usuarioCrea": "dcamacho",
            "cantidad": 0,
            "fechaModificacion": {
                "seconds": 1693095900,
                "nanoseconds": 745000000
            },
            "marca": "TRYME",
            "comprarDespues": true,
            "fechaAlta": {
                "seconds": 1691434033,
                "nanoseconds": 972000000
            },
            "activo": true,
            "costo": "32",
            "categoria": "ESCOLAR",
            "nombre": "plumones markcolor",
            "costoPublico": "32",
            "codigo": "6925411085863",
            "imagen": "data:image/jpeg;base64,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",
            "caja": 0
        },
        {
            "id": 1038,
            "itemName": "lapiceros color pen",
            "branch": "wenxuan",
            "quantityAvailable": 3,
            "saleAmount": "25",
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1691434595,
                "nanoseconds": 642000000
            },
            "marca": "wenxuan",
            "codigo": "6958209663547",
            "costo": "25",
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_733233-MLM43282571838_082020-W.jpg",
            "nombre": "lapiceros color pen",
            "caja": 0,
            "usuarioCrea": "dcamacho",
            "cantidad": "3",
            "costoPublico": "25",
            "activo": true,
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691434595,
                "nanoseconds": 642000000
            }
        },
        {
            "id": 1039,
            "itemName": "usb classic c906 32GB",
            "branch": "adata",
            "quantityAvailable": 3,
            "saleAmount": 130,
            "category": "OFICINA",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "nombre": "usb classic c906 32GB",
            "costoPublico": 130,
            "categoría": "OFICINA",
            "imagen": "data:image/jpeg;base64,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",
            "marca": "adata",
            "costo": 100,
            "fechaModificacion": {
                "seconds": 1717639326,
                "nanoseconds": 660000000
            },
            "comprarDespues": true,
            "categoria": "OFICINA",
            "fechaAlta": {
                "seconds": 1691434811,
                "nanoseconds": 295000000
            },
            "codigo": "4718050609642",
            "activo": true,
            "cantidad": 3
        },
        {
            "id": 104,
            "itemName": "lapicero punto medio azul",
            "branch": "PAPERMATE",
            "quantityAvailable": 20,
            "saleAmount": 6,
            "category": "lapicero",
            "marca": "PAPERMATE",
            "comprarDespues": true,
            "codigo": "7703486035315",
            "fechaAlta": {
                "seconds": 1647211180,
                "nanoseconds": 328000000
            },
            "categoría": "lapicero",
            "imagen": "data:image/jpeg;base64,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",
            "costoPublico": 6,
            "categoria": "lapicero",
            "costo": 33,
            "cantidad": 20,
            "usuarioCrea": "aortiz",
            "caja": 0,
            "nombre": "lapicero punto medio azul",
            "fechaModificacion": {
                "seconds": 1718740051,
                "nanoseconds": 408000000
            },
            "activo": 1
        },
        {
            "id": 1040,
            "itemName": "portagafete plastico vertical/horizontal",
            "branch": "lumi",
            "quantityAvailable": 1,
            "saleAmount": 25,
            "category": "ESCOLAR",
            "codigo": "portagafetes",
            "imagen": "https://orpamex.com.mx/img/p/2/8/3/5/2835-large_default.jpg",
            "usuarioCrea": "aortiz",
            "caja": 0,
            "categoria": "ESCOLAR",
            "nombre": "portagafete plastico vertical/horizontal",
            "cantidad": 1,
            "fechaAlta": {
                "seconds": 1691436296,
                "nanoseconds": 417000000
            },
            "marca": "lumi",
            "activo": 1,
            "comprarDespues": true,
            "categoría": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1716247404,
                "nanoseconds": 439000000
            },
            "costoPublico": 25,
            "costo": 25
        },
        {
            "id": 1042,
            "itemName": "caja clips metalicos",
            "branch": "san xing",
            "quantityAvailable": 0,
            "saleAmount": 17,
            "category": "ESCOLAR",
            "costo": 16,
            "fechaModificacion": {
                "seconds": 1714778086,
                "nanoseconds": 40000000
            },
            "activo": true,
            "usuarioCrea": "aortiz",
            "fechaAlta": {
                "seconds": 1691440079,
                "nanoseconds": 544000000
            },
            "categoria": "ESCOLAR",
            "codigo": "cajaclipsmetalicos",
            "nombre": "caja clips metalicos",
            "imagen": "https://www.grafoplas.com/imagenes_g/Clips_niquel.jpg",
            "categoría": "ESCOLAR",
            "caja": 0,
            "marca": "san xing",
            "cantidad": 0,
            "comprarDespues": false,
            "costoPublico": 17
        },
        {
            "id": 1043,
            "itemName": "sellos infantiles varios personajes",
            "branch": "S/M",
            "quantityAvailable": 3,
            "saleAmount": 11,
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1716343339,
                "nanoseconds": 652000000
            },
            "imagen": "data:image/jpeg;base64,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",
            "activo": true,
            "comprarDespues": true,
            "categoría": "ESCOLAR",
            "nombre": "sellos infantiles varios personajes",
            "costo": 11,
            "caja": 0,
            "cantidad": 3,
            "usuarioCrea": "aortiz",
            "categoria": "ESCOLAR",
            "marca": "S/M",
            "fechaAlta": {
                "seconds": 1691440751,
                "nanoseconds": 898000000
            },
            "codigo": "sellosinfantiles",
            "costoPublico": 11
        },
        {
            "id": 1044,
            "itemName": "libreta profesional 100H pasta gruesa",
            "branch": "MONKY",
            "quantityAvailable": 6,
            "saleAmount": 90,
            "category": "libreta",
            "codigo": "7503006758942",
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_892237-MLM46495047628_062021-W.jpg",
            "costo": 90,
            "activo": true,
            "categoría": "libreta",
            "comprarDespues": true,
            "costoPublico": 90,
            "categoria": "libreta",
            "cantidad": 6,
            "usuarioCrea": "aortiz",
            "fechaAlta": {
                "seconds": 1691443537,
                "nanoseconds": 34000000
            },
            "nombre": "libreta profesional 100H pasta gruesa",
            "fechaModificacion": {
                "seconds": 1714777909,
                "nanoseconds": 400000000
            },
            "caja": 0,
            "marca": "MONKY"
        },
        {
            "id": 1045,
            "itemName": "espiral para cuaderno 100h",
            "branch": "S/M",
            "quantityAvailable": 27,
            "saleAmount": 5,
            "category": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "costo": 5,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6_M8ETDhCQHkJysmlgOvV_FpRGd8IIYIzCdAYV-DcOA&s",
            "fechaModificacion": {
                "seconds": 1714778061,
                "nanoseconds": 729000000
            },
            "categoría": "ESCOLAR",
            "marca": "S/M",
            "costoPublico": 5,
            "nombre": "espiral para cuaderno 100h",
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "activo": true,
            "caja": 0,
            "fechaAlta": {
                "seconds": 1691538082,
                "nanoseconds": 114000000
            },
            "codigo": "espiralparacuderno",
            "cantidad": 27
        },
        {
            "id": 1046,
            "itemName": "navaja cutter delgada (venta individual)",
            "branch": "MAE",
            "quantityAvailable": 6,
            "saleAmount": 2.5,
            "category": "OFICINA",
            "fechaModificacion": {
                "seconds": 1716408304,
                "nanoseconds": 297000000
            },
            "comprarDespues": true,
            "nombre": "navaja cutter delgada (venta individual)",
            "cantidad": 6,
            "caja": 0,
            "categoría": "OFICINA",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzbgeZrTA0AfEEKM088Pnj_1O3DDQeJqUqhX-B76wU0Q&s",
            "costo": 2.5,
            "usuarioCrea": "aortiz",
            "categoria": "OFICINA",
            "costoPublico": 2.5,
            "marca": "MAE",
            "activo": true,
            "fechaAlta": {
                "seconds": 1691633599,
                "nanoseconds": 890000000
            },
            "codigo": "navajcutterdelgadaind"
        },
        {
            "id": 1047,
            "itemName": "recibo de arrendamiento (venta individual)",
            "branch": "USUAL",
            "quantityAvailable": 389,
            "saleAmount": 1,
            "category": "OFICINA",
            "codigo": "reciboarrendamiento",
            "categoria": "OFICINA",
            "cantidad": 389,
            "nombre": "recibo de arrendamiento (venta individual)",
            "fechaModificacion": {
                "seconds": 1714774188,
                "nanoseconds": 653000000
            },
            "usuarioCrea": "aortiz",
            "categoría": "OFICINA",
            "fechaAlta": {
                "seconds": 1691689523,
                "nanoseconds": 78000000
            },
            "caja": 0,
            "activo": 1,
            "costoPublico": 1,
            "marca": "USUAL",
            "imagen": "https://www.lineausual.com/productos/big/RECIBO-DE-ARRENDAMIENTO-492442.jpg",
            "costo": 1,
            "comprarDespues": true
        },
        {
            "id": 1048,
            "itemName": "perforar hojas 4 x 1",
            "branch": "S/M",
            "quantityAvailable": 54,
            "saleAmount": 1,
            "category": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691775929,
                "nanoseconds": 690000000
            },
            "usuarioCrea": "aortiz",
            "activo": true,
            "fechaModificacion": {
                "seconds": 1719249645,
                "nanoseconds": 297000000
            },
            "categoría": "ESCOLAR",
            "costo": 1,
            "nombre": "perforar hojas 4 x 1",
            "costoPublico": 1,
            "categoria": "ESCOLAR",
            "comprarDespues": true,
            "imagen": "https://i.ytimg.com/vi/gCT6ngoqo8g/sddefault.jpg",
            "cantidad": 54,
            "codigo": "perforarhojas",
            "caja": 0,
            "marca": "S/M"
        },
        {
            "id": 1049,
            "itemName": "hoja etiqueta transparente t/c",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 7,
            "category": "OFICINA",
            "cantidad": 0,
            "usuarioCrea": "aortiz",
            "marca": "S/M",
            "fechaModificacion": {
                "seconds": 1715015513,
                "nanoseconds": 125000000
            },
            "caja": 0,
            "comprarDespues": false,
            "activo": true,
            "costoPublico": 7,
            "codigo": "hojaetiquetatransparentet/c",
            "costo": 7,
            "fechaAlta": {
                "seconds": 1692128513,
                "nanoseconds": 156000000
            },
            "categoria": "OFICINA",
            "categoría": "OFICINA",
            "nombre": "hoja etiqueta transparente t/c",
            "imagen": "https://coolprints.com.mx/wp-content/uploads/2021/09/Etiqueta-Transparente-uso-Foil.jpg"
        },
        {
            "id": 105,
            "itemName": "goma factis s20 (migajon) ",
            "branch": "FACTIS NATURE",
            "quantityAvailable": 13,
            "saleAmount": 12,
            "category": "gomas",
            "fechaModificacion": {
                "seconds": 1716322711,
                "nanoseconds": 706000000
            },
            "activo": true,
            "comprarDespues": true,
            "categoría": "gomas",
            "costo": 140,
            "cantidad": 13,
            "usuarioCrea": "aortiz",
            "caja": 0,
            "costoPublico": 12,
            "imagen": "https://pedidos.com/myfotos/xLarge/(X)FAC-GOM-S20.webp",
            "categoria": "gomas",
            "fechaAlta": {
                "seconds": 1647212063,
                "nanoseconds": 423000000
            },
            "codigo": "8414034020200",
            "nombre": "goma factis s20 (migajon) ",
            "marca": "FACTIS NATURE"
        },
        {
            "id": 1051,
            "itemName": "sticker tira materia ",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 7,
            "category": "ESCOLAR",
            "marca": "S/M",
            "fechaAlta": {
                "seconds": 1692156126,
                "nanoseconds": 246000000
            },
            "cantidad": 0,
            "costo": "32",
            "costoPublico": 7,
            "imagen": "https://tonypapelerias.vtexassets.com/arquivos/ids/241898/02940788.jpg?v=638447657390100000",
            "activo": true,
            "caja": 0,
            "comprarDespues": true,
            "fechaModificacion": {
                "seconds": 1717449102,
                "nanoseconds": 860000000
            },
            "nombre": "sticker tira materia ",
            "categoria": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "codigo": "stickertiramateria"
        },
        {
            "id": 1053,
            "itemName": "playdoh mini ",
            "branch": "S/M",
            "quantityAvailable": 20,
            "saleAmount": 17,
            "category": "ESCOLAR",
            "activo": true,
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1692578659,
                "nanoseconds": 977000000
            },
            "marca": "S/M",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "codigo": "playdohmini",
            "costoPublico": 17,
            "imagen": "data:image/jpeg;base64,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",
            "fechaModificacion": {
                "seconds": 1717698824,
                "nanoseconds": 890000000
            },
            "cantidad": 20,
            "costo": 17,
            "nombre": "playdoh mini "
        },
        {
            "id": 1054,
            "itemName": "lapiz de dibujo hb",
            "branch": "turquoise",
            "quantityAvailable": 11,
            "saleAmount": 15,
            "category": "lapiz",
            "comprarDespues": true,
            "categoria": "lapiz",
            "costoPublico": 15,
            "marca": "turquoise",
            "cantidad": 11,
            "activo": true,
            "fechaAlta": {
                "seconds": 1692578833,
                "nanoseconds": 660000000
            },
            "codigo": "lapizdibujohb",
            "imagen": "https://api-p1.y.marchand.com.mx/medias/743.jpg-515ftw?context=bWFzdGVyfGltYWdlc3w1MzM3N3xpbWFnZS9qcGVnfGgzMi9oMGIvODc5OTA1NTk3MDMzNC83NDMuanBnXzUxNWZ0d3xlMTI1NjNiYTI2Y2U3MmYzYWQyYjhmN2EzOWQwNTdkMzZiODMyNjliYTYwOGZmMGVjODZmNzA4YzlhNTVjZTZi",
            "nombre": "lapiz de dibujo hb",
            "usuarioCrea": "aortiz",
            "fechaModificacion": {
                "seconds": 1717177324,
                "nanoseconds": 131000000
            },
            "categoría": "lapiz",
            "costo": 15,
            "caja": 0
        }
    ];
    itemList = [
        {
            "id": 1,
            "itemName": "cubo de regalo",
            "branch": "S/M",
            "quantityAvailable": 2,
            "saleAmount": 27,
            "category": "REGALOS",
            "imagen": "https://previews.123rf.com/images/albund/albund1801/albund180100012/92910538-un-regalo-en-forma-de-cubo-envuelto-en-papel-de-embalaje-modelado-coraz%C3%B3n-y-atado-con-un-lazo-y-una.jpg",
            "categoría": "REGALOS",
            "nombre": "cubo de regalo",
            "marca": "S/M",
            "costoPublico": 27,
            "codigo": "cuboderegalo",
            "fechaModificacion": {
                "seconds": 1714616641,
                "nanoseconds": 679000000
            },
            "usuarioCrea": "aortiz",
            "comprarDespues": true,
            "fechaAlta": {
                "seconds": 1703291021,
                "nanoseconds": 570000000
            },
            "categoria": "REGALOS",
            "cantidad": 2,
            "costo": 27,
            "activo": true,
            "caja": 27
        },
        {
            "id": 10,
            "itemName": "silicon liquido 30 ml",
            "branch": "pelikan",
            "quantityAvailable": 12,
            "saleAmount": 14,
            "category": "silicon",
            "nombre": "silicon liquido 30 ml",
            "usuarioCrea": "aortiz",
            "caja": 95,
            "categoría": "silicon",
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_662660-MLM44839437438_022021-O.jpg",
            "activo": 1,
            "categoria": "silicon",
            "comprarDespues": true,
            "cantidad": 12,
            "fechaModificacion": {
                "seconds": 1720052737,
                "nanoseconds": 570000000
            },
            "marca": "pelikan",
            "costo": 8,
            "costoPublico": 14,
            "fechaAlta": {
                "seconds": 1643658073,
                "nanoseconds": 34000000
            },
            "codigo": "7501015220641"
        },
        {
            "id": 100,
            "itemName": "puntillas negras minas 0.5 mm elephant",
            "branch": "AZOR",
            "quantityAvailable": 42,
            "saleAmount": 8,
            "category": "ESCOLAR",
            "caja": 0,
            "marca": "AZOR",
            "cantidad": 42,
            "costoPublico": 8,
            "fechaModificacion": {
                "seconds": 1714616998,
                "nanoseconds": 840000000
            },
            "codigo": "7501428769096",
            "activo": true,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmA9JQAytr5wpcv92XR178j_an7AdAmpXmGOffMQ685ZbDO7KSAw2L_09ETetrlX42qRg&usqp=CAU",
            "comprarDespues": true,
            "costo": 2,
            "categoría": "ESCOLAR",
            "nombre": "puntillas negras minas 0.5 mm elephant",
            "categoria": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1646071209,
                "nanoseconds": 860000000
            },
            "usuarioCrea": "aortiz"
        },
        {
            "id": 1000,
            "itemName": "escaneo de documentos",
            "branch": "S/M",
            "quantityAvailable": 63,
            "saleAmount": 2,
            "category": "OFICINA",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "fechaModificacion": {
                "seconds": 1720634359,
                "nanoseconds": 950000000
            },
            "comprarDespues": true,
            "fechaAlta": {
                "seconds": 1684458765,
                "nanoseconds": 960000000
            },
            "categoría": "OFICINA",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEOJf8TX7wtQcoRbZuBrq1vTIjk0Yn3qpZQcJ-RVin8A&s",
            "costoPublico": 2,
            "activo": true,
            "nombre": "escaneo de documentos",
            "marca": "S/M",
            "cantidad": 63,
            "codigo": "escaneo",
            "categoria": "OFICINA",
            "costo": 2
        },
        {
            "id": 1001,
            "itemName": "bola de unicel #9",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 12,
            "category": "ESCOLAR",
            "caja": 0,
            "fechaAlta": {
                "seconds": 1684808073,
                "nanoseconds": 6000000
            },
            "fechaModificacion": {
                "seconds": 1714667869,
                "nanoseconds": 603000000
            },
            "costoPublico": 12,
            "nombre": "bola de unicel #9",
            "marca": "S/M",
            "activo": true,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_981019-MLM53457729397_012023-O.webp",
            "categoria": "ESCOLAR",
            "categoría": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "cantidad": "0",
            "costo": 12,
            "codigo": "bolaunicel#9"
        },
        {
            "id": 1002,
            "itemName": "hoja de acetato",
            "branch": "S/M",
            "quantityAvailable": 76,
            "saleAmount": 3,
            "category": "OFICINA",
            "fechaAlta": {
                "seconds": 1684896941,
                "nanoseconds": 467000000
            },
            "costoPublico": 3,
            "caja": 0,
            "fechaModificacion": {
                "seconds": 1716253888,
                "nanoseconds": 264000000
            },
            "costo": 3,
            "categoria": "OFICINA",
            "nombre": "hoja de acetato",
            "categoría": "OFICINA",
            "usuarioCrea": "aortiz",
            "cantidad": 76,
            "marca": "S/M",
            "comprarDespues": true,
            "activo": true,
            "codigo": "hojaacetato",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKicMX0fBau6luCSz_KgiYN_hTV1dhfRvSf9NlpQAmoQ&s"
        },
        {
            "id": 1003,
            "itemName": "Tramite del NSS y vigencia de derechos",
            "branch": "S/M",
            "quantityAvailable": 94,
            "saleAmount": 15,
            "category": "servicio",
            "costo": 15,
            "fechaModificacion": {
                "seconds": 1714617065,
                "nanoseconds": 270000000
            },
            "categoría": "servicio",
            "cantidad": 94,
            "nombre": "Tramite del NSS y vigencia de derechos",
            "usuarioCrea": "aortiz",
            "comprarDespues": true,
            "categoria": "servicio",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBjHUoMMab3TdSoqqd1WP3DYh1YbopCsh0UeQ9j8e-BA&s",
            "codigo": "tramitenssvigencia",
            "activo": true,
            "marca": "S/M",
            "costoPublico": 15,
            "caja": 0,
            "fechaAlta": {
                "seconds": 1685548608,
                "nanoseconds": 145000000
            }
        },
        {
            "id": 1004,
            "itemName": "navaja cutter grueso (venta individual)",
            "branch": "MAE",
            "quantityAvailable": 2,
            "saleAmount": 3,
            "category": "OFICINA",
            "codigo": "navajaindividualgruesa",
            "cantidad": 2,
            "comprarDespues": false,
            "fechaModificacion": {
                "seconds": 1720631915,
                "nanoseconds": 908000000
            },
            "activo": 1,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_909121-MLM43173515632_082020-O.webp",
            "nombre": "navaja cutter grueso (venta individual)",
            "marca": "MAE",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "categoria": "OFICINA",
            "costo": 3,
            "fechaAlta": {
                "seconds": 1685567829,
                "nanoseconds": 827000000
            },
            "costoPublico": 3,
            "categoría": "OFICINA"
        },
        {
            "id": 1005,
            "itemName": "tijera diferentes figuras ",
            "branch": "TRYME",
            "quantityAvailable": 9,
            "saleAmount": 19,
            "category": "tijeras",
            "fechaModificacion": {
                "seconds": 1718668998,
                "nanoseconds": 990000000
            },
            "nombre": "tijera diferentes figuras ",
            "categoria": "tijeras",
            "comprarDespues": true,
            "categoría": "tijeras",
            "imagen": "https://trymebh.com/wp-content/uploads/2022/03/3010-370x278.jpg",
            "costo": 10,
            "codigo": "tijerasdiferentecorte",
            "caja": 100,
            "activo": true,
            "usuarioCrea": "dcamacho",
            "cantidad": 9,
            "costoPublico": 19,
            "fechaAlta": {
                "seconds": 1685671723,
                "nanoseconds": 935000000
            },
            "marca": "TRYME"
        },
        {
            "id": 1006,
            "itemName": "marcador para vidrio",
            "branch": "PENMAX",
            "quantityAvailable": 4,
            "saleAmount": 60,
            "category": "OFICINA",
            "costoPublico": 60,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_986335-MLM43788279537_102020-O.webp",
            "activo": 1,
            "cantidad": 4,
            "marca": "PENMAX",
            "categoría": "OFICINA",
            "categoria": "OFICINA",
            "costo": 34,
            "fechaAlta": {
                "seconds": 1685673375,
                "nanoseconds": 925000000
            },
            "codigo": "marcadorvidrio",
            "nombre": "marcador para vidrio",
            "fechaModificacion": {
                "seconds": 1714617131,
                "nanoseconds": 594000000
            },
            "usuarioCrea": "aortiz",
            "caja": 0,
            "comprarDespues": true
        },
        {
            "id": 1007,
            "itemName": "plastilina barra cafe",
            "branch": "PELIKAN",
            "quantityAvailable": 0,
            "saleAmount": 13,
            "category": "ESCOLAR",
            "activo": 1,
            "costo": 8,
            "nombre": "plastilina barra cafe",
            "codigo": "plastilinabarracafe",
            "marca": "PELIKAN",
            "categoría": "ESCOLAR",
            "comprarDespues": false,
            "categoria": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1719358444,
                "nanoseconds": 311000000
            },
            "usuarioCrea": "aortiz",
            "cantidad": 0,
            "fechaAlta": {
                "seconds": 1685674706,
                "nanoseconds": 933000000
            },
            "caja": 0,
            "costoPublico": 13,
            "imagen": "https://www.officedepot.com.mx/medias/100047893.jpg-1200ftw?context=bWFzdGVyfHJvb3R8NDI0NTUzfGltYWdlL2pwZWd8YURNMUwyaGpPQzh4TURFek9UUTVNekl3TXprNU9DOHhNREF3TkRjNE9UTXVhbkJuWHpFeU1EQm1kSGN8NzVhOGI5M2NjOTdkMjdmZThiZmNmYTkxZDM3N2JmNTAxNjdlNTFjOGM5NjQwY2Q2NmRlNGRhNWVlZjFhN2VmMg"
        },
        {
            "id": 1008,
            "itemName": "pinzas de madera bamboo grandes",
            "branch": "KINTONG",
            "quantityAvailable": 1,
            "saleAmount": 15,
            "category": "ESCOLAR",
            "costo": 8,
            "usuarioCrea": "aortiz",
            "nombre": "pinzas de madera bamboo grandes",
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_830959-MLM44118369828_112020-O.webp",
            "costoPublico": 15,
            "cantidad": 1,
            "categoria": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1685674958,
                "nanoseconds": 517000000
            },
            "codigo": "pinzasgrandes",
            "marca": "KINTONG",
            "comprarDespues": true,
            "activo": true,
            "categoría": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1716345826,
                "nanoseconds": 649000000
            },
            "caja": 0
        },
        {
            "id": 1009,
            "itemName": "pinzas de madera klaus chicas",
            "branch": "klaus",
            "quantityAvailable": 2,
            "saleAmount": 22,
            "category": "OFICINA",
            "costoPublico": 22,
            "marca": "klaus",
            "costo": 14,
            "imagen": "https://www.hobbees.com.mx/cdn/shop/products/481511_01_600x.jpg?v=1486533998",
            "categoría": "OFICINA",
            "comprarDespues": true,
            "caja": 0,
            "fechaAlta": {
                "seconds": 1685675093,
                "nanoseconds": 873000000
            },
            "codigo": "pinzasmaderachicas",
            "fechaModificacion": {
                "seconds": 1714616893,
                "nanoseconds": 617000000
            },
            "activo": true,
            "categoria": "OFICINA",
            "nombre": "pinzas de madera klaus chicas",
            "usuarioCrea": "aortiz",
            "cantidad": 2
        },
        {
            "id": 101,
            "itemName": "LIBRETA PROFESIONAL MIXTA ",
            "branch": "SCRIBE",
            "quantityAvailable": 31,
            "saleAmount": 28,
            "category": "libreta",
            "imagen": "https://www.lahidalgo.com/wp-content/uploads/2020/05/CUADERNO-SCRIBE-PROFESIONAL-ESPIRAL-MIXTA-7517-C-100H.jpg",
            "cantidad": 31,
            "fechaModificacion": {
                "seconds": 1714617183,
                "nanoseconds": 551000000
            },
            "caja": 0,
            "activo": true,
            "usuarioCrea": "aortiz",
            "codigo": "7506129430986",
            "fechaAlta": {
                "seconds": 1646230812,
                "nanoseconds": 92000000
            },
            "costo": 710,
            "nombre": "LIBRETA PROFESIONAL MIXTA ",
            "categoria": "libreta",
            "costoPublico": 28,
            "categoría": "libreta",
            "comprarDespues": true,
            "marca": "SCRIBE"
        },
        {
            "id": 1010,
            "itemName": "pinzas de madera  chicas klaus colores",
            "branch": "klaus",
            "quantityAvailable": 2,
            "saleAmount": 22,
            "category": "OFICINA",
            "costoPublico": 22,
            "costo": 14,
            "comprarDespues": true,
            "usuarioCrea": "aortiz",
            "marca": "klaus",
            "fechaModificacion": {
                "seconds": 1714616922,
                "nanoseconds": 164000000
            },
            "fechaAlta": {
                "seconds": 1685675148,
                "nanoseconds": 492000000
            },
            "categoría": "OFICINA",
            "imagen": "https://fantasiasmiguel.com/cdn/shop/products/5415-12132_fecf87b8-e1ac-451b-931d-7be9be863cbb_395x.jpg?v=1635685036",
            "categoria": "OFICINA",
            "caja": 0,
            "activo": true,
            "nombre": "pinzas de madera  chicas klaus colores",
            "cantidad": 2,
            "codigo": "pinzasmaderachicascolores"
        },
        {
            "id": 1011,
            "itemName": "caja clips de colores",
            "branch": "LOMAREY",
            "quantityAvailable": 5,
            "saleAmount": 17,
            "category": "OFICINA",
            "cantidad": 5,
            "costoPublico": 17,
            "categoría": "OFICINA",
            "fechaAlta": {
                "seconds": 1685675432,
                "nanoseconds": 296000000
            },
            "fechaModificacion": {
                "seconds": 1710884449,
                "nanoseconds": 476000000
            },
            "codigo": "clipscolorescaja",
            "categoria": "OFICINA",
            "comprarDespues": true,
            "costo": 10,
            "imagen": "data:image/jpeg;base64,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",
            "caja": 0,
            "marca": "LOMAREY",
            "activo": true,
            "usuarioCrea": "aortiz",
            "nombre": "caja clips de colores"
        },
        {
            "id": 1013,
            "itemName": "seguros no #0 plata  3 x 1 ",
            "branch": "SELANUSA",
            "quantityAvailable": 65,
            "saleAmount": 1,
            "category": "MERCERIA",
            "caja": 0,
            "costo": 1,
            "marca": "SELANUSA",
            "nombre": "seguros no #0 plata  3 x 1 ",
            "usuarioCrea": "csanchez",
            "comprarDespues": true,
            "codigo": "segurosno.0",
            "costoPublico": 1,
            "cantidad": 65,
            "activo": true,
            "fechaAlta": {
                "seconds": 1686077722,
                "nanoseconds": 117000000
            },
            "categoría": "MERCERIA",
            "categoria": "MERCERIA",
            "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBhEIBwgVFQkQFRcWFxAYGBsZHhUYIB0XFhgdGhkkHTQmGCYxGx8eIT0mJis3MjIvIyQ1PDs4QzQ5MzcBCgoKDgwNGA8QFjclICUwNzctNS03Ky0tNzUtKystNS0tKysrKystKy0rKys1Ky0tKystNy0tKy0tLS0rLCstN//AABEIAQIAwwMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAABAECBQYDB//EADEQAQABBAAEAwYFBQEAAAAAAAABAgMEEQUSITFBUWETIjJxwfAGFEJS0WKBkaHhI//EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABgRAQEBAQEAAAAAAAAAAAAAAAABYTER/9oADAMBAAIRAxEAPwD9xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABiZiO4Mm3D49+I8PhGqL1U1ZFcTNNqnW5iPiqnwppjp709OsR3nT58L41kZeLRlXcPVq5G/cq59R0mN9I7xMT02nsHoBpauRcp5qZ6N1AAAAAAAAAAAAAAAAAAAGJnUATOnE/EXG7fC8beua/VuKLe9c0+s/piO8z4R/hdm5kWdUxG7tXw0ef8Qjq4LYzqZq4laiuurvE9ojy+Xbp2+fWZlweH4Jw2vi1FzjfFK6q7NdVPLMTNM5Ne9UU0dfctRPaP1dZnpuau5xGc33rmFgTdyJtTVVYqrmimZiN26t9oq5+kdpnc9em49LlWosU0V02o5bU7iiOkR0mI1HycvKs12MiL9VU3OIXdRTa3qinyjl8oidzVO5184YsVR+GL9d7B3VVMxHL1nvO6aapmfnM7/u7qThmJTh4kWondXeata5qp6zOvD5eEahW3OIAKAAAAAAAAAAAAAAAAMTOoRZuX7KYt243eq+Gn6z9/WY2zMqberdqnd6rtT9Z+/rMbYeJFjdy5O79Xer6R9/SIg0wsL2Uzdv1c1+rvV5ekLewmz8yjEs89XWqekUx3mfKFE/FL+qfY26d3a+kR9Z+/rLThvDqrNyb+Rd579Ua5vKO+ojw69Znx/tDbAxq4qm/kdb9ff8Apjyj7/mejTGoTRmOgCgAAAAAAAAAAAAAAAAlzcqLFHSN1z0pp85fTJvU2LU11z0hNgWa7tz85kR78/DT+2P5++m5hB9cLFm1u7dnd+rvPl6QqE2dmWsOzNy7V8o8ZnyiPGVGczLt4lmblyekf79IQ4dm5kXfzWVHv/pp/ZH8/fpHzxca9l34y82Na+C3+31nzl16KIphBminlhsCgAAAAAAAAAAAAAAAAADz/Fr2Tk5v5bCt01VW4iuqmqZiPGKYmdT3mP8AG/NfwvNu3aZtZtj2eRHeNxMT6xPjCDMrysDi1dcYlVVi7yzFdMb6xGpirXafn0nfc9nxDiFUV8s2adTHXU1a8PSJ7+fh471lXSzuJWsaYtURz5FXw247z6z+2PWf+JsXBuXb/wCazqua/wCER8NEeUR9VGBw2zh0/wDnG6571z1mqfOZnrK6I0qMU0xENgUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z",
            "fechaModificacion": {
                "seconds": 1718764832,
                "nanoseconds": 319000000
            }
        },
        {
            "id": 1014,
            "itemName": "papel cascaron 1/2",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 25,
            "category": "ESCOLAR",
            "categoría": "ESCOLAR",
            "nombre": "papel cascaron 1/2",
            "codigo": "papelcascaron1/2",
            "fechaAlta": {
                "seconds": 1686103000,
                "nanoseconds": 550000000
            },
            "costoPublico": 25,
            "costo": 25,
            "cantidad": 0,
            "activo": 1,
            "categoria": "ESCOLAR",
            "marca": "S/M",
            "usuarioCrea": "aortiz",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLxMO-DNRYowZcGtFZBxWX8NZKGEAON3-GUhfBQIHVZA&s",
            "caja": 0,
            "fechaModificacion": {
                "seconds": 1705526463,
                "nanoseconds": 171000000
            }
        },
        {
            "id": 1015,
            "itemName": "pintura vinci azul ultramar",
            "branch": "VINCI",
            "quantityAvailable": 7,
            "saleAmount": 13,
            "category": "ESCOLAR",
            "categoría": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1714617203,
                "nanoseconds": 158000000
            },
            "marca": "VINCI",
            "activo": 1,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6WZDhJv2wWwJJaiH_ZuyDEc7qhDBYD2F37uhJqkQJVA&s",
            "fechaAlta": {
                "seconds": 1686191984,
                "nanoseconds": 961000000
            },
            "caja": 0,
            "costoPublico": 13,
            "nombre": "pintura vinci azul ultramar",
            "comprarDespues": true,
            "cantidad": 7,
            "categoria": "ESCOLAR",
            "codigo": "vinciazulultramar",
            "usuarioCrea": "aortiz",
            "costo": 13
        },
        {
            "id": 1016,
            "itemName": "bolsita cuentas para pulsera de corazon",
            "branch": "S/M",
            "quantityAvailable": 10,
            "saleAmount": 10,
            "category": "DIDÁCTICO",
            "fechaAlta": {
                "seconds": 1687549789,
                "nanoseconds": 362000000
            },
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_803014-MLM44671354623_012021-O.webp",
            "categoria": "DIDÁCTICO",
            "cantidad": 10,
            "usuarioCrea": "aortiz",
            "nombre": "bolsita cuentas para pulsera de corazon",
            "comprarDespues": true,
            "costoPublico": 10,
            "caja": 0,
            "codigo": "cuantaspulseracorazon",
            "marca": "S/M",
            "activo": true,
            "fechaModificacion": {
                "seconds": 1714617213,
                "nanoseconds": 233000000
            },
            "costo": 10,
            "categoría": "DIDÁCTICO"
        },
        {
            "id": 1017,
            "itemName": "post it cuadrado",
            "branch": "SOFIA",
            "quantityAvailable": 2,
            "saleAmount": 20,
            "category": "ESCOLAR",
            "codigo": "postitcuadro",
            "imagen": "https://pedidos.com/myfotos/xLarge/(X)P3M-PST-2018LA.webp",
            "fechaAlta": {
                "seconds": 1687807650,
                "nanoseconds": 703000000
            },
            "costo": 12,
            "cantidad": 2,
            "categoría": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "activo": 1,
            "nombre": "post it cuadrado",
            "fechaModificacion": {
                "seconds": 1717437468,
                "nanoseconds": 54000000
            },
            "comprarDespues": false,
            "marca": "SOFIA",
            "caja": 19,
            "categoria": "ESCOLAR",
            "costoPublico": 20
        },
        {
            "id": 1018,
            "itemName": "Papel america dorado",
            "branch": "S/M",
            "quantityAvailable": 45,
            "saleAmount": 10,
            "category": "ESCOLAR",
            "cantidad": 45,
            "costoPublico": 10,
            "fechaModificacion": {
                "seconds": 1717463403,
                "nanoseconds": 667000000
            },
            "categoria": "ESCOLAR",
            "imagen": "https://cdn11.bigcommerce.com/s-ekt7a8p7f0/images/stencil/1280x1280/products/1443/11964/GAL603706__25877.1674389671.jpg?c=1",
            "codigo": "papelamericadorado",
            "costo": 9,
            "fechaAlta": {
                "seconds": 1688091287,
                "nanoseconds": 701000000
            },
            "usuarioCrea": "dcamacho",
            "activo": true,
            "marca": "S/M",
            "nombre": "Papel america dorado",
            "caja": 0,
            "comprarDespues": true,
            "categoría": "ESCOLAR"
        },
        {
            "id": 1019,
            "itemName": "papel america dorado 1/2",
            "branch": "S/M",
            "quantityAvailable": 50,
            "saleAmount": 5,
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1715916913,
                "nanoseconds": 651000000
            },
            "caja": 4.5,
            "categoria": "ESCOLAR",
            "nombre": "papel america dorado 1/2",
            "categoría": "ESCOLAR",
            "activo": true,
            "marca": "S/M",
            "costoPublico": 5,
            "costo": 4.5,
            "comprarDespues": true,
            "cantidad": "50",
            "fechaAlta": {
                "seconds": 1688091454,
                "nanoseconds": 485000000
            },
            "imagen": "https://cdn11.bigcommerce.com/s-ekt7a8p7f0/images/stencil/1280x1280/products/1443/11964/GAL603706__25877.1674389671.jpg?c=1",
            "codigo": "Papel america 1/2 dorado",
            "usuarioCrea": "dcamacho"
        },
        {
            "id": 102,
            "itemName": "block de papel marquilla 30H",
            "branch": "monky",
            "quantityAvailable": 1,
            "saleAmount": 75,
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1694121295,
                "nanoseconds": 488000000
            },
            "nombre": "block de papel marquilla 30H",
            "activo": true,
            "costo": 50,
            "marca": "monky",
            "categoría": "ESCOLAR",
            "caja": 0,
            "fechaAlta": {
                "seconds": 1646231418,
                "nanoseconds": 588000000
            },
            "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhAVFRUVFRYVFRcXGBgYFRYXFhgWGRUVGhgYICggGBolGxUXITEiJSkrLy8uGB8zODMtNygtLisBCgoKDg0OGhAQGi0lICUtKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAMIBAwMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAABgEHAwQFAv/EAEoQAAIBAgMFAwcJBAkCBwEAAAECEQADBBIhBQYxQVETImEyU3GBkaHRFCNCUnKSscHwFiRisgczNENzgqLS4VSTFYOjs7TD8UT/xAAaAQACAwEBAAAAAAAAAAAAAAAAAQIDBAUG/8QANxEAAQICBQoGAgIBBQAAAAAAAQACAxEEFCExYRJBUVJxgZGhwdEFEyIysfAz4RUj8QYkksLS/9oADAMBAAIRAxEAPwC8aKKKihFFFFCEVja2DWSihCxiyK9ZBXqihCjKOlRHhXqoNCFEURU0UJqKIqaKEKIqYoooQiKKKKEIoioqZoQoqJoaihElM0VFE005KaKmomhJFFTUTQhFFE0TTQiipooQiiiihCmiiiopIooooQiiiihCKKKKEKKKKKE0UUUUIRRRNRQhE0TUUUJyQTRUVNCFM1FEUUIRRRRQhFFFFCFFTRRTQiiiimhFFFFCETUioooQvVFRRQkvVFFFRSRXE2jvDasObbByQAxyrmABMSda6mJfKpMgeJ/WtKG38dLXFFy8uW1JyrCENl1Y5o4dADrVsFrXPk4dFVFcWtmD94hbp33w/wBS791fR9avH7d4f6t37o+NVsX4frn0rx2nj7/HrXUNCgjTxXMFNjSzcFZw35w/1bn3R1jrXsb74Xrc+5/zVXi5y/XH6tBuePv8etRqUHHj+lKuRsOH7Vpftpher/cPWKkb54X67fcb4VVmf0e/r0qS/wCf49aVShaTy7IrsXDge6tYb34TzhH+R/hXv9q8J57/AEt8Kqcv6OfLx9tS9w/qOvsFKowtJ5dk67F0Dn3VrHerCefHsb0dKBvVhPPr7/hVRPc/Xr9tYu0Pj7vreyoGhQ9J5dlMU2JoHPurjG9OE8+nto/anC+fT21Ti3Dp6vxPrr0tw+PL8T7KVRZrHl2Uq7E1RzVv/tRhvP2/bUjefDeft/eFU8Lh/D8Pf+hXouf16Pd6qKkzSeSK6/VHNXEN5MN56394VP7RYbz1v76/Gqbz+n9D3+uoL/nz9HsoqLNYorz9UK5v/H8P56395fjUjb2H89b++vxqmC/69fSoz/qfE86Ki3W5J152qOKun/x3D+ft/fX41I23Y89b++vxqlc/69vLlUB/11099FRbrckV12rzV3DbFjzyfeX41mTaNo8LqfeX41RmceHw4c+Ve0cdB7PHp+dMUButyRXjq8/0r2t31byXU+gg/hWSq1/o3YfKW4f1Tenyl51ZNZI8IQn5IM1rgRTEZlESU0UUVUrkUUUUIRNFFFCJL3RRRUVFa2NYhTGb/KJNJO3s+a+YxsZBqJFnyQTo0SOvHgdKc9peRwY+CmDSFtzCS+If5NeIyL3zchdAmuQKJAjXU8PXV1HllW/bRiFVHnk2ddB0ApOB4er0cT66ad3thWb1hbjh8xLAwY8lyBoNOVKkfl+p50+7nj90t+m54f3jcq6NMe5rJtMrehXOobGufIidnUKBuph/qv8Ae/4o/ZSx0ufe8fR1rxt040XLPYYizbt3Ly2iDZLuAVdmbMzQT3IAyjjxMVytr457mHxdu6ExCWMRhEDqGti4Tfsm7bIVj300BKmJMRINc3z4usV0/Ih6o4BdY7p2Ot37w9P1ax4jdnDIuZ7lxVkLJZQJZgqjVYksQPXWhvTjrxxN+wL1y0lqwlxOxUi4966bgTNcggW17MnLpPjEUh7a2ub2GDXGL3bttHyjWCSpnoiT6uQp+fF1itVH8NhxmudYAATdfh94KzzujZ+ve+8v+2sWK3WsKrMXuAKCxllygDUkmIAgca5272KvWcHcvucOrG5p2tx0swdIDBWZmOgAA1I06VOI3zS7gL1y5ZZHL3MKbRzMXfJ3sgIViMrcGVSNZiJo8+NOWUVTGokGG9zQAZGV0uX7Wpf2HAzdldIiZFxTpx07laOBwuHdsrl0B4ElSs+MgRWtgN4MamFtlivk2bVpQJLEoAuaFJnKjuYBgKeJra2Lgr2M7Rn7hRguY2bltLgIkOgcKT0II6dRVwjEWOPCaymCL2DjJdsbpWuV5/8ATr7qBuhb86/sX4V3MFhuztqkzlET1rZis9Yi6yvq8LVS0N0Lfnn9i6/Gg7oW/Ot7FplAqDRWIusirQtVLX7IW/PN7F1qP2PTz7fdFM5oFOsxdZKrQtVLB3QTz7fdFB3PTz7fdHp60zMDSNgNq3lxCq153UOUILEg65Z/OkaVFErVfB8PhxQ4tl6RPPj2XSG56+fOn8A+NeRuevnz9wdI+tTSKiKlWYusqKtC0JYO6A8+fuD/AHUqZtfX08fbVp1VjjvH0nn49a2USK9+VlHQslLhMZLJGlOH9GjH5Uf8Jv5lqzpqr/6Nv7V/5TfzDlVnmqKZ+XcFfQ/x7yvdFRU1lC0oooopoRNRXljRQhZqiiiopLR2qspGXN4TlPtpC23g+/iH+SjgvfbELm0Ca9mDMjoeMeNPe1VlYyBvAmPfFIO2rEPiG+T2B3V7xuzcGiiQvaHXoIXlx4G+jmTz9zjEKikibB9zHA9DilIHh6v1HL9daf8AdEfulv03Oc/3j0gdPVy05/rWrA3SP7pb/wA//uPW2nfj39CsVB/Ju6haW9+Da9cwNoXmt23xLBwkrcbLYvOIuAygyqymNe+CCIrb2/sPtMGcJhhbtCbIUQQiol627AAA/RU+k1uY/AC7cw9wuV+T3HuAR5Ze09uCZ0ADk8OXKt8GuWuqqkxmDu2r15pgm2qAahg6G4QfQcwitK1g3OES15LdlbGvIgrMx6DVmbX2nhVdku2yzAAEhVPEAgSWHI0pY822eLKFV4AHVmPoH4DpUrCvU0eO+M2cSGWgtM3TkJG0m20aZZrV1sNdxGKu27thMOpsdoqi4XyWzdCAX1VQc7qFdYlZD8RrXKx2xnwxvWjdLi49y6rMe8TcRAzPoBmLKSY04egNG5mEZFuF1KywiRHAVt7Vx2HVytxMzL/CDxE8zVkM5L7BNeap7YXmOawgNnZK77fnSrg7QtYTDZblo4iw63SrFlVz2T2XQsFJXuXGgwdQJ512dh7Su37j5xZRAq5ER2e5M95mYqqxwAAB5yaxbUxuHaywt24YgZe5HMc/RWhuoIvH7B/EUGGC0uNizh5Dg3om0ipC0NW1hV0n1Vz6VHECEYh+laWNyjJa0VhxN4IpY8Bxiow752e5OjNlTpkTQH1mW9deNrj5l/R+YqwOd5eU4SMpy0YdFFxAnJeMHtJLpyqCDE6j4Gja+I7OxccaELA8CdB7yK4+7/8AW/5G/Fa6e8Vhrlh1QSe6Y6wwJ9wpQnOdDBN9vynR3BxaXXTE+KTdlYK5ffKrwQM0knqOnOu9szdc27iu9xWCmQADx5TNc3d/Grh3ftQy5gBw4QenH2U1Ybatm4YS6pJ5ag+wipskBdaunTY0cucGk5B0WiW0DTitwCseIuZVLVkWuTtPGA8+6PeeAAHPp66hSIvlssvNgGkrFR4XmPtuFp2LNg8czXAkDUFj4RA/P3Gq+ujvNw8pv5uvKrC2RhSoLvozxI+qo8lffJ8SaQcUO+/2m6fW9ldHwxrmtIeZmQmud4o5rnAsEhm5Jm/o60xg+w/4jlVomqu/o8P74vHyX/OrRNOm/l3BQoX495XqpqBU1mWtFFFFCSxsaKhqKELPRRUMdKikubtQSPJVvAmPZpSHtq2B8om1hlMJE3C97lqB2hg9O6OXGnjaYleCn7X5foUh7YhflEDDLmyiO0L3W66do0HwgfnV9H95+5wqaR7ePwUsj4dfx50/7qEDC2/8/Xzj1Xyn8uf5cqedkYsWcAt0qWCqxgak99hAn9CttNtYBj0KxUEf2buyXN+XBxUD6NtAfT3j+BFNm6wjC2gfq6ceHKkEMcTfJYqpuOSZaFEmYk+GlWjYtKqhVAgKAIjhFZI/pY1i7cb0hrElby7PuC+9zKSrkEECeQEH2VobPxBsXFcpMcm0kHTTofGnrauLa1Ya4ihiI0IJHGCdKTr19sU4a6bdvKuWYIWJJ8ddapFq7VCpESLAlFaDDAyTIEuwsEzots42p5wONW9bV1mG68R4Uo7evZsVdSD3Ftknkcy8vu1v3MQqYa1Ys3wWu3kstcTiiuWZ2WeDZVIB6kHlXAxmEsl8bbt3LhRUwq9o1x3yK1028TFxySwQM3EmDmHLRw3hjprz8eFMlostsnfKdk0x4LbuGNsKLqtlAVoBaDHAxXRtuhGZYg8I0pLxu7mHwlz5vEu9x1yhGNuMi94ELbRRp1PWuzu/tZBZul3ASxOdzwWBLAx0kH10OYMjKCra85eSmGxBOusax7PjWHaGZ3CAutsJLZdC5YkZZGoAC8uOavAe2WS21zK752QAkOQmUuQV4QHX21itOFfQ4t8pI4kocuh4tqPTXHjDKpGU31Fo9snSnpnIjsdk1qafRLStpYUBQIA0AiBpWttZvmn9A/EVn7Vrjr82yqoPlxLExEAE6DWvS2A6wwBBEH0Vth5cSH625JOa+SrcBcCl/YWl7/IfxWmAuKVV7twQeDADxGaKbblqBNRorps2E9+qpgn0ySjvDtm4Ha0qKANMxGZmHUToB6qndzZCkreN5TlM5V5H+InX1aUx7RwlprZN0DKBJJmR4g9aS938wxCBJ1MEfw85irbnaV2YX9lGfkDIyRbK52BN/OVspSKfCwrkYvC5DmDyCdFI1HSD8a6+ISFJHKfzritaNwhcxWTqRxiCYHQmAKz0pwOTCla64nNjpWeiA+qITYLwM+GhbmzcWWLK2uWD6zOnp+NIWNEXLg/if+bpzqycHg0tqFRAB7SfEniT41XW1Fi9dGnlvy/irr+HtyZtnOQv0rkeJODpOAlM3Lvbg/2xPs3OfgatQ1VO4R/fE9Fz+VvZVrmnTfybupUaF+M7eyBU1AqayBbEUUUU0liaihqKELPXi6dK91ivGopLmbQ4cvXp75Ee2kPbTx8oE4dSSoyqc95uskkhY8PGnzHcOvrges0hbZvZflADWBmKjKiFnYDq8EBumvsq6jib+HyMCqKSfTx+DiEsAfl+h1qwd22HyW0CRwaQY5s1V8B4dOXhz61YO7dsfJrWg8k/zNW2m+wbehWOhe87OoSjveEF/LbRVAUFsvNm119UUzbm4fs7El/L72XkKXd78Klu7ecsxJtpcAAJAJbKcxAMLCkjUcKb9iWz2FvOqhsoGnDhpWV7x5YAK7T3Dy2tC8bV2qLFtfm85aRBMAR10PWuChbFSqWbKQQSR3Dz5EzHe/Cmj5Gl1IuKGnrSrj8OlrEZLTP3SoJEjIzSxGaNAEKtM6AnpVEwL1qor4IZIiTxaHe660CRMp6LDuXRw2yLVpHTE5LnaZQE8qcpmY68fYYrfxxyWhbs2EXu9kwVVICLIyADTLqSOUMdJms9nBMLTOx+ddMoLTKK0ADqCdCeYgDXLJ28IglU1ZjmdmEhczHOwiZA7+g1gZQTqKrDzlhxu6zEuU/tqxRnuikucbTeUm4TZ1q0dLCr1UAKT4EjWPCm3BIhtrCqoI8nQDXw51oYjBg3XJfQkBZYIoEQoLEMWdsrEBRookxInp4JBAtlYKiBDHULAOv+ZTMCQw0BkCT47HyAB6HZ/gTzTVMNjmzWhsnBOLl9kcBnyMcwkeXfU/6Ut8/oithi9t/nb2GQHXVQCw0ni3qmtnZKFi5GjQvKRPa4kGfCtfaO0ltkrcyG8HRFhLgWHyHVuHM865xhuc+eSCCXAkCbvcQN124K/Kny5BZfliOyrbYNrLMBCgQdM3MkxwrhY/aLQUAIA0JHEwIIHspuOEED/muA+ye0lw+XmZGYcATVwo5ZCENjjfbM2neBYqYhc+5amztjkXFuXSNNVUEQphtWPNvcJru3YjiOXPxpZ2RtY3MRat5myPbL96NdCRwJg0z3bICkgcATxPIemtLGgNAAkNCbBISAkkvezGMbi2p7iqpAHMxxPWOHhFdndfZqWk7SQXcA5jwjXQeFed6MFbNgXWBzgqqkcyzQAZMRrPKsO4l4XLVxTMpcK5SfJ1PQ8KGiRcft66EWM19FYxpkQbRpsv8AuOia7+JgqQCDXOxOCKnMpBX094fH8a6WITKsgc1HPmwFcXeXaC2Fbyi3Ys4AAIEEAN3iNZ5a1VSYYfCPpmc2B0gi0Sv3KijxCx98hnXQwOKzEIRrBIPoifxpC2wnz1zj5b8/H3U8bDwaNbW7JZnGrE8pMAAaAeikvbCAYi6Ojv6vhXS8NY5hLXumZWneud4o5rpFokJ3bl0tx1jGW+P0/wCU1atVZuUAMXa4cX/kPtq1KlTvyDZ1KroB/rO3oEUVFTWRbUUUUUIWOKK9xRQhezWvdNTcuVhLVFILRx47vAH0mF9dIe2L4jEAXLIlxK27LBj5Xl3GSC3Hgx59Yp82h5P0f83k/wDPspC2ziNL69sn9YO5btwJ10dzbUhtDz5HjV9GE3cPkYHptVFJMm8fg4jrsS3/AMdenup92C9wYe1CSI0Mr1P8QpCn8ufh76eLO1Fw2BtXGDMckIg4u+pCj6vAyeQB9FbKaZMG3oVkoPvOzqEv7yTduYqRqtpbfrCF+p5vTHuvfuNhrRAB7vh/upJsYq/lYtaLO7F7h7oBZiS3E6CTEdK7e4W18k4S6pRpZrUwQy8csiYI8f8A8507JLqEJrwzvlGQSPGP9wpbs3pv3rpjW8AoJADdmyJcAk6nLaOk6hjXS2ntg4fDrkGa64ItDQAEQC7FiBCyDHE6DqQs4PFX7aQijxl7RB8SCxk86hEExL7YZptaZWJus7Xe8gVFzuYzMpUqpkSS8lVIPImeitwrobM+a4gsYHeAYKF45V0mJ1LHVjJPIBf3a24962bOIMXViCMuVlzCIy6A9RW5vRtM2raWrflXEGZiYATgR4s0EeAnwoDbZm0/bu854pEEWFau00e5bsuq91XV5JgeQqeUe7MKNCQdTpzpp2VDfOhTBBg66luzBiRqALa6gc9JpMt7UZVgXYkZe42ULPOYkkeiPCmPc3b3bqbdxpuJx10b+Ic+HKPjURCIkMww3fCRwWbAXRZa4G14DQ6eXefiY85r6KXNvXu37Zgo0ud2ByQKD6dVNNuOUn5y0ST5JKiZiYORoDBZ5MOPqM7EsolrKiTydodSTALTmGaTPo9FNrQ2z7aZoBzr3gNogooYd5QA/eACHLMvyGmsCTrwjWtXEXhbt3ANSVbIBrmJWEAI08rSvHdDNhmBCsxNu5EKzOxaVJ+kpOn2QRWhi8LcCqAFWVuFY8pWawwtqp4AKzwOMwKGzlaUjYuJY2c1u/YclFNtYyM4DsCAO6BIPCm18SjWyQRqjaEgGYIIIniDIrjWLtwscotLaksiqCA2U925dYgMUXusTJloAknTPhMZYZCqzmTuCWgsSYVzBgZmMnpJpNyibTPBOdslqbz3gbVi2D3mvgkTqAgdiY9OT2iufuPCYnFISBmKMNeMgSdfGaybf2eXK3bV1i6BgA6xbdQ3zjWsoLAjLwIOYJ3ZjVZwwvriEdWttmi00M47rkAMCVGqlp8eHjVkwDbnVjWOeJtBMsCfiaeLN3O124eBW0QeeVrjlR6kVSR1YnnXG3gcXrxAnKMMqyQQCWZpyyO8OGokV2kysWCrE3bmVWkKRai0LjAf3IW2H/iLqBEy2hj8PcvqyWmJugvlL5VJUfJmJhBAHeaOJ11POqxksbJzrbTbz3DlYoDKNq29w8QGwVvqsqfSDqKWtu/2m9x8o9On640bBsXsHdZMUg7G42bMpE23JAgrxKsTy4E850xbZy9vdy8MwiZH0fGJroUB7XuLmmcx1BWPxFjmsAIlb0K6O6LRi7PHyiOXNf1wq1xVR7rN+9WOHlj3iPVVuU6f7xs6lV+H+x23oEUUUVjW9FFFFCFM1FTFFCS03NeBXtqgCopLT2h5P0fSwkeyDr6qQNtYmRfUYh2i4BkW0qqBrozAAsfSBrHpp+2h5PIeJEgeqDrSFt3E5lvKMRduZboGUKFtLGbunvS0a6gDlWijD18PkYHodBVFJPo4/BxCXD8OnTn0rd3qtEYLBkvINwQusDuP4x7hWjHD4eHL/mupvj/YMH9tfT/VvXQjH1M29CqvDPzJk2Ns62LA7o1WkG+kY1VUkfORpVkbI/qB9kfhVcW9cev+J+dY6OTN2xdx9z0zbz8LR6htOQjL8a07LDs5rb3j8jD+h/8A6656j5us2crteGH/AGrN/wAletnvGItEc3H5D867G82GDXraidbStrEAy3QfGuNsu189b+1+Yrp7038uJsaSexWJ4cW5dathXjeuF4uf73bB8Lxa2WCJYkAa6RPt5eyt/YWAti+GRe6AZ/KZMtOo4RFZMUSLYf0Gsm6NwNdb0HXTnwgfn76nEJySuZCvTJsm6zliWJ1IjkAMsQvAcTXXtmDFcnYDkBlP1m/BZrqXOtcCleiOXg2iVmElrbaJJd3sDoEuLba6EfPlUHMZBEArrAkHh665V3FXDh1uXAVeDcysIYBQsd3lJUkDQwRNdvbhbtsNE/1jT6MtcLGE9oyk8eZ18K1Q6QXUcPln+Ccc8vslmjiQvXHt41kKW7jllxNu29u4eLFQSbTcIILnTTUD60DBj73Y2cVe5oLJ04+Uo/Eity9sZ3wAs3lKMrsbTMRmBEMryvAZmcSORkcq8bNwbYnDYu0475tAHqXTUacpZOHWelaYbh5xfO0X4iYkd4vxtzp1eZdK4CRwn05bJrHiMHfL6XMN3QEE3ipVUAVQQUkGBrAOs6mtPG4bK6pbuKzDLLklELZpMEjRRoAT9XlRbuZmDHiQJ+0AM3v19BFecboR41W6O+QEh6TO4XjTp3r0cDw2GxziXO9bckzJsBzDZmTZsjAC3hWc3FuXLgBd0OZABwtoxHeUSe9pJ10EAa2517tcZi3Hk2QtmeRZsmYersffXvY94Js0MY0tmJ4EnRRPiSBW9uFsvsMIGby77tfcxBOfyJHLuBTHUms3ibshkWITaW5HF0zwAmuQxgEFrQLA7/rJc/fK2J4A9+0f/USuDvDAxNwARqugiPIHspj325fbs/8AupS3vQP3q5w+h/Ivs9Nav9OH+n/l8NVHjVrIewfLll3YP71Y/wARfy4f81cFU3u437zYOn9Zb5+I9tXJXT8Q9zdnVYKB7XbeiKDRQaxLeiigCpihJRRU0UIWmRUipYUCopLQ2iO7PdGvFhIHqg0g7bvF1vjtrtwLciACLVuCe7GYgnhrA5U+7R4T3Rr5TCY9Ag0g7cxOcXvnrt3LdIjUWbfHuwWMkfZHH26aIPXw+fucLPSfZx+PulLoX9ern1rf3twqrgcI4GrOk9NbbmtIfrj09366U4bW2GuJwWFV7/ZQbbg5Dck9k3dgEciTPh41upLg0sJ09CqfDSBFmV0Nkf2cfZ/Kq0wVsPjlB5v+fjVj7Mx2H7CFvlgEHe7NxpmCTB/iNcLBbuYe1iO2OLdihdivZQO4Aza5ujCsMKI1uVPOu06I2TxpWPeYaWm5sGnhyFv/AHVo5vm/XTljN3rV9LRN9lABK6KCcwTkfs++sa7qYfLlOIb225qgutK6VBp0CFAax5MxPNiSlTYxm/bPTN7yo/Otneq0ExdjWc1oHl9Y9ANKZsJuvhrLh+3eRp3mQDyhP0eMrFZNpbHwl9kuPeM21AGV0iAeJ0PM1OHEDZTXJpz2xojnMuMsMy1toCbHqpf3FJe84mMoMEcpPIcAfGnd8NhypVnMDQ6+HWK1tl7KweHYvaJBYSSWYgiYn21Ixm5JCxsYQZlbexpzFp6rHLTLr6a7eauZh71pQShMT0YiT6v4ayDHKeGY8foNymRw46VyKRRokSKXNIlZfPstLSJSXN29rewyTEtc9yjqPGuRjBN30aemNKY8ULbMjujEoCytlaBmAnTx0EEdfGsbYeyTmNhpMnyXnTXXXTwmrYcBzaOIRInbsvJVcVuXctLatoC0KTrGJ7K/mYxbLLbc6aAhTm1EToW9CN9arBuZGWDZcgcBlPh8fcelYDs2wZU4UQ570pocsgEz6PfU4MIw3TwU4cmxMo3EEEYHsZEYgFIV3BMb1wWSuZXcZSVUkBj5JaFI8JBHLQwPdnCXBei+mUhSwWVaWgi2DlJAUGDxnThqTWbeMC3jXCgAdwwNBqik++a1NoXzlLK0GV1Bg1fDBecnGS7FKjPg0cRG3ZIzW2i0A8rp4rp7P2Rca1ZsXLga2kG4oLd+J7onSCNJ00Y9BTtg3Md7iSTpw9AqtMPjrjZl7VxnNoSG4AlpymdOXDWtvB7XulrM3n7625OcgSt8ieMSVUg8zzqVJ8PFI/JbK28jNPNLMuGKb6ZC7dp62bpDMmrefZZvr3bgSCh4T5Dq3viKTN55W6rO09pAHAGUAEcOmo9frz4W/ddLjG857BFIm4xkm8SxYE6wJGuvCuNvMCLWDkkntZ1JnvKx5+FXUWAKJJrLp45wNOEuKpjxayyRnYJjce81v7vyMRZ/xE/mH60q6KpLYrRfs/4lv+YcuVXbWmn+5uxU0D2u2oooqawrcgVNRRQkiiiihC8OlYmFbNeLi1FJcbaZiPJHQkSfQqwZqvttYkOLnzt27lvMs8LNuJlIzHXXjC/GwtooZGoHqlvwMCq/2y5dHPaXLoW86hjC2kie4qhzmI6wvP0Vponv4fP3OFmpXs4/H3MuDPj7/D30/Yj+x4X7Fv8A+O9IgX8/w59KcMPvBh+xtW7lu6xtoi6BCMwt5Syy2uhMEjpW2lsc9oyRO1ZaJEa0kuMlw9g/2f8A8sf/ACEro3fKufZxX8lqtjDbWwVsQuHuxAXLltAASG5EcxNejt7C5i3YXNTw7kHNxESdDABHOKwVeLqlbzSYWsEz7Otg2LeYA9xeIB5Vle2qiezB14KoJ150u298bSgKuHaBAAzDQe+oO+q8sOeX0/H7FFVjavwo1uDrLsX8xYkC54AJbI4ngW5c/X41kVGYcbi8SNEXr3dAfCl8779MMPXd8Y+pXn9tn/6Zf+4Z4xwy06nG1eY7pVyDrcj2TCqXNQe05a5res8RoNIn15fRQ9l2kxcmRoLoA1mSI4f8+ApbO+tzlh0+8SOMV4bfO95pPY08Y+tTqcbRzSrsHTyPZM4tO3FGECB85IOsxA+0dfDpFDYdiT83yETdOsR0GnMzSod8r/1LXpyv1j69eG3wxPS37G6x1p1KLhxRXYOk8E3rhmEwixII77ToZBOnHQe+vQwuo0AACjynMBdY4xMga9PTSYd7sT1T7p69DXk72Yr6yfdHXrTFCi4cUq9Cx+7072bbrA7mUTwzT4RPjWear79p8Uf7wepE69CKx/tJivPf6bccfs06lEwSr8PQV53w/tbnwt9PqD4VpWLLXLRCiWJXSQOBHUxw1rxjL73Xz3CWYwCYUGBIGg0rSuLcj5q89o6arpPHlWg0WTBkgZQkVWKe9zi2I4llolO7dbcuvhNlXhMICRkZQWUZijNInlpBnSuhg93LwFvye4iaZvpC47MNAdAr+0euk8WsVx+X3/U5HLw4+qobC4g8cfivVfuDl4GqvKpGCfm0bFPFjd+/b7QynftXbcBmIlmzIfJ9v50q75js/kltoz9ounMhUIZgDqRJGvjWgdnOfKxOIbj5V125Dqda8YbYltHz95mHNpPP28/fTq0ZzgXIrUFrSGrr7LPzto/xp+NXiao/DaOngy/zfrSrxp08SLd6jQDY4bOq8ipoorAugiiiihCKKKKEIoqYoikorXuWpIOhA5fGkLbOx8Q+YZb91s7kErlRV5Ko7Rp9IAmrFoq2DFMMzAVcWEIgkVUw3bxX/Ttz+r05a/jWRd2MV5g6/Z6c9fw8atWKK1/yD9Uc+6yfx7NY8uyq1d1sV5g8uadOXerKu6WK8z0+knv72tWbRFL+Ri6o590fx0PWdy/8qtE3QxOnzajh9JfHx0rIm52J07qjh9PXieYH60qx6KR8Qi6Bw/akPD4Wk8R2VdpuXf01tjhzPU8or0u49/m9r2sec8clWFFFI0+NhwUhQIOPFII3GvTrdt+nWfKn6vSoO4lw/wB7b9GViOPwp+Ioy1E02NhwClUYGg8SkQbhPzxA+4Z4z1qf2Bb/AKhf+2Y4zwz09RRFKuR9PIdkVGBo5nukkbhdcT7LevGeObp769DcJf8AqD/2x1nhmp0y0RSrkfW5DsnU4GrzPdJ67jW+d5vujrP4fHwr0NxbXnX9i9Z6U3RUxSrUbWKdVg6qU13Fw/17n+nr9mpG4+G+tcPD6Q1iei+PupropViLrFSq0HVCWU3Kwo5OeHFz0jlwrKNzsJ5k/ffpHWmGil58XWPEp+RC1RwC4a7q4Qf3A9bP8ayru3hB/wDzJ6xP4116Kj5j9Y8SpCGwXNHALmpsXDLww9oR/AvL1V0qKKgSTepgAXKKKmihCKKKKEIooooQg0UUUghFFFFNCKKKKEIooooQiiiihCKKKKEIooooQiiiihCKKKKEIooooQiiiihCKKKKEIooooQiiiihCKKKKEIooooQiiiihC//2Q==",
            "usuarioCrea": "dcamacho",
            "cantidad": 1,
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "codigo": "602760000513",
            "costoPublico": 75
        },
        {
            "id": 1020,
            "itemName": "hoja decorada (diferentes figuras)",
            "branch": "S/M",
            "quantityAvailable": 5,
            "saleAmount": 1,
            "category": "ESCOLAR",
            "codigo": "hojadecorada",
            "fechaModificacion": {
                "seconds": 1717447069,
                "nanoseconds": 236000000
            },
            "usuarioCrea": "aortiz",
            "cantidad": 5,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_702320-MLM44728963656_012021-O.webp",
            "costo": 1,
            "costoPublico": 1,
            "categoria": "ESCOLAR",
            "nombre": "hoja decorada (diferentes figuras)",
            "caja": 0,
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1689012769,
                "nanoseconds": 931000000
            },
            "activo": 1,
            "comprarDespues": true,
            "marca": "S/M"
        },
        {
            "id": 1021,
            "itemName": "impresion de tenencia y/o refrendo",
            "branch": "S/M",
            "quantityAvailable": 15,
            "saleAmount": 6,
            "category": "ESCOLAR",
            "imagen": "https://www.eleconomista.com.mx/__export/1708731056973/sites/eleconomista/img/2024/02/23/tenencia_refrendo_edomex_2024_x1x-min.png_554688468.png",
            "fechaAlta": {
                "seconds": 1689297101,
                "nanoseconds": 784000000
            },
            "categoria": "ESCOLAR",
            "marca": "S/M",
            "categoría": "ESCOLAR",
            "costoPublico": 6,
            "usuarioCrea": "aortiz",
            "nombre": "impresion de tenencia y/o refrendo",
            "costo": 6,
            "activo": true,
            "fechaModificacion": {
                "seconds": 1716338934,
                "nanoseconds": 389000000
            },
            "comprarDespues": true,
            "caja": 0,
            "codigo": "tenenciarefrendo",
            "cantidad": 15
        },
        {
            "id": 1022,
            "itemName": "hojas blancas oficio 3 x 1",
            "branch": "S/M",
            "quantityAvailable": 76,
            "saleAmount": 0.5,
            "category": "ESCOLAR",
            "costo": 1,
            "categoría": "ESCOLAR",
            "activo": 1,
            "caja": 0,
            "fechaModificacion": {
                "seconds": 1720206585,
                "nanoseconds": 699000000
            },
            "usuarioCrea": "dcamacho",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQJR8nbnn4hoCjWyX8Inlzje5pxOqe09MRUfJe51A5IQ&s",
            "codigo": "hojasblancasoficio",
            "categoria": "ESCOLAR",
            "nombre": "hojas blancas oficio 3 x 1",
            "costoPublico": 0.5,
            "comprarDespues": true,
            "cantidad": 76,
            "fechaAlta": {
                "seconds": 1689297313,
                "nanoseconds": 678000000
            },
            "marca": "S/M"
        },
        {
            "id": 1024,
            "itemName": "Pelón Pelorico",
            "branch": "Pelonpelorico",
            "quantityAvailable": 1,
            "saleAmount": 8,
            "category": "Dulce",
            "costoPublico": 8,
            "costo": 60.5,
            "categoria": "Dulce",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "fechaAlta": {
                "seconds": 1689732547,
                "nanoseconds": 83000000
            },
            "fechaModificacion": {
                "seconds": 1701197350,
                "nanoseconds": 122000000
            },
            "nombre": "Pelón Pelorico",
            "codigo": "pelonpelorico",
            "cantidad": 1,
            "marca": "Pelonpelorico",
            "imagen": "data:image/jpeg;base64,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",
            "categoría": "Dulce",
            "activo": 1
        },
        {
            "id": 1025,
            "itemName": "lustre azul turquesa",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 5,
            "category": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "codigo": "Lustreazulturquesa",
            "categoria": "ESCOLAR",
            "categoría": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1714777287,
                "nanoseconds": 96000000
            },
            "marca": "S/M",
            "fechaAlta": {
                "seconds": 1691011185,
                "nanoseconds": 266000000
            },
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcqmUufcvEuMJhRsqNmQluHom2SRVWpnbITNxocH3Cfw&s",
            "caja": 0,
            "costoPublico": 5,
            "activo": true,
            "nombre": "lustre azul turquesa",
            "costo": 5,
            "comprarDespues": false,
            "cantidad": 0
        },
        {
            "id": 1026,
            "itemName": "juego de geometria  tryme",
            "branch": "TRYME",
            "quantityAvailable": 1,
            "saleAmount": 90,
            "category": "ESCOLAR",
            "nombre": "juego de geometria  tryme",
            "activo": true,
            "marca": "TRYME",
            "categoria": "ESCOLAR",
            "cantidad": 1,
            "caja": 0,
            "fechaModificacion": {
                "seconds": 1718671307,
                "nanoseconds": 490000000
            },
            "usuarioCrea": "dcamacho",
            "categoría": "ESCOLAR",
            "costo": 90,
            "fechaAlta": {
                "seconds": 1691011271,
                "nanoseconds": 54000000
            },
            "costoPublico": 90,
            "codigo": "6971249520946",
            "comprarDespues": true,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1vormGFFDdxCvPRkMixxwcihXHVNL1Lb90mP1gyrnuQ&s"
        },
        {
            "id": 1027,
            "itemName": "papel china verde bandera ",
            "branch": "S/M",
            "quantityAvailable": 5,
            "saleAmount": 2,
            "category": "MANUALIDADES",
            "fechaModificacion": {
                "seconds": 1713854263,
                "nanoseconds": 301000000
            },
            "marca": "S/M",
            "costo": "2",
            "cantidad": 5,
            "codigo": "chinaverdebandera",
            "usuarioCrea": "csanchez",
            "categoria": "MANUALIDADES",
            "activo": true,
            "nombre": "papel china verde bandera ",
            "costoPublico": 2,
            "fechaAlta": {
                "seconds": 1691076580,
                "nanoseconds": 856000000
            },
            "caja": 0,
            "imagen": ""
        },
        {
            "id": 1028,
            "itemName": "post it colores transparente",
            "branch": "sticky note",
            "quantityAvailable": 0,
            "saleAmount": 20,
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1717437468,
                "nanoseconds": 54000000
            },
            "usuarioCrea": "dtorres",
            "categoria": "ESCOLAR",
            "cantidad": 0,
            "fechaAlta": {
                "seconds": 1691430518,
                "nanoseconds": 610000000
            },
            "comprarDespues": false,
            "activo": true,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8Uf3oGyvENEbtZqYqC25kI7nepey-_-SfwQ&usqp=CAU",
            "costoPublico": 20,
            "marca": "sticky note",
            "costo": "20",
            "codigo": "postitcolorestransparente",
            "nombre": "post it colores transparente",
            "caja": 0
        },
        {
            "id": 1029,
            "itemName": "post it cuadro negro",
            "branch": "sofia",
            "quantityAvailable": 2,
            "saleAmount": 16,
            "category": "ESCOLAR",
            "costoPublico": 16,
            "codigo": "postitcuadradonegro",
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691430811,
                "nanoseconds": 420000000
            },
            "nombre": "post it cuadro negro",
            "cantidad": 2,
            "fechaModificacion": {
                "seconds": 1714777561,
                "nanoseconds": 309000000
            },
            "marca": "sofia",
            "activo": 1,
            "usuarioCrea": "aortiz",
            "imagen": "https://m.media-amazon.com/images/I/61AWW2tnskL._AC_UF894,1000_QL80_.jpg",
            "caja": 0,
            "categoria": "ESCOLAR",
            "costo": 16,
            "comprarDespues": true
        },
        {
            "id": 103,
            "itemName": "cartulina blanca ",
            "branch": "APSA",
            "quantityAvailable": 81,
            "saleAmount": 5,
            "category": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1646418593,
                "nanoseconds": 669000000
            },
            "costo": 275,
            "costoPublico": 5,
            "categoria": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "comprarDespues": true,
            "fechaModificacion": {
                "seconds": 1720141395,
                "nanoseconds": 780000000
            },
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_660820-MLM46090690928_052021-O.webp",
            "marca": "APSA",
            "activo": true,
            "codigo": "790209603606",
            "cantidad": 81,
            "nombre": "cartulina blanca ",
            "categoría": "ESCOLAR",
            "caja": 0
        },
        {
            "id": 1030,
            "itemName": "marcatextos azor amarillo",
            "branch": "AZOR",
            "quantityAvailable": 3,
            "saleAmount": 14,
            "category": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "caja": 0,
            "costo": 7.5,
            "fechaAlta": {
                "seconds": 1691431160,
                "nanoseconds": 27000000
            },
            "cantidad": 3,
            "activo": 1,
            "categoría": "ESCOLAR",
            "categoria": "ESCOLAR",
            "codigo": "7501428722794",
            "imagen": "https://papeleriadelahorro.mx/cdn/shop/products/623109_b67557b0-83d2-4495-9f5b-9db01f90b2b0.jpg?v=1666622780",
            "nombre": "marcatextos azor amarillo",
            "fechaModificacion": {
                "seconds": 1707863820,
                "nanoseconds": 224000000
            },
            "marca": "AZOR",
            "costoPublico": 14
        },
        {
            "id": 1031,
            "itemName": "marcatextos azor naranja",
            "branch": "AZOR",
            "quantityAvailable": 5,
            "saleAmount": 14,
            "category": "ESCOLAR",
            "activo": 1,
            "categoria": "ESCOLAR",
            "nombre": "marcatextos azor naranja",
            "fechaModificacion": {
                "seconds": 1714774039,
                "nanoseconds": 897000000
            },
            "cantidad": 5,
            "costoPublico": 14,
            "costo": 14,
            "imagen": "https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00750142872466L1.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
            "comprarDespues": true,
            "usuarioCrea": "aortiz",
            "caja": 0,
            "fechaAlta": {
                "seconds": 1691431264,
                "nanoseconds": 277000000
            },
            "marca": "AZOR",
            "categoría": "ESCOLAR",
            "codigo": "7501428722817"
        },
        {
            "id": 1032,
            "itemName": "marcatextos azor azul",
            "branch": "AZOR",
            "quantityAvailable": 1,
            "saleAmount": 14,
            "category": "ESCOLAR",
            "costo": 14,
            "marca": "AZOR",
            "cantidad": 1,
            "caja": 0,
            "imagen": "https://www.cyberpuerta.mx/img/product/S/CP-AZOR-3012300AZ-1.jpg",
            "codigo": "7591628722890",
            "activo": 1,
            "fechaModificacion": {
                "seconds": 1696372226,
                "nanoseconds": 380000000
            },
            "usuarioCrea": "aortiz",
            "nombre": "marcatextos azor azul",
            "categoria": "ESCOLAR",
            "costoPublico": 14,
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691431669,
                "nanoseconds": 259000000
            }
        },
        {
            "id": 1033,
            "itemName": "marcatextos pastel retractil",
            "branch": "CHOSCH",
            "quantityAvailable": 2,
            "saleAmount": "20",
            "category": "ESCOLAR",
            "caja": 0,
            "codigo": "6924247417367",
            "costo": "20",
            "fechaAlta": {
                "seconds": 1691432138,
                "nanoseconds": 65000000
            },
            "fechaModificacion": {
                "seconds": 1701205461,
                "nanoseconds": 223000000
            },
            "costoPublico": "20",
            "nombre": "marcatextos pastel retractil",
            "cantidad": 2,
            "imagen": "https://cf.shopee.ph/file/5444f40b35ed7f4881770c16f22a9c91",
            "marca": "CHOSCH",
            "activo": true,
            "comprarDespues": true,
            "usuarioCrea": "dcamacho",
            "categoria": "ESCOLAR"
        },
        {
            "id": 1034,
            "itemName": "calculadora practica eco calc",
            "branch": "datexx",
            "quantityAvailable": 0,
            "saleAmount": "35",
            "category": "ESCOLAR",
            "codigo": "6746943123",
            "caja": 0,
            "marca": "datexx",
            "activo": true,
            "nombre": "calculadora practica eco calc",
            "cantidad": 0,
            "usuarioCrea": "dcamacho",
            "categoria": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1713572276,
                "nanoseconds": 426000000
            },
            "costoPublico": "35",
            "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhIWFRUXFRsYFxUXGBcaHhUXFxoZFhgYGBcaHSggGBomGxYZITEiJSkrLi4uGB8zODUsNygtLi0BCgoKDg0OGxAQGy0mICYtLy8vLTIvLS0vNTIrLS0tLS0tLS0tLS0wLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABQYDBAcBAgj/xABAEAACAQIEBAQDBgQEBAcAAAABAgADEQQSITEFBkFREyJhcTJCgQcUUpGhwSMzYrFy0eHwJEOC8RYXU2OSssL/xAAaAQEAAgMBAAAAAAAAAAAAAAAABAUCAwYB/8QAMREAAgECBAMFCAMBAQAAAAAAAAECAxEEITFREkFhBSJxgfATMpGhscHR4SNC8RSC/9oADAMBAAIRAxEAPwDuMREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREARE8vAPYkPxjj9DDKS7ZmA/lpYsfS17D6kTlfHPtPxFaoKNMfdaZYBnsGqgHS92sE+m3eb8Nh54htQtlrnp5a/IwqTUEm+Z1fjPH8NhFzV6qp2Xdm/woNT+UiOF8+YSvWGHtUpOTZRVTLmJ2A1Niel7XnMeOcFXD1qdUvUqOtQNXbOKhVVytndjrc30uBexFjudPEVy9N7O1U5g6VSLClY5iqMwzt2sLD00kuODg3FK7v/bRLO2zWWtnJNp5LIj1MRKDzP0LPZVOSeZRiaCCoR4oGVvUjr9d/rJ3iHEqVBDUq1FRR1YgD6X3PpK+VOUJuDWayJMZqUeJaG9E55x77RMgAw1BiG0FWqrKp9VXdh6m31mth+ba9Oq5NXx0pH+MjUwhAvYtTKi1hvYn/Ob3haiScsr/AJS5XSzaSu1ma3Xhex0yJr4bEJUUVEYMrC4I6gz6r4hEUu7BVAuWYgADuSdpG6G4y3i85/zP9oopIfulI1e1ZgRT7eXq+ul9B6yIp8z4qnXqMtd63ggNXpVKYUMu7GmyiyaHQNb6yT/y1Ek5ZXvrflZZ2Ttm0le2bNLrxTsjrETVwOMStTSrTOZHUMp7g/vNqRs1kzcIiYMViUpqXqOqKN2YgAfUwDPEi+F8cw2JJFGsrldwNwO9jrb1kpPXFxdmrM8TT0ERE8PRERAEREAREQBPJ7OFfadxTF4jGV8O+K+6YTDlFIBINUuobOQCC4zMB2AF7EgzxtLU8bsdR5i50weCUmtVF/wg3JPb1PoLmc6/8za+NqmhRpsgOmVQcyi+pqHf0sOv1tUeFYBSbYWgQNf+LxAOZrgqxVL5jfNcEZLZQd97vyzgqtKoatFMzklqlRgAGZh5nciwB16SFXqr3Ltt7cuu/wAzfTi9SW4Zy8WVnxGZPwi4BtuWbt9ZqY/hWDq03w1Gh94qspXxbA+GT8wc6LbfTSWAcKas9sTU8SwDGmpKooa+UaasTlPbaQnNnN9Dh6FLikwzKlNPNnDD48osFYMFa5Pwtvc2GVCl7JqVNcLXP+34R5UqKWUs+nIpmMwFenWOHxCF3UAoq2yWt5SqKAtt7n3m2MK7ZVYWzA5USwPqWdhYDXZbzDjeb8TjP4tPCJQVQQtTEOT5QQx8h1qFcrG+ws3tNHBcNq1GbFPiKleiqlmYKQ1ZhckUx/6Vrbb6jvLqv2o1BNRV8tdL6ZJb+XkVscBxTfFJ2+3V9Cz8KwXgt4ubKdLBSco7G7G5P+c0eN8v4nEOa1Oq9V11s7arbXynYe2k1Kn3zHjw6GHNJdhUqXuBsSqbn3tb1ly5d5VbC01Fas5vZWIIv2F+ii9h133kGni8TSq+2c+KfNJLhWyv9bO/iSvY0nB0+G0eTbd3u7eOnLoVnG8bGIo06XhnOFVqgQsv8RQR52bbXUgAm4Guk1cRVcratVzk/IoyhydSSqAFzc3ubTNzhjeHCvT8CoxqkENSoKajsflIINlc7EE32uJA3xbOgo06dIO3lQsGcKpN6tVhut9LLoDYHUgyxqYzDwgpxWaz8N+9yWS0V3sQ/wDnq1JtPTS+/l+XYvnJ/EsRhqZV/h+VSdR79pG81YPGY1rrVaoBqKPwqvtbQn1bX1kXX4s5vhaAerUXR6mg8wOp7b+wlz5V4fjFofxiBpctYk23sB8x/T3lXDFYqFZYh2TefAknlvvG+91uTlTpOn7JXaX9nlv8bbeWdiuYjiniYZcJVpt43w1VUkMxRhYux8qAhR30Y2A0Mx+C7KPvFXN2QaZiSNwoBqNoN+wlt5h5douvi0yfEQ3Z9zUFgxsLi5C2YW9pBrTUA+Fe53rMfzy6XP0tvrfeXlGdOrGM4qzu3ydm9nnZPor28CqxMpwk4vPbr5fmy3JjkfizYf8A4aropJKg7oetx8t97H17zoVPEqRcG841VK0xe4A61N9d7KNr+ov7iT1HixZMq1PLexIOhOx19+krO1a9KnU4k7yfJb/a+zz6Evs72k4NSWS0fTbr5ZZkvzP9oWHw16dK1aqNLKfKp/qbv6C59pR+Zji69L73iKylfiVFuECkgeT8XxL5tRr8V9JMYzlujWu1Sy/1pof9frIGrWr0FXDFz4Ss2SqfMMt7gKtrBhvds1r6WkvAVqUlFQVp81K12lrw/wCJnuJUo3cneO6+5tjG+DWNdPDV1N8P4RuaijdWVdChW4u1jp1tOt8H4imJopWTZhe3VT1B9QZx/A4VFBFNf8VRjYXvuTu1/wAIlq5IxngOaYzGk27EWCtsCB0B0GvpE8L/AA5XvHfa22dt9XnfTQj08XGNRRej9euWmZ0WJ5eeyuLIREQBERAEREASr818BNdkqIqlvha9tujft+UtE8MwqU1OPCz2MmndFDwPBaCZ3qnOaYJI2+EXPk3I9T+UlmxBBsqqtNQL6eTchwWtYBVsfU3HSecVpU6LtULgZyGKtquZbLmyDzMcuna4BlZ4pzCdFoqAdQpOmUHoEvlA063mi9OirZLos368TLhnU1JqviqSDO7G1reLndLix0ADZ6pB1sdsxsRKDxPC0sbiBiEYlqVPwgKqAoVYswIRSLWuRvfa82KlPxGD1Was7bKtyWt2G5X10HvPujWNN1aplVFIvQSxJBF7O9wFNtbX7STDB18RB8KUU1lfV+X6t1Ncp0od157+vtqa3DeUTUcPiKj4uouwIy019fDHlvrudzL3huBKoDVmt/Sv9r+w6dptrUAak9Jc1J0uuUXF9wRbQZgfiPaeFxbMWDWOYFGW1mJBJdtNFNrf7EJYfik3U7zW+SXkbnV5QyM1NACqogIUksFtr0B1Otr9d9+kq/P9CtXoVUwzFKhXIx1HkzDMue+W5s4sL79Om3xHjSjyD+L0CgEIBbLYi96mh66SvcUatX89R7BTcXNgp6baD6XMSrwiuGGf0X59aGdOhKbV/wBlXw/L9VL0cPRWghAD4irkdyLHMEVSeptcnYAd73LlvlggHwwSzfzK9Q3aoe7MdT7DQSV4LRpVKDVwfEdPiW2gI1JC31uLkX06a2k995LAZL5MtibqApa1rn/Cb+XraaY0qlVJVpZbLn1bPZ/wScEu8tzUo8Kp0VYqA9Qi4a3zXsbDYEaWJO5mzxLFAKoDMhGq5swJI6BT5nOXN3HvcTQxmNWiu6j+oqQ1wAn8Omd75Qb7aiQ2I4jWq+VCyLrdibuQdTdvkHoLST3Ka4fktfj6+Rpacu9Jn3xbmGnhrkAEgFmVRrlsSRUvcUk2PeyqNpzfh3NeIrOaeEwviC+j1MxVNCxLBRtYEgXvpoL6S2cRoUkoVFFM1VKlXt81wbqu12Iva5/KRVHlpKlGnSXEN93C7IADVVrMM9TqPQAbmYx7QVKLi8k9vPnq29NnuR4KjiZ3hnw/fn1WWXXwIo8PbGVSr4h6tUEA1KYApYZbgsoF9XPmWx10BOkk8Py5jqlcUhUCYZDamlO5ZwNiR+LuzHfYS9cA5YCIqBRRpLso3/Xr6nWT9BUQZaSnqDv5tbE3AJNmFuwv2mqHtajTtwx5b+KW/UltxirasjcDwVVQNWe4GgGpF9vMev009bTbxmHXEIcOaYFrZRl0R11vm2tfS25DX6z6r1bU8hKsFGU2IGUWtdzfy2F9tyLSq8W5qVR4dAZmG25UWtbKG3IsNT1113kqD9i1JOz16t+tvga3F1VwvT5GSkmcWayqDbwxodOjHTS/Qad7bzKxQGxNlGyfudLL9bn+8r331gpqVKmTNqbbsd737+okGnONBqn3emuYfiJbzW3AN9DbXqJfOvFJSXNZLq16V9epWUuyMTXspJJN2vLK+fJc+nI7Zy1xYVkyE+df1HQ/5yenGeCcWajVV1Nxup/Ep0IP6g+onXcFilqotRDdWF/8x7zn8NVlK8KnvLUtqtLgeWhsxESUahERAEREAREQCr86cMzoK6jzJo3qv+h/uZQHyhxnFxsRr7X+m/0nY6iAggi4IsR3BnK+ZOGGjVanY91PdTt/l9JWYynwzVRen6+hJoyuuE0+P4dkVa1ElGRcpyEg5CO46byhcQ4gtIAEMxJJC7C46kzp3Cj41BswuV8nqU2B9wRYeyyh8w8GCv4dQXANwRpcdCD2InW9m4uVfDuNNpTWnr6bFPiIRhVu9Cd+zjnR3pVMFUVSynPS3ACXBK73JDa7/Me0sGNxTsNT7DYD2A0EovCcKy1aIpgU8z2RmBVCdjdraixsfeXWuNwCDYkXBBGmh1Ht+k53t3C1aM4tz4lLXxv9/SLLAVo1Iuytb6GIqUR6mUkL072NiWPUX6DSaeKxdIMM1QVja/wkU10vbLux2H5yZw9QOtm13Deqkf36/SU7jOGeizqtsw+G4uL7gytcuFJrR7nT9mRpyjJf2V9NX66a8yY4XzIMNWGIc5aRASoTYXXoQo6r0GuhIlpxvFF1FEaW0PTLv5UHlOp3I7e84dSw1fFHM1z3Z9APQD9hOgcrMVpLh2YsUHlY6XT8P/Tt7W7TdWnOlDhjPPn+mV9eEsU/bxpNRS1fP/OnIk6QNSrnYk92OttbX1mzjKiUyyVL+UjKg2qdyzzXpvlbuDoR3B/3+k3eIYbxaWYavTH/AMk6H6SPTfcy1Od7WjU4Lx025euZCcQ4uMhLlVQDUtYKv+Ed/wAzPn7M+a8K+KbBZbZgWoVG0u2rOgHy31Ydfi9JUOaODYitWXIS6kaAmy0iNCfQH2J3m3wblmnQIqE5qoIIfbIw1BQdCD1OvtJNOVOCVSbu9vWXxKqhVp0F7Wc25NaLbZr8+R2OmzACm5CZX8rMLht8ul/OStyTcWImlxLiCUhluQd7K1mO+bOSLICbE21NpH/+IKlVRdfDqKMtS1wb2vfX4VINx77yIxeFNUEA9Rf2vY6xLEqMuCGb3f2/Z0VKCnFTvkzDi+I1K/kXRL6AaC/oOp9T+k0VQLdaSZ3+ZzbKvuToT+k2qyZKaOwJph8tVU0YAdAeg/KRGI4tcFUUJTBuB0AudX6M22p2tLTD4VJccs38i8w2ESXFZP6Lx332sUjmOviq1Y0zcg6gDYjux9+m08w+ApYaz1jd9LKNcvqB+5m/xLi9yfDNyd3P7D95GYbAPV1Nwp3Y7t7f5zc3eXdzZHnKEq7dFe0nu/dj4b23eXmXXg9YtajcX3pk7X2Iv2YD8wJ0nkbijUz4NT4XOh6Bv9dvynIMHTCZQtxltbqRbUToOBxQKpUDCzjfbzD4h+fT1lZ2rCdGUcRBePrroO2KUocNVLJ69HujronsieAcSFanqbsuh9exkrJFKpGpBTjoymPYiJsAiIgCIiAJXecuGeLRLqPPTBI9V+Yfv9JYp5aYVIKcXF8z1OzujmfDaXhAXG4sw9D+/X3n1xPhi1hawLrqhIFm+bKf6W3/ADkxxvBeG5A+E6r+4+k0aZuPVf8A633+h/vKPs/GVMJiHGWqefrwzRomuK9yucYQ4igC9RfE1NHDUVLEODlIcG7/AAg9gNN5n4RUath/EC00WlanlS+a4GruDoLm23XNJV6r0auehRRziGVTmOXJVU3vmHyne0reNwS4PF06uKtVWoXqMEBXLUzHUKTqAxuL6GdpVowxVF0OTXFHm+tlplu3c1Rm6c1U8mSvD2y1L9Nj6X6/2/WfXMHC/ES6jzoDb+pRuvqRqR6TJh6flzFWXNqA4AYL0uBtp+03aFS4HcWF+34T+35Th4TcakqNTk7evkW9DGyo11Ujp6+2RUsBwapUQ1LqFUE5nNgbdBbb3Nt5K8HwwrUbUaIFQWz1qh8qNe4y2u2qixFgLXvfrs1qCpVuaTVEc+SmDZVrEjcHy+19r+kwYvCGhXWpiQPCrMxenSLAArpYjTMATfsde8m04KKv5P8AN7ZeWZ0VWs62V9e9HrbWNr3lz1sr5ZnwKgqJnW3W+t7MNCL9ffqCD1klwqoQqjqNvW+6+xkdjL5hWSiUw7KiM1lQF7nLVyA3UNot9tAekkCmXSQq8nQmrf6c5j4JW2fLLLdO3NGpxPhdnDJYI5sL7Kx6H0nppjDurpaqVvnuNFJ0UkjRTc977bSXouHUo2xFj+zD1nzhcKzg4dmWmqDzZbBqisc17nQDre2ukmUVGWceenR/Tqc3LCqE7RWb0ez1tnl8b7cyL4umR/GWp4zW/j5R5VpgeU3Goym+5uRm2vNeoSCGX/Qi36giSXDazEnCUsp8zZap08tiCbD4zaRf3fwKhwhbMAoZDaxykXKMLmzKenYjtPK8OJe1j5+ubW5Z4DEJ5PRvyUuaXN31vz88lTc5tadUWf8ApY6K/wCY19pSuYOGspan1U6evp9ZesIgyuhFwT/pb9JGcYwRcW3dRofxKOnuJP7Pxkan8MjocHiIVOKhU0eXr1p4FFw3CQPNUsx7dB/nJk8JqgI7IVSowVWbQXPXuBbX1AkvgOGUXo3Bd8QwOSmnyEGwLXFsvUsSBrbfWSjVRiEZMQatXFDMiUEXKKZUZc52XfdmPpaWiajkl4k6E44fuUo2Sfe38V03lLJW5mdcPiaFWjQpUaISlaoxBYK9syZnZhcG97Gx1sdhpr0/FNSrVaj4eHqOMrZgQKh0FQaAlHIPmsASwnxwuhRVKyY2rUFVbU/BzvqtvLkAJzm7aDUC/reZuGeJiEOGxlY0kpIh8Mhab1E3Us9T5V3tNU6cZRcZaaMhTpx4ZKVmtG7PNN3co55u9s8lpnmS3AuIGhUDdL2dfTa86NSqBgGBuCLgzjnDsaHzLmzFCQGIt4lIHKr29QNZfeUeJi3gk6bp+4/36yhw7lhK7w9TR6P1v9SkqU50Kjpz9Lky1T2eT2XB4IiIAiIgCIiAR3GcH4lM2HmGo/cSlvVyMG7bjuOo/KdEMpXMnC7VQ3yk3A/qHf23EpO1cPmq65a/Z/b4HjRpfdw6tRYmzi6N1HVD7j4fcCQOJw1B6D0BTqVsa2jMQzMrBtH8Q6LTt+d5PUHuLWuRcgC3mHzKL9dLj1B7xj8UyuHpqoZ0tVJUEMF1R7D5tTLvsfG+0o8N81ms7LLfpy+GhHnFXv8Ash+X8W9RXXEV/wCJSIpiiwUNZdCb7uenpa8kVaxv02I7gyPBWkKmIqVVUMcz1XKqPN69b3219BMHAeM0sVSZqTlwjFSxBF7bNY62P7HtKntyNKdb/ooO+ilZZX6ac/8ATOkpWsyx0SGujahvKf8A8t6e/vI7HYaiEda71KuIsyqCXLA/8vw1GmUjU39Z9YOpfU+3/T0P0OvsZJYqqyj7wiK9RVKODpdTbzZtxY6/VpjhqiqQz5efp/vcucDWlbhWt8s7eF3bJPR+RDYFWxNNqGJq+GlLKrJZVcgHQszfKvaY+DYwOrUi2ZqZy5vxoDZX+oGv+s+uL4B6VZMTXy1Gap/EpAECwUfCT8SgaXPW15i4zjgzjEouQU1yf41JuVIAsfToLXuZhiaPHBxk7Nb6vboibiKUa9JuPutXTVlGMlqtLvi3duTzsSCNY/71Ey4umKihyMxTcfiW+3++57TWOIVkWopupAII6gzLhXK/r9QfiH9/17yHhajT4ZemcpWpqcbMy4+m2IUPRp5Ep5ipJAJ0BKU8o2GW+veaWIw6V6KphqZ8YFXLsAMjgm5Z2+INe2XsTNrDg5/BNVlovc6DcdienYz7s9F28A5UKi43GYblS4vb1lspX7z55PS/lsQ4ybfG+eUtL/8Alcl1NDAuHTNYq1yGU7o6mzKfY/sZ5iqOYaaMNQexkFU42KGKAcZaVXys5P8AzCfK1vUmxO+oJ2lkqixlJUbpVVKLyea/HkWVOpJpTeTITD4h6T3SoKSVmCVWKhvDIO4vt1mXiVZMJWD4J/FORhXJJqqczaNUYaZj116DvMfE0CsQ3wOLMex1yt+kz8FxlR6TcOpUEFSzhqhNlyN5SzKBd2sbD6TrsNiFXpKp8UdJCoqtJVrX5SWSTW73ty8hxWmMK9HHGqtauzA5TlKuhS38NRqoUAC/qJ5xrCO9NOJVfDKrkK0LFlennvlLk+ZyWva21x0jhLrgq1TCmh49ZivhumXzqy3yNmPkXe/1vsJgwlFMFVy44BrpnoBf4tNGzEMAjWGYbXm/T1qvseq6acc5JZPK84vlFL3UtL+9rtY3OIVquKVMelNaVKkjFUZrtVQEGoNBlVQBoD69594N7N5CbaMp6i+o+o0/KRVByBUcs1PDl2qLQLeRQTmBYfDYDW20q/FObKleocLgNXY2NY6adcl+nr+QlL2nTWIkqVP3k9eUVrZve5VdoKCcacdY7ck/6vd3z9ZfoPgnE1rpcMpdfLUUEHI1gbEdLggi/QiSc4b9i2HajxGrSp1zWU4ctiSAcq1Q4yeY7tZmHf4r9h3ISfFNJJu73Ih7ERMgIiIAiIgCR3GeHLWplWAJGov0Ouv6kfWSMTGcVOLi9GDmdTDhDnBy5PXRSNCbXsCJU+Jc63Y0cEn3ir1caUqe+rP2+oHrNj7b+CYinVTFotSrhHH8akhICuPmbKPhYW1IIBB7iQPBOBVsY3hYKitWmLA1WU08LTtcXIYZsS+5uepBtKrD9kxi71ZX2Wnx9W8Q0uRC4smoRXxVQVNTZ2JGHpnUkU0UXqsMvy6G9ibm5uPI3A8Y1Rq4psuHZT5qw8Nqlh5fCoroi57m53BHWXzlz7OaGHYV65+9YgbVKigJTOn8qkPKg031PrLVUoS0lCMoODWWgOdtVykNYj3H6GbdGqzgBdGOg9tbfpoe4v3mxzUqYcmrUISmd2JsFPW85vxTmqrVv9yGSkCA2LqDKqg3F0B31B77bdZzdDD4mFZ04rTnyt49VnzM4SnSmpR/Rd+OcTwmBQHFVQTlGVAczPbso1PvoPaUPj/M+JxdqKr91oObCiljXrC4Fmv/ACwRrrlXpdriRVbDpRPi1KlXxag8tZ7tWqselGjvTBGmap+LYaS4cufZzisWFfFKcHQIuyA5sRXuCD41VtQNfhO3YWBnRU6SjqZVK06nvv8AHw0NTkHHqpOAzBsgLqEu4pai6vUAszm9/KMt83XSW81AOvt7+0tPDOXMPhaXg4eitNPQat6sx1Y+plf421PD5mrMEQa5mNhb379JU9o4fhn7WK118f39fEjyi3oZ8PRFrllOtwLgWPfXUSt8z85UqB8CkDicQdqNO+VfWo2/0/tKpxfmWpifLhicPhiSv3lg2aqb2yUFGpY9ANf8MihhvDYYahTqtVdtcMrE1a19mxFRCRTFiTkXo3mMlYfDylH+VWW35/BjCmlnYx4wNWd6+Kq03dN9QaNDXVQB/OYiwsmoJ1O0v/JvEmxGFzMtTyHKKjrbxVAFnHT/ALSQ5W+yssVxPEwjuPgwqACjRGgAKjRzYAdtNc0vmN4QuTKAALaW6W2mzGYWNejwRyazXibbFBq0RUUhuv6djIHFGpSOZWZKlMWJU2LIdND31H6Sz46kyMbqbjf/ALdZhODw1ZQ1VyrWtpmuPTQEWt/26yq7KxzoVWqmS5p8v8JWAxiw9S0/dev+c+u5rYzC0mp0qmEztXzLU+8ENnvY58znR9baDQWP1jOO41KNsRjKpq1LWVdLseyLsdfTLMfG+bVpOcLg0WtV10+WmBu1Q/Nbe1+moEp7JeqK1dzWqPoarIKi328PC0/+Y12UBx5VLDTW4vFXnWXcvGO/9n4bLr8NzOeOlbhpXWveecrPlfkvAx8z46rWpGrXfwUb+ThlszP1D1NdB7/QST+z3kvG8RpCl/IwefM1bLZ6uliqfjFiRmOguRrbLLxyp9lq1nXFY+iEUEslAnM7k2JfFVd6jEi+XYX9SJ1uhRVFCqAABYACwAGwA6TOEIwVorIhWsR3LfLuHwNEUMNTCLuTuXb8TtuxkvETMCIiAIiIAiIgCIiAJ4BPYgCeET2IBXOdeV6fEMJUwrHKWF0e18lRdVb89D6EzkPBPs74wv8Aw5o0qeVvLi6lQVBTT/2aYJIa5Y3Kg+a2lhb9AxAKhyj9n+EwJNaxr4ltXxNXzMSd8o2Qe2vcmW3LPqIB8NTBlI+0/ko8RwuSmQK1M56VzYMdmQ9rjr0IHrL1EA4HwTkfi1fLTq0vurDMKuKqMjNlYkFcPTTRLra5Frm5vOr8ocmYThyFaCXdv5lZ9XqH1boPQWEslp7APLQRPYgFV5uw606bYg6Igu5/Co3P0nFuN8wvi7jDnwcNezV20qVdbZaSDzXPSwubHaxE/RmLw6VUalUUMjqVZTsVYWIP0M5Ng/sbqUarijjQuHc75L1qandab3yqSLAtb5V00kF9n0HXddrP5X3sLLYovD+BtVb7lhsPncgZqV7FD0qYyqvwka2pKe/UztXJvI9LB2rVT4+Jy2NUiwpj8FFNqa+2p6yZ5f4Bh8FSFHD0wqjUncserM27Me5kvJwEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAP/2Q==",
            "costo": "35",
            "comprarDespues": true,
            "fechaAlta": {
                "seconds": 1691433271,
                "nanoseconds": 154000000
            }
        },
        {
            "id": 1035,
            "itemName": "calculadora cientifica ",
            "branch": "karuida",
            "quantityAvailable": 0,
            "saleAmount": "100",
            "category": "ESCOLAR",
            "imagen": "data:image/jpeg;base64,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",
            "usuarioCrea": "dcamacho",
            "comprarDespues": true,
            "costo": "100",
            "codigo": "6926801900827",
            "fechaAlta": {
                "seconds": 1691433518,
                "nanoseconds": 332000000
            },
            "caja": 0,
            "cantidad": 0,
            "costoPublico": "100",
            "marca": "karuida",
            "fechaModificacion": {
                "seconds": 1708649313,
                "nanoseconds": 392000000
            },
            "categoria": "ESCOLAR",
            "activo": true,
            "nombre": "calculadora cientifica "
        },
        {
            "id": 1036,
            "itemName": "rotuladores fine line 12pza",
            "branch": "marker",
            "quantityAvailable": 1,
            "saleAmount": 40,
            "category": "ESCOLAR",
            "nombre": "rotuladores fine line 12pza",
            "cantidad": 1,
            "marca": "marker",
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691433811,
                "nanoseconds": 279000000
            },
            "costo": 75,
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_620117-MLM74623083916_022024-O.webp",
            "usuarioCrea": "aortiz",
            "activo": true,
            "fechaModificacion": {
                "seconds": 1714777886,
                "nanoseconds": 82000000
            },
            "costoPublico": 40,
            "caja": 0,
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "codigo": "6970899228240"
        },
        {
            "id": 1037,
            "itemName": "plumones markcolor",
            "branch": "TRYME",
            "quantityAvailable": 0,
            "saleAmount": "32",
            "category": "ESCOLAR",
            "usuarioCrea": "dcamacho",
            "cantidad": 0,
            "fechaModificacion": {
                "seconds": 1693095900,
                "nanoseconds": 745000000
            },
            "marca": "TRYME",
            "comprarDespues": true,
            "fechaAlta": {
                "seconds": 1691434033,
                "nanoseconds": 972000000
            },
            "activo": true,
            "costo": "32",
            "categoria": "ESCOLAR",
            "nombre": "plumones markcolor",
            "costoPublico": "32",
            "codigo": "6925411085863",
            "imagen": "data:image/jpeg;base64,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",
            "caja": 0
        },
        {
            "id": 1038,
            "itemName": "lapiceros color pen",
            "branch": "wenxuan",
            "quantityAvailable": 3,
            "saleAmount": "25",
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1691434595,
                "nanoseconds": 642000000
            },
            "marca": "wenxuan",
            "codigo": "6958209663547",
            "costo": "25",
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_733233-MLM43282571838_082020-W.jpg",
            "nombre": "lapiceros color pen",
            "caja": 0,
            "usuarioCrea": "dcamacho",
            "cantidad": "3",
            "costoPublico": "25",
            "activo": true,
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691434595,
                "nanoseconds": 642000000
            }
        },
        {
            "id": 1039,
            "itemName": "usb classic c906 32GB",
            "branch": "adata",
            "quantityAvailable": 3,
            "saleAmount": 130,
            "category": "OFICINA",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "nombre": "usb classic c906 32GB",
            "costoPublico": 130,
            "categoría": "OFICINA",
            "imagen": "data:image/jpeg;base64,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",
            "marca": "adata",
            "costo": 100,
            "fechaModificacion": {
                "seconds": 1717639326,
                "nanoseconds": 660000000
            },
            "comprarDespues": true,
            "categoria": "OFICINA",
            "fechaAlta": {
                "seconds": 1691434811,
                "nanoseconds": 295000000
            },
            "codigo": "4718050609642",
            "activo": true,
            "cantidad": 3
        },
        {
            "id": 104,
            "itemName": "lapicero punto medio azul",
            "branch": "PAPERMATE",
            "quantityAvailable": 20,
            "saleAmount": 6,
            "category": "lapicero",
            "marca": "PAPERMATE",
            "comprarDespues": true,
            "codigo": "7703486035315",
            "fechaAlta": {
                "seconds": 1647211180,
                "nanoseconds": 328000000
            },
            "categoría": "lapicero",
            "imagen": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSEBMREhMVExEVFRITEBYVGBcWFRUWFxYSFRUYHSggGBolGxMVITEhJikrLy4uGB8zODMtNygtLi0BCgoKDg0OGxAQGzclICYrMC83LS8rLjAtLS8tLTctKy0tLjEtLystLy0wLTAtLS0tMi0vLy8tLS0uLS8vLi8tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAwADAQAAAAAAAAAAAAAABAUGAgMHAf/EAEAQAAIBAgQBCgMFBgQHAAAAAAECAAMRBBIhMQUGEyIzQVFhcYGxMpGhI0Jyc8EUUmKCotEkU5KyFkNjpLPC8P/EABsBAQACAwEBAAAAAAAAAAAAAAADBAIFBgEH/8QAPxEAAgECAgYGBggFBQEAAAAAAAECAxEEIQUSMVFxsTI0QWFygRMikbLB8AYUNVKCodHhJTNCYvFDc5KiwiP/2gAMAwEAAhEDEQA/APcYiIAiIgCIiAIiIAiIgCJ1Va6L8TKvmwHvIlbjGHXRq1IHuzi/pbyntgWEShr8q8Muxd9/hQ9n4rSHW5ZUxsjW7CWGvkq3Mxur2v8Amj1xkle2XA1UTz/HcuHHw80q/vMpFvVmAle/K3EOejWZh3U6aW9CAxMmVGW0rPEw2LPgeoTjmG1xfunltXE4yqDmp4hr9jc4i/JmWQ/+HsS7Bsq0/D9oK/00w1/nKtTFYSllOtFPddX9lyWLqS6MGewRPNsNw3Fpb/Gc0B2IHPZ31Klj6rLShxc0etxj1f4StI/+NL/WVoaRw9V2oa1Twwm//NvzJZQlDp2jxkl8TaxI2Cql0DHc3kmWqVWNWEakdjSa4NXR41Z2YiIkh4IiIAiIgCIiAIiIAiIgCIiAIiIAlPi6YckNc2Jt0iPlYy4lTU3PmYBVYnhdA3BJW+p6V9e85r6yBi+TBcfZ4hxf98Zx8lKy5q4pKfxsqlnyrmNgzsQFS/eSQJ94fXzgkrlNyGW97OpKsAbC4uuhsLgg9skindZv2kcoxe1GPXk0q9diW8lWlTH9eY/WcW4bgE+Jqj+BrVCPkpCyw49VKFHSlTqEk5i6ZiqL2jXTVu4/qI3BMTiXdeeQqhp1M682FUHnAKfZfVVqXGu/ZpORjjpTwqr1ak3lmo1KdK7V7pasJN7O218tl0WpUVrakIx84uXtu48/ada4rBJ1WHUn97mUH9RuZy/4jbZKSr+In2W0rOI0wtR1GwdgPK+0jTr4aB0dNKpODm7ZOcpS29zlb8jST0jik3HWtbckvhcvhxeqyZuiN/ujs87yrqcQrN8VR/8AUQPkJIoJ0Ld4P1lcwtoZew2CwtFv0VKMeEYr87X9pVqYitPpTb82d2FPTHr7Tsx9P73hrJHCcA7nMBYDS50F/Dvk/E8NdQTdXFtbf2M9lpLDQxUaM6q17parkr8OPdt7jH6rVdJzjB6tttjd8K6pfX3MmSHwzql/m9zJk5/R/U6Pgj7qOkq/zJcXzEREuGAiIgCIiAIiIAiIgCIiAIiIAiIgCVFVrEk6C51lvMfyqrECnTGvOVAGF7XUEXW42vcTGc1CLl8/PYZ04a8lHeR+UGPU0MqFKnPVHQLk5zNZWNggPS6YTsO+x2llwmgyZ8wClihyK5cKAioAGYAn4L7femWrsqUnBCqoroq3cb84wAXMDmcjQbkFrixE2q/EfJf1ktJtxg32/tyMJxSnJLsM3ykyjDuXcU1BpEudgBVRrWsd7W27fWQuTGDNB6lFnd2WlRNyhFOxaswyOfj1cjTbKO28mcp6LvQYU0ao2Zegtrm5t2kDTNfyBnLhlJucqO4ynm6NILnVtKT1elptfnL/ACnzaNRQ0bKGt0m21eN7pw1culs1u591nfYuN6ye7j3+RnuLdfU/G3vOqhRvqdBLHiPXP+NveV+JqdnYPefXsM70YJfdjyRxlb+bLi+ZLGIXa8lYXBio4BAtuT4Sjmo5MJ9kzH7zWHkAP1Jmu03ipYHA1K9N+tsXFuyflt8ixgaCr14wls2vgv12eZaooAAAAA0AHYJyiJ8blLWd5PM7JK2wvuFdUvr7mTJD4V1S+vuZMn1HR3VKPgj7qNVU6b4sRES4YCIiAIiIAiIgCIiAIiIAiIgCIiAJjeVdAsaTAXC1gDtsT46dn1mylHj8MtRWRxdWuD/eYVIa8HEzpz1JqXz82MphM4R1pqlmqUqbqxbKtNqtZWYMToTbRu+2+gGm4c9RgrVVC1ClMso2VtbqNTpfxlBj+GilhwpuzGqFziq9OwHOuCxUHo2dgwNgQxuRvL3hVNlRVfOGCUwRUdXcHXRnXRiNr9szw8Gowvlklb2crWPa1RSlK29u/b8/HzRScdr0sjUXYqXUbIW0v6DsPbKjh2Mp0Awoq7F7Es+UAEA2IVfPvnZyn61fy19zMHyt4iyslKm7IbZnKsVJubKLjyJ9RKuhdB4SeApuaclNKTTl6t3bsVsslk7+ZrsXjq6xEoQaVna9s7ed8+/JmyBvqd9yZCJnbw+pmpox3ZEJ8yoJnURadTHtNMfJosFXZMHmplAwfQupYa1FU6AjsPfM7NbyfH2C+b+85r6XTUMBGTV7VIZb9uRtdEK+Ia/tfNFNguIYuoSStSzUapslNQoYGpkKtobsFU2JNrja8UOCYhnR3sCrKWNR8zHmqtJ1IKk6Hmdie0EjS0lcapYpqtqPOFLA/HkX7t0Pfsxvr8VtLSdyewL0aZWrlLllYspvdubphieiPvBtydLa9g46eL9DR9LR1It29VK7Seeea2XW2Odk95vYwvLVld95seFdUvr7mTJD4V1S+vuZMnV6O6pR8EfdRWq9N8WIiJcMBERAEREAREQBERAEREAREQBERAEqX3PmZbSpfc+ZgFBympFqShQCeevqEOuVtbOCL92q+YNpc4e/3rZsqXttexvbwvPpDAmwBB7CbT7TBuSRa9tPKSxeaXeYmJ5Tdav5a+5nlvKUXrl7/ESAO4U2NP3Vp6jyn61fwL7meW8fbpqPB/riKv8AaWtBfZ+H8EeRqsV1qpxNzyfqXoUvCmo+QtJlWhfUbyo5ON9jS8iP6iJfZgBcy9PJ5FF7SPTwZ+9t3Ca3gtBjSGVb6tttvM3RrBtppeEYhhRADWF295zX0odN4L/731dddG19j3/vwNnoi/1j1fuvmiyHD23YhY5qkN3zeCj9ZWYyo3Zn1vdghci1rC3ZfvPdOdDNYZ/i7dr+Hhe1tpxE44ejho4iFKL1nZKcpSlldXslGG1d9rrLNM6FTlKbg28uCXNvhv7NjtpcAV5sZRYa6epkqQuFdUvr7mTZ2uBlrYanLZeEXlkti2Ip1FabXeIiJaMBERAEREAREQBERAEREAREQBERAEqX3PmZbSoqb27zPUeHwMO8fOfZhOGcuqa4hcFWWqVNRkpYp2Xpk1GCkoB0VvZQ1ydiQL6bpZIoyjJaysG456rv89+ZhuU/Wr+BfczyvjvWW7jUH/c1v7z1TlP1q/lr7meX8WwrtiagQMxzXtvpubdw1+staCf8OoeCPI1WL61UfearkyL0KX830dpbYs7CQ+TmHKUEDCxs2nmxMsqtLN4GX5S9YoPadGD+L0M1vC+rHm3vM7h6OXxPfNFwrqx5t7zk/pg74D8ceTNrobrH4XzRw4kRpfPfpABdB2HpNY6aDbWd+DP2a9unj3nTpazqx5ewyG2jEkMVOlrGwBLDXbynbgz0R6333u175tb375yVd/wel/uPt8e1Wyfm21ty1bbmHW5eHdw+eORpeFdUvr7mTJC4V1S+vuZNnX6O6pR8EfdRDV6b4sRES4YCIiAIiIAiIgCIiAIiIAiIgCIiAJUVN79xlvKp9z5meg8gq8Lxb1OYw9BauFqVmNPFFCGpqK4L3YkZCvN2IIu2W4vpPUeE4RqSZHqvXIeoecqWzWZyyqe/KGC/y9m07qdS5ZRmGUi9wLai/R8J3KJO560ll2/PzkRxjZGG5Tdav5a+5mafCZWzE3JFfst8ZBA9AiiaXlL1q/lr7mUmJHd+63+0yTQv2bQ8EeRqcd1qpxfI7aVUhQB3bznTxBB11E6Kewn2bPVVio9rLdTLzhDXpC3ew+szmHb7O/cD9Je8nuoX8TzkvpdG2jn448pG10P1j8L5okYymxItlFr9PnSoF9wbC5GgnPCHoi3l0dtCRpqdNJ1cQW+W6sQM2oQMRt2Npr3nu8Z3YU9FblTputjp2ajQ6W2nIYh30TSzXT2Z3XT7Lvbty1bX6LvrG7h1mWXZ+ncuzLtvvysaPhXVL6+5k2Q+FdUvr7mTJ2OjuqUfBH3UV6vTfFiIiXDAREQBERAEREAREQBERAEREAREQBKltz5y2lS25nqBSCof2kgEgc6AQCbEczfXsOw+Q8ZdCUzpfEgkqctW4AAuCaRGpt4ntvrLmS/1R8iOPbxMLym61fwL7mVL/FqQOjU3/C2ktuU3Wr+BfcyrC3YD+Cr/ALWkuh/s2h4I8jVY3rc/Ezqp7CfZxp7fP3llw7g9aqRkpuV/eIyj0Y2Bm0clFXZUs3JpK59w6dAA9oP1l9wBSKAB/eed1Lk2QAa9VKYuBYd5IAFzYXuQO3eS6uMw2Fz0yHdqSUHYaMft6jU6ajYZiyns0Gs5vTmHePw31em89ZPt2K69ueWzibbR1OdCp6SasrNcv0I+IwLVcoXYXJ6NzfSxHYDoZNp8MdE7Ta5NyL6kknTTtnPjXKBKBVEXnXNQoyoVAQLTaq+eoxCIRTUtZmBI1AMn4bEc5TL2ABFx0r6FQRfuOu01S0KvqsaFao5RjdrKKs3d32OT2u1213GyVVekc4rN23v9uzsR28K6pfX3MmyHwrql9fcyZL2juqUfBH3UKvTfFiIiXCMREQBERAEREAREQBERAEREAREQBKltzLaVJ39Z6gREwKZ2qEBmLBgSoupC5Lqd9ifnJUrBxqncb5LMS+VjYqwBBsCO0dvsbWamSJSUlcwi4u9jG8Ywj1cQlOmLsyDyGpuSewCfMRwgUXCZhVrCmzuobmqVGkQVNbEVSDlQ9KwAu1jbQEjR8GQftTntFBAPV2v/ALRIvKDD1KdKqlOlz1TGYlFvmCqFPNrlqk6qopoy9EN321Mg0XXksFQgtno48vndfeRVcPB1p1JK/rM58ncAtGq9CqmHNRFpOlWmjC/Omr9naozHMOZJuDqDsLSyxnH6KWystU85zbCnUQ5LEZ2qG9lC5lvfW7KO2Yri9HEU6laoivWxFN2epiOaslO+FLIaYbszECyFjahTDG7kmxpcIo0zTbF11NVRzRo0bsgpqi5MMNL2AokktYsWcWAIAtSjd60n8/P+DOOSskcOL8Vw9dsDiKiYimpqLUo9FCKiMKZJex6ABynxCnvBHxcNVrYis4pk3TAVWBFjneu5VD+Xh3IPoZZNXpBaWFTD86KFNURqqrUCrzVSnmbJcWK0ypNwOkL2ndh+PZah56ojXICUqKhjc5RdmFxocwtmPZ3StKUaGtObUU97t/kttyrwp04ptxv3rNt7OxZ99/YV2C5N4twOeNKlmK1NOk6vkNw+Wwb7Q1GYhtf2hgCMgLaXB4QUKRBOZiSWa2XMcoUAL91QqqoGtgo1O541eJn7ot47yHVrM3xG/wD93Tn8d9JqCi40fWfC0fO9m/Z5oyp4R3zLrhXVL6+5kyQuFdUvr7mTZtdHdUo+CPuojq9N8WIiJcIxERAEREAREQBERAEREAREQBERAEqDvLeU9VwASTYC5J7gNSYBk8TjGKOGBtaqSQDcZXAUdEG41B11sNO8aylsPISj4rwpT01dKaZCpDPl1dwRZyCVubDS3rLymLADwEstpuNt5BBSTdyFwY/4lx/0Kf0dv7iW+Kw6sUZiRzTmoNQBfm3TpeFqhPmBMHxrFvSxCvSYqwpgXFtiToQdCJVY3itVzeq7VOjUFixsLra4UaC15W0XhZTwNCV/9OPIjxGLjTrTg1/U/wBeP5HoWN5QYZQQWFX+FBnB8L/D9ZmEqvWDPTRDdtS5A1CKtwug1GUWJa57JQ4Rha3n7yfTxVRFK07WLZtrkHon/wBRMdJUatGClSbtZ31V63c1lktt/JlnReJpVqkoVUtbLVvs7dZPPN7GvMtKnDTepSdjzaFRTBIpJs7BFGiA5QCbDTWddLA0jWTmvhRA5PaW+7f6N6ynqCpUP2hbcm7E9pubDzkmniDRGZNx39t97zSR0dW0hTqKMNS6dpS2t3ulvt2a2dsrG1xmkaWEtDW1n2qOxK1m8suCyu3fZmaicajhQSdABcyqTlBStqHB7hYj53kGrxRq19Mqi1lvfv1J7ZqNHfRTG1a6jiI6kE1d3WeeyNm7t79i232J0MTpWhTptwes7ZL9fm56Jwvql8j7mS5D4Z1S/wA3uZMnUaP6pR8EfdQq9OXFiIiXCMREQBERAEREAREQBERAEREAREQBKHiIvTqAa9CpoPwnSX0qTPUDy7lF+3pUSliXNXD1HbKFpqEKqisiMLaEG+h16J3E9F4PULUKLHUtRoknxKKTOHGeHDEUWpFmTNYh0OoIIII+X1Ml4eiEVUXZVVR5KAB7SaMk4xj3kWr67l3IxHKfrV/LX3MosR+je0veU/Wr+Bfcyir9nr7SXQv2bQ8EeRqsd1mpxZ34Y6jzPvJz1AoJNgBc3JAAsLkknQAAE3O1pBww1HmfcyWcLzrLSIBD3pkG9vtLU9bEG13GxvNhJ9vcV9XWnq738Tg3FKalF1qM7qqrS13NiTmsdNToLWG87ccOj6j9ZPp8KpCnSptzdOor422RzcnDvWRarO1jWqDLStcbh2AFrDoqqDcW0udJXp1LssYmhGko6pUSwwy5UJOl9fSEwig31PgZ14+ppl8Ln9Jbi9aaS3lKXRZ6jwvql/m9zJkh8K6pfX3MmTlNH9Uo+CPuo6qr/MlxfMRES4YCIiAIiIAiIgCIiAIiIAiIgCIiAJj+HcYZ6rUnQAZqio6nfIToV8hvNhMBwwf4hfzsX7Ne30k1JJxlfd8GQ1ZNONt/xS+JqIERMY9JEpheU3Wr+WPcyir7r6+0vuU3Wr+WvuZneLVubQPa/SUf6mA9ryxoX7NoeCPI0+NV8VUXeWGCTS/n7mS0x9KgUq12CKtSlqdSbVUYhVGrHKpNgDoJBFY2FtNLn11kevw7nmQmtUp5CwbJTVyyVHoghSx0PR2sb7S9UjeLuQ0LemXEi4jlPiDVFYilh1+2A54hB9sahqLkXpsc1QmzMBcDQS24RjXegtSvlViX1CFMyhiEfIdRcAHxFj2y5w/JyjRpvVpYYlxTucRi2NSr26LmGVWI0GQbmUmLq5mJ3Fzby75FR1ZvJZItY31YpPtNKeFimaHPZzz9QIqoLlbqXLOx0AAGuh+kquVFKktbLQIKhFuQ2bXW+vlllfi8RicU4p1axNIhVCBe4a9D4G23ZW3MsRwEhRcrRpqqrdjqAosNfK25kcsTSwclUxVRRXPPsW18EncjdJVouGHhd8uL2ckejcK6pfX3MmSBwhwaS21GuvfrJ80eATjhaUWrNQiv+qN5U6cuLEREtmAiIgCIiAIiIAiIgCIiAIiIAiIgCee8LP8AigLf8zE2bT+O4756FMVguGVkxAY5DSzVqgYHX7QEBSD5+8npNKMl3EFaLbjbf8UX0REwj0kTMw3KbrV/LX3MzfHMM9SiVpi7Z0I22DC5100Fz6TScputX8K+5lS3YJZ0J9nYfwR5Gmxz1cVN/wBxwE7KFUqwYEggggi1wQQysL6XDBTrppLDDcEqtq4FJe99/lv87SbgsHRvakj4p/3gOgPX4bf6phiNM4WDdKDdSX3YLWtxeUY993dbjKhgK8rStqrfLL2La/YdlXH4nFJZiGHYEpc0hYbM2ao5JB1HSAHcSAREXhdOnbn6l27KVMEsfkL/AEHnNLh+B16nWuKKf5dLQ27i+/ytLjAcGoUfgQX7WIuT4k9s1qrY2orJqjHdG0p+c2tVfhi+Js/q1K+tP1335R/4rb5vMzWB4fXYWoUUw6H79Rczn+UH3J8pbYXkvSBD1i1dx2ubgfhXZfQTQxPKWEpUpOcV6z2ybbk+Mnd/DuJ3JtW7NyyXsRwpoALAWE5xEsmIiIgCIiAIiIAiIgCIiAIiIAiIgCIiAJT4nhBuWo1Gpk623U+an9JcRAMzVxVal19Ilf8AMo9IeZQ6j0vJGCxlOqL03V7bgHUfiXcesvSL7yqx3AKFRg5XK42dDlYeRGsyi7O55YyvFsDTaoKlWplXKAFG5IJOnfvsBJOBwTnTDUAg/wA2sCPUD4j6kTSYPgtGmcwXMx3dzmY+plkBNVSwE3QjRxFRzjFJaq9WFlsulZy4yb4El4KbqQik327X+3kUFDk2p1xDtWP7p0QeSDT5y6o0FQWVQB4Cd0TYQpxpx1YJJbkkl7FkYttu7EREzPBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQD/9k=",
            "costoPublico": 6,
            "categoria": "lapicero",
            "costo": 33,
            "cantidad": 20,
            "usuarioCrea": "aortiz",
            "caja": 0,
            "nombre": "lapicero punto medio azul",
            "fechaModificacion": {
                "seconds": 1718740051,
                "nanoseconds": 408000000
            },
            "activo": 1
        },
        {
            "id": 1040,
            "itemName": "portagafete plastico vertical/horizontal",
            "branch": "lumi",
            "quantityAvailable": 1,
            "saleAmount": 25,
            "category": "ESCOLAR",
            "codigo": "portagafetes",
            "imagen": "https://orpamex.com.mx/img/p/2/8/3/5/2835-large_default.jpg",
            "usuarioCrea": "aortiz",
            "caja": 0,
            "categoria": "ESCOLAR",
            "nombre": "portagafete plastico vertical/horizontal",
            "cantidad": 1,
            "fechaAlta": {
                "seconds": 1691436296,
                "nanoseconds": 417000000
            },
            "marca": "lumi",
            "activo": 1,
            "comprarDespues": true,
            "categoría": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1716247404,
                "nanoseconds": 439000000
            },
            "costoPublico": 25,
            "costo": 25
        },
        {
            "id": 1042,
            "itemName": "caja clips metalicos",
            "branch": "san xing",
            "quantityAvailable": 0,
            "saleAmount": 17,
            "category": "ESCOLAR",
            "costo": 16,
            "fechaModificacion": {
                "seconds": 1714778086,
                "nanoseconds": 40000000
            },
            "activo": true,
            "usuarioCrea": "aortiz",
            "fechaAlta": {
                "seconds": 1691440079,
                "nanoseconds": 544000000
            },
            "categoria": "ESCOLAR",
            "codigo": "cajaclipsmetalicos",
            "nombre": "caja clips metalicos",
            "imagen": "https://www.grafoplas.com/imagenes_g/Clips_niquel.jpg",
            "categoría": "ESCOLAR",
            "caja": 0,
            "marca": "san xing",
            "cantidad": 0,
            "comprarDespues": false,
            "costoPublico": 17
        },
        {
            "id": 1043,
            "itemName": "sellos infantiles varios personajes",
            "branch": "S/M",
            "quantityAvailable": 3,
            "saleAmount": 11,
            "category": "ESCOLAR",
            "fechaModificacion": {
                "seconds": 1716343339,
                "nanoseconds": 652000000
            },
            "imagen": "data:image/jpeg;base64,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",
            "activo": true,
            "comprarDespues": true,
            "categoría": "ESCOLAR",
            "nombre": "sellos infantiles varios personajes",
            "costo": 11,
            "caja": 0,
            "cantidad": 3,
            "usuarioCrea": "aortiz",
            "categoria": "ESCOLAR",
            "marca": "S/M",
            "fechaAlta": {
                "seconds": 1691440751,
                "nanoseconds": 898000000
            },
            "codigo": "sellosinfantiles",
            "costoPublico": 11
        },
        {
            "id": 1044,
            "itemName": "libreta profesional 100H pasta gruesa",
            "branch": "MONKY",
            "quantityAvailable": 6,
            "saleAmount": 90,
            "category": "libreta",
            "codigo": "7503006758942",
            "imagen": "https://http2.mlstatic.com/D_NQ_NP_892237-MLM46495047628_062021-W.jpg",
            "costo": 90,
            "activo": true,
            "categoría": "libreta",
            "comprarDespues": true,
            "costoPublico": 90,
            "categoria": "libreta",
            "cantidad": 6,
            "usuarioCrea": "aortiz",
            "fechaAlta": {
                "seconds": 1691443537,
                "nanoseconds": 34000000
            },
            "nombre": "libreta profesional 100H pasta gruesa",
            "fechaModificacion": {
                "seconds": 1714777909,
                "nanoseconds": 400000000
            },
            "caja": 0,
            "marca": "MONKY"
        },
        {
            "id": 1045,
            "itemName": "espiral para cuaderno 100h",
            "branch": "S/M",
            "quantityAvailable": 27,
            "saleAmount": 5,
            "category": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "costo": 5,
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6_M8ETDhCQHkJysmlgOvV_FpRGd8IIYIzCdAYV-DcOA&s",
            "fechaModificacion": {
                "seconds": 1714778061,
                "nanoseconds": 729000000
            },
            "categoría": "ESCOLAR",
            "marca": "S/M",
            "costoPublico": 5,
            "nombre": "espiral para cuaderno 100h",
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "activo": true,
            "caja": 0,
            "fechaAlta": {
                "seconds": 1691538082,
                "nanoseconds": 114000000
            },
            "codigo": "espiralparacuderno",
            "cantidad": 27
        },
        {
            "id": 1046,
            "itemName": "navaja cutter delgada (venta individual)",
            "branch": "MAE",
            "quantityAvailable": 6,
            "saleAmount": 2.5,
            "category": "OFICINA",
            "fechaModificacion": {
                "seconds": 1716408304,
                "nanoseconds": 297000000
            },
            "comprarDespues": true,
            "nombre": "navaja cutter delgada (venta individual)",
            "cantidad": 6,
            "caja": 0,
            "categoría": "OFICINA",
            "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzbgeZrTA0AfEEKM088Pnj_1O3DDQeJqUqhX-B76wU0Q&s",
            "costo": 2.5,
            "usuarioCrea": "aortiz",
            "categoria": "OFICINA",
            "costoPublico": 2.5,
            "marca": "MAE",
            "activo": true,
            "fechaAlta": {
                "seconds": 1691633599,
                "nanoseconds": 890000000
            },
            "codigo": "navajcutterdelgadaind"
        },
        {
            "id": 1047,
            "itemName": "recibo de arrendamiento (venta individual)",
            "branch": "USUAL",
            "quantityAvailable": 389,
            "saleAmount": 1,
            "category": "OFICINA",
            "codigo": "reciboarrendamiento",
            "categoria": "OFICINA",
            "cantidad": 389,
            "nombre": "recibo de arrendamiento (venta individual)",
            "fechaModificacion": {
                "seconds": 1714774188,
                "nanoseconds": 653000000
            },
            "usuarioCrea": "aortiz",
            "categoría": "OFICINA",
            "fechaAlta": {
                "seconds": 1691689523,
                "nanoseconds": 78000000
            },
            "caja": 0,
            "activo": 1,
            "costoPublico": 1,
            "marca": "USUAL",
            "imagen": "https://www.lineausual.com/productos/big/RECIBO-DE-ARRENDAMIENTO-492442.jpg",
            "costo": 1,
            "comprarDespues": true
        },
        {
            "id": 1048,
            "itemName": "perforar hojas 4 x 1",
            "branch": "S/M",
            "quantityAvailable": 54,
            "saleAmount": 1,
            "category": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1691775929,
                "nanoseconds": 690000000
            },
            "usuarioCrea": "aortiz",
            "activo": true,
            "fechaModificacion": {
                "seconds": 1719249645,
                "nanoseconds": 297000000
            },
            "categoría": "ESCOLAR",
            "costo": 1,
            "nombre": "perforar hojas 4 x 1",
            "costoPublico": 1,
            "categoria": "ESCOLAR",
            "comprarDespues": true,
            "imagen": "https://i.ytimg.com/vi/gCT6ngoqo8g/sddefault.jpg",
            "cantidad": 54,
            "codigo": "perforarhojas",
            "caja": 0,
            "marca": "S/M"
        },
        {
            "id": 1049,
            "itemName": "hoja etiqueta transparente t/c",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 7,
            "category": "OFICINA",
            "cantidad": 0,
            "usuarioCrea": "aortiz",
            "marca": "S/M",
            "fechaModificacion": {
                "seconds": 1715015513,
                "nanoseconds": 125000000
            },
            "caja": 0,
            "comprarDespues": false,
            "activo": true,
            "costoPublico": 7,
            "codigo": "hojaetiquetatransparentet/c",
            "costo": 7,
            "fechaAlta": {
                "seconds": 1692128513,
                "nanoseconds": 156000000
            },
            "categoria": "OFICINA",
            "categoría": "OFICINA",
            "nombre": "hoja etiqueta transparente t/c",
            "imagen": "https://coolprints.com.mx/wp-content/uploads/2021/09/Etiqueta-Transparente-uso-Foil.jpg"
        },
        {
            "id": 105,
            "itemName": "goma factis s20 (migajon) ",
            "branch": "FACTIS NATURE",
            "quantityAvailable": 13,
            "saleAmount": 12,
            "category": "gomas",
            "fechaModificacion": {
                "seconds": 1716322711,
                "nanoseconds": 706000000
            },
            "activo": true,
            "comprarDespues": true,
            "categoría": "gomas",
            "costo": 140,
            "cantidad": 13,
            "usuarioCrea": "aortiz",
            "caja": 0,
            "costoPublico": 12,
            "imagen": "https://pedidos.com/myfotos/xLarge/(X)FAC-GOM-S20.webp",
            "categoria": "gomas",
            "fechaAlta": {
                "seconds": 1647212063,
                "nanoseconds": 423000000
            },
            "codigo": "8414034020200",
            "nombre": "goma factis s20 (migajon) ",
            "marca": "FACTIS NATURE"
        },
        {
            "id": 1051,
            "itemName": "sticker tira materia ",
            "branch": "S/M",
            "quantityAvailable": 0,
            "saleAmount": 7,
            "category": "ESCOLAR",
            "marca": "S/M",
            "fechaAlta": {
                "seconds": 1692156126,
                "nanoseconds": 246000000
            },
            "cantidad": 0,
            "costo": "32",
            "costoPublico": 7,
            "imagen": "https://tonypapelerias.vtexassets.com/arquivos/ids/241898/02940788.jpg?v=638447657390100000",
            "activo": true,
            "caja": 0,
            "comprarDespues": true,
            "fechaModificacion": {
                "seconds": 1717449102,
                "nanoseconds": 860000000
            },
            "nombre": "sticker tira materia ",
            "categoria": "ESCOLAR",
            "usuarioCrea": "aortiz",
            "codigo": "stickertiramateria"
        },
        {
            "id": 1053,
            "itemName": "playdoh mini ",
            "branch": "S/M",
            "quantityAvailable": 20,
            "saleAmount": 17,
            "category": "ESCOLAR",
            "activo": true,
            "comprarDespues": true,
            "categoria": "ESCOLAR",
            "categoría": "ESCOLAR",
            "fechaAlta": {
                "seconds": 1692578659,
                "nanoseconds": 977000000
            },
            "marca": "S/M",
            "caja": 0,
            "usuarioCrea": "aortiz",
            "codigo": "playdohmini",
            "costoPublico": 17,
            "imagen": "data:image/jpeg;base64,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",
            "fechaModificacion": {
                "seconds": 1717698824,
                "nanoseconds": 890000000
            },
            "cantidad": 20,
            "costo": 17,
            "nombre": "playdoh mini "
        },
        {
            "id": 1054,
            "itemName": "lapiz de dibujo hb",
            "branch": "turquoise",
            "quantityAvailable": 11,
            "saleAmount": 15,
            "category": "lapiz",
            "comprarDespues": true,
            "categoria": "lapiz",
            "costoPublico": 15,
            "marca": "turquoise",
            "cantidad": 11,
            "activo": true,
            "fechaAlta": {
                "seconds": 1692578833,
                "nanoseconds": 660000000
            },
            "codigo": "lapizdibujohb",
            "imagen": "https://api-p1.y.marchand.com.mx/medias/743.jpg-515ftw?context=bWFzdGVyfGltYWdlc3w1MzM3N3xpbWFnZS9qcGVnfGgzMi9oMGIvODc5OTA1NTk3MDMzNC83NDMuanBnXzUxNWZ0d3xlMTI1NjNiYTI2Y2U3MmYzYWQyYjhmN2EzOWQwNTdkMzZiODMyNjliYTYwOGZmMGVjODZmNzA4YzlhNTVjZTZi",
            "nombre": "lapiz de dibujo hb",
            "usuarioCrea": "aortiz",
            "fechaModificacion": {
                "seconds": 1717177324,
                "nanoseconds": 131000000
            },
            "categoría": "lapiz",
            "costo": 15,
            "caja": 0
        }
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
    laminasDefault: any = { 
        id: 'mat-option-1',
        option: {
            value: {
                activo: true,
                branch: 'S/M',
                caja: 0,
                cantidad: 1000,
                categoria: 'ESCOLAR',
                category: 'ESCOLAR',
                categoría: 'ESCOLAR',
                codigo: 'laminas diferentes',
                comprarDespues: true,
                costo: 3,
                costoPublico: 3,
                id: 600,
                imagen: 'https://online.fliphtml5.com/fmpaa/aokw/files/large/1.webp',
                itemName: 'laminas diferentes',
                marca: 'S/M',
                nombre: 'laminas diferentes',
                quantityAvailable: 999,
                saleAmount: 3,
                usuarioCrea: 'aortiz'
            }
        }
    };

    mapas: any = { 
        id: 'mat-option-52',
        option: {
            value: {    
                activo: true,
                branch: 'S/M',
                caja: 0,
                cantidad: 942,
                categoria: 'MAPAS',
                category: 'MAPAS',
                categoría: 'MAPAS',
                codigo: "mapastamañocarta",
                comprarDespues: true,
                costo: 1,
                costoPublico: 2,
                fechaAlta: '',
                fechaModificacion: '',
                id: 802,
                imagen: 'https://www.papeleriaomega.com.mx/imagenessia/151102.jpg',
                itemName: 'mapa tamaño carta',
                marca: 'S/M',
                nombre: 'mapa tamaño carta',
                quantityAvailable: 942,
                saleAmount: 2,
                usuarioCrea: 'aortiz'
            }
        }
    };

    hoja: any = { 
        id: 'mat-option-16',
        option: {
            value: {              
                activo: true,
                branch: 'S/M',
                caja: 0,
                cantidad: 484,
                categoria: 'ESCOLAR',
                category: 'ESCOLAR',
                categoría: 'ESCOLAR',
                codigo: 'hojas de colores',
                comprarDespues: true,
                costo: 1,
                costoPublico: 1,
                fechaAlta: '',
                fechaModificacion: '',
                id: 601,
                imagen: 'https://m.media-amazon.com/images/I/41fgNIX2hAL._UF350,350_QL80_.jpg',
                itemName: 'hoja de color',
                marca: 'S/M',
                nombre: 'hoja de color',
                quantityAvailable: 484,
                saleAmount: 1,
                usuarioCrea: 'aortiz'
            }
        }
    };

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
                    id: 255,
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
            width: '600px',
            height: 'auto',
            panelClass: 'mat-dialog-container',
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
                        imagen: result.imagen ? result.imagen : ''
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

    onImgError(event: any){
        event.target.src = './assets/img/logo.jpg';
    }

}


