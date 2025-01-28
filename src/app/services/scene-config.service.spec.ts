import {TestBed} from '@angular/core/testing';
import {SceneConfigService} from './scene-config.service';

describe('SceneConfigService', () => {
  let service: SceneConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneConfigService]
    });
    service = TestBed.inject(SceneConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the complete scene configuration', () => {
    expect(service.sceneConfig).toBeDefined();
  });

});
