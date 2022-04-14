import { Test } from '@nestjs/testing';

import { TokenModule } from './token.module';
import { TokenService } from './token.service';

describe('TokenModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [TokenModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(TokenService)).toBeInstanceOf(TokenService);
  });
});
