/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateAuthorProvider } from '../create-author.provider';
import { AuthorRepository } from '../../repositories';
import { AuthorEntity } from '../../entities';
import { UserEntity } from '@/modules/user/entities';

describe('CreateAuthorProvider', () => {
  let provider: CreateAuthorProvider;
  let authorRepository: jest.Mocked<AuthorRepository>;

  const user: UserEntity = {
    id: 1,
    firstName: 'Mike',
    lastName: 'Hussy',
    email: 'mike@test.com',
  } as UserEntity;

  const authorInput: Partial<AuthorEntity> = {
    firstName: 'Jane',
    lastName: 'Austen',
    bio: 'English novelist',
    birthDate: new Date('1775-12-16'),
  };

  const createdAuthor: AuthorEntity = {
    id: 101,
    ...authorInput,
    user,
  } as AuthorEntity;

  beforeEach(async () => {
    authorRepository = {
      create: jest.fn().mockResolvedValue(createdAuthor),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAuthorProvider,
        { provide: AuthorRepository, useValue: authorRepository },
      ],
    }).compile();

    provider = module.get(CreateAuthorProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('creates an author and returns the new entity', async () => {
    const result = await provider.execute(authorInput, user);

    expect(authorRepository.create).toHaveBeenCalledWith({
      ...authorInput,
      user,
    });
    expect(result).toEqual(createdAuthor);
  });

  it('propagates repository errors', async () => {
    const error = new Error('database failure');
    authorRepository.create.mockRejectedValueOnce(error);

    await expect(provider.execute(authorInput, user)).rejects.toThrow(error);
    expect(authorRepository.create).toHaveBeenCalledWith({
      ...authorInput,
      user,
    });
  });
});
