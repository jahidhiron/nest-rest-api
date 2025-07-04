/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AuthorDetailProvider } from '../author-detail.provider';
import { ErrorService } from '@/common/exceptions';
import { FindOneAuthorProvider } from '../find-one-author.provider';
import { ModuleName, Role } from '@/common/enums';
import { AuthorEntity } from '../../entities';
import { UserPayload } from '@/common/decorators/interfaces';

describe('AuthorDetailProvider', () => {
  let provider: AuthorDetailProvider;
  let errorService: jest.Mocked<ErrorService>;
  let findOneAuthorProvider: jest.Mocked<FindOneAuthorProvider>;

  const authorId = 1;
  const mockAuthor: AuthorEntity = {
    id: authorId,
    firstName: 'Jane',
    lastName: 'Austen',
    bio: '',
    birthDate: new Date('1775-12-16'),
  } as AuthorEntity;

  const userPayload: UserPayload = {
    id: authorId,
    firstName: 'Mike',
    lastName: 'Hussy',
    email: 'mike@test.com',
    verified: true,
    role: Role.AUTHOR,
  };

  const adminPayload: UserPayload = { ...userPayload, role: Role.ADMIN };

  beforeEach(async () => {
    errorService = {
      unauthorized: jest.fn().mockImplementation(() => {
        throw new HttpException('Unauthorized', 401);
      }),
      notFound: jest.fn().mockImplementation(() => {
        throw new HttpException('Not Found', 404);
      }),
    } as any;

    findOneAuthorProvider = {
      execute: jest.fn().mockResolvedValue(mockAuthor),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorDetailProvider,
        { provide: ErrorService, useValue: errorService },
        { provide: FindOneAuthorProvider, useValue: findOneAuthorProvider },
      ],
    }).compile();

    provider = module.get(AuthorDetailProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('returns author when caller is ADMIN', async () => {
    const result: AuthorEntity = await provider.execute(authorId, adminPayload);

    expect(findOneAuthorProvider.execute).toHaveBeenCalledWith({
      id: authorId,
    });
    expect(result).toEqual(mockAuthor);
  });

  it('returns author when caller accesses own record', async () => {
    const result = await provider.execute(authorId, userPayload);

    expect(findOneAuthorProvider.execute).toHaveBeenCalledWith({
      id: authorId,
    });
    expect(result).toEqual(mockAuthor);
  });

  it('throws HttpException 401 when caller is neither ADMIN nor owner', async () => {
    const strangerPayload = { ...userPayload, id: 42 };

    await expect(
      provider.execute(authorId, strangerPayload),
    ).rejects.toMatchObject({ status: 401 });

    expect(errorService.unauthorized).toHaveBeenCalledWith(
      ModuleName.Auth,
      'permission-denied',
    );
    expect(findOneAuthorProvider.execute).not.toHaveBeenCalled();
  });

  it('throws HttpException 404 when author not found', async () => {
    findOneAuthorProvider.execute.mockResolvedValueOnce(null);

    await expect(provider.execute(999, adminPayload)).rejects.toMatchObject({
      status: 404,
    });

    expect(errorService.notFound).toHaveBeenCalledWith(
      ModuleName.Author,
      'author-not-found',
    );
  });
});
