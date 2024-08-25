import { Routes } from '@angular/router';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { SeguroComponent } from './Pages/seguro/seguro.component';

export const routes: Routes = [
    {path:"", component:InicioComponent},
    {path:"inicio", component:InicioComponent},
    {path:"seguro/:id", component:SeguroComponent},
];
