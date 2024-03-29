import { OnInit, Directive } from '@angular/core';
import { BaseResourceModel } from 'app/shared/models/base-resource.model';
import { BaseResourceService } from 'app/shared/services/shared.service';


@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(private resourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      // resources => this.resources = resources.sort((a,b) => b.id - a.id),
      resources => this.resources = resources,
      error => alert('Erro ao carregar a lista')
    )
  }

  deleteResource(resource: T) {
    const mustDelete = confirm('Deseja realmente excluir este item?');
    
    if (mustDelete){
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element != resource),
        () => alert("Erro ao tentar excluir!")
      )
    }
  }

}