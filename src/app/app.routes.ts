import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { TortasComponent } from './components/tortas/tortas.component';
import { CheesecakesComponent } from './components/cheesecakes/cheesecakes.component';
import { KuchensComponent } from './components/kuchens/kuchens.component';
import { TartaletasComponent } from './components/tartaletas/tartaletas.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { MiCuentaComponent } from './components/mi-cuenta/mi-cuenta.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { ProductosComponent } from './components/productos/productos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'tortas', component: TortasComponent },
  { path: 'cheesecakes', component: CheesecakesComponent },
  { path: 'kuchens', component: KuchensComponent },
  { path: 'tartaletas', component: TartaletasComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'mi-cuenta', component: MiCuentaComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'recuperar-contrasena', component: RecuperarContrasenaComponent },
  { path: 'productos', component: ProductosComponent }
];
