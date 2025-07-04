/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateAuthorProvider } from '../update-author.provider';
import { AuthorRepository } from '../../repositories';
import { ErrorService } from '@/common/exceptions';
import { ModuleName } from '@/common/enums';
import { AuthorEntity } from '../../entities';
import { HttpException } from '@nestjs/common';

describe('UpdateAuthorProvider', () => {
  let provider: UpdateAuthorProvider;
  let authorRepository: jest.Mocked<AuthorRepository>;
  let errorService: jest.Mocked<ErrorService>;

  const authorId = 1;
  const updateData: Partial<AuthorEntity> = {
    bio: 'Updated bio',
  };

  const updatedAuthor: AuthorEntity = {
    id: authorId,
    firstName: 'Jane',
    lastName: 'Austen',
    bio: 'Updated bio',
    birthDate: new Date('1775-12-16'),
  } as AuthorEntity;

  beforeEach(async () => {
    authorRepository = {
      update: jest.fn(),
    } as any;

    errorService = {
      notFound: jest.fn().mockImplementation(() => {
        throw new HttpException('Not Found', 404);
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateAuthorProvider,
        { provide: AuthorRepository, useValue: authorRepository },
        { provide: ErrorService, useValue: errorService },
      ],
    }).compile();

    provider = module.get(UpdateAuthorProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('updates an author and returns the updated entity', async () => {
    authorRepository.update.mockResolvedValueOnce(updatedAuthor);

    const result = await provider.execute(authorId, updateData);

    expect(authorRepository.update).toHaveBeenCalledWith(
      { id: authorId },
      updateData,
    );
    expect(result).toEqual(updatedAuthor);
  });

  it('throws not found error when update returns null', async () => {
    authorRepository.update.mockResolvedValueOnce(null);

    await expect(provider.execute(authorId, updateData)).rejects.toMatchObject({
      status: 404,
    });

    expect(errorService.notFound).toHaveBeenCalledWith(
      ModuleName.Author,
      'author-not-found',
    );
  });

  it('propagates repository errors', async () => {
    const error = new Error('DB failure');
    authorRepository.update.mockRejectedValueOnce(error);

    await expect(provider.execute(authorId, updateData)).rejects.toThrow(error);
  });
});
