import { TestBed } from '@angular/core/testing';

import { UsuarioMapperService } from './usuario-mapper.service';

describe('UsuarioMapperService', () => {
  let service: UsuarioMapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioMapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
