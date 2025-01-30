import {TestBed} from '@angular/core/testing';
import {SceneConfigService} from './scene-config.service';

describe('SceneConfigService', () => {
  let sceneConfigService: SceneConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SceneConfigService]
    });
    sceneConfigService = TestBed.inject(SceneConfigService);
  });

  describe('Service Initialization', () => {
    it('should create service instance', () => {
      expect(sceneConfigService).toBeTruthy();
    });
  });

  describe('Configuration', () => {
    it('should provide scene configuration', () => {
      const config = sceneConfigService.sceneConfig;
      expect(config).toBeDefined();
    });
  });
});
