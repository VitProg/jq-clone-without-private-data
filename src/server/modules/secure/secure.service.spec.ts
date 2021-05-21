import { Test, TestingModule } from '@nestjs/testing';
import { SecureService } from './secure.service';

describe('SecureService', () => {
  let service: SecureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecureService],
    }).compile();

    service = module.get<SecureService>(SecureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('check hash function', () => {
    const testData: Array<[login: string, password: string, hash: string]> = [
      ['test', '123', "7288edd0fc3ffcbe93a0cf06e3568e28521687bc"],
      ['user', 'VVD^#$HF9dfa', "d01a8c6145f2c4d5a50a1240385ac1d0a2cd0037"],
      ['d37hewihsdfeahgh', '123', "2d49eaf07590acc60c416c8642ac7c8105e7b2b5"],
      ['4fh(AD08fewh0', '!@#$%^&*()(*&^%$#@!@#$%^&*()(*&^%$#$%^&*()(*&^%$', "e4e991c87187ade52ec3cefb6f3e588ea49cb3c4"],
      ['', '', "da39a3ee5e6b4b0d3255bfef95601890afd80709"],
    ]

    for (const [login, password, hash] of testData) {
      expect(service.sha1(login.toLowerCase() + password)).toEqual(hash)
    }
  })
});
