import { Routes } from '@angular/router';
import { GamepadComponent } from './gamepad/gamepad.component';

export const routes: Routes = [{
  path: '',
  loadComponent: () => import('./gamepad/gamepad.component').then(m => m.GamepadComponent)
}];
