import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  jest.clearAllMocks();
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should define', () => {
    expect(jwtStrategy).toBeDefined();
  });

  it('validate should return payload', async () => {
    const payload = {
      username: 'username',
    };
    const rs = await jwtStrategy.validate(payload);
    expect(rs).toEqual(payload);
  });
});
