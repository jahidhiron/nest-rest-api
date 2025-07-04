import { Test, TestingModule } from '@nestjs/testing';
import { AuthorFacade } from './../author.facade';

import { CreateAuthorProvider } from './../create-author.provider';
import { UpdateAuthorProvider } from './../update-author.provider';
import { FindOneAuthorProvider } from './../find-one-author.provider';
import { FindAuthorsProvider } from './../find-authors.provider';
import { AuthorDetailProvider } from './../author-detail.provider';
import { RemoveAuthorProvider } from '../remove-author.provider';

describe('AuthorFacade', () => {
  let facade: AuthorFacade;

  const mockCreate = {};
  const mockUpdate = {};
  const mockFindOne = {};
  const mockFindMany = {};
  const mockRemove = {};
  const mockUserDetail = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorFacade,
        { provide: CreateAuthorProvider, useValue: mockCreate },
        { provide: UpdateAuthorProvider, useValue: mockUpdate },
        { provide: FindOneAuthorProvider, useValue: mockFindOne },
        { provide: FindAuthorsProvider, useValue: mockFindMany },
        { provide: RemoveAuthorProvider, useValue: mockRemove },
        { provide: AuthorDetailProvider, useValue: mockUserDetail },
      ],
    }).compile();

    facade = module.get(AuthorFacade);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  it('should inject all use case providers correctly', () => {
    expect(facade.create).toBe(mockCreate);
    expect(facade.update).toBe(mockUpdate);
    expect(facade.findOne).toBe(mockFindOne);
    expect(facade.findMany).toBe(mockFindMany);
    expect(facade.remove).toBe(mockRemove);
    expect(facade.userDetail).toBe(mockUserDetail);
  });
});
