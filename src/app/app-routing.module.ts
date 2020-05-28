import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { StartComponent } from './start/start.component';
import { BoardComponent } from './board/board.component';

const routes: Routes = [
  { path: 'start', component: StartComponent },
  { path: 'board/:id', component: BoardComponent },
  { path: '', redirectTo: '/start', pathMatch: 'full' },
];

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
