import { Injectable, Compiler, Injector, Component, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { WCInputBoxComponent } from '../wc/input-box/input-box.component'
import { WcDataMappingCategoriesComponent } from '../wc/wc-data-mapping-column-chart/categories/wc-data-mapping-column-chart.component';

import { WcDataMappingTextFormulaComponent}       from '../wc/wc-data-mapping-text-formula/wc-data-mapping-text-formula.component';

declare const SystemJS;

const staticWidgetsControls: Object = {
  'wc-input': {
    component: WCInputBoxComponent
  },
  'wc-number': {
    component: WCInputBoxComponent
  },
  'wc-data-mapping-category-chart': {
    component: WcDataMappingCategoriesComponent
  },
  'wc-data-mapping-text-formula': {
    component:WcDataMappingTextFormulaComponent
  }
}

@Injectable({
  providedIn: 'root'
})
export class WidgetFactoryService {
  constructor(private compiler: Compiler, private injector: Injector, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  public async load(name: string): Promise<ComponentFactory<any>> {
    if (staticWidgetsControls[name]) {
      return this.loadWidgetControl(staticWidgetsControls[name].component);
    }
    else {
      return this.loadWidget(name);
    }
  }

  private async loadWidgetControl(component: any): Promise<ComponentFactory<any>> {
    // import external module bundle   
    try {
      //from plugins array load the component on position 0 
      return this.componentFactoryResolver.resolveComponentFactory(component);
    }
    catch (e) {
      console.warn(e);
    }
  }

  private async loadWidget(name): Promise<ComponentFactory<any>> {
    // import external module bundle   
    try {
      const module = await SystemJS.import("assets/widgets/" + name + "/main.js");
      // compile module
      const moduleFactory = await this.compiler.compileModuleAsync<any>(module["MainModule"]);

      // resolve component factory
      const moduleRef = moduleFactory.create(this.injector);

      //get the custom made provider name 'plugins' 
      const componentProvider = moduleRef.injector.get('plugins');

      //from plugins array load the component on position 0 
      return moduleRef.componentFactoryResolver.resolveComponentFactory<any>(
        componentProvider[0][0].component);
    }

    catch (e) { }
  }




}
