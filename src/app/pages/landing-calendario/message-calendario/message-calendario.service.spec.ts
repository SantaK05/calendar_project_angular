import { TestBed } from '@angular/core/testing';

import { MessageCalendarioService } from './message-calendario.service';

describe('MessageCalendarioServiceService', () => {
  let service: MessageCalendarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageCalendarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
