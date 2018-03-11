import { NgModule, ModuleWithProviders } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { components } from './components';
import { ConnectedAnimationService } from './providers';

@NgModule({
    declarations: [
        ...components
    ],
    imports: [
        IonicModule
    ],
    exports: [
        ...components
    ]
})
export class ConnectedAnimationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ConnectedAnimationModule,
            providers: [ConnectedAnimationService]
        };
    }
}
