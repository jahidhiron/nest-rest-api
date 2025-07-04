/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorFacade } from './providers';
import { SuccessService } from '@/shared/services';
import { IRequestParams } from '@/common/interfaces';
import { ModuleName } from '@/common/enums';
import { AuthorEntity } from './entities';
import { UserPayload } from '@/common/decorators/interfaces';
import { UpdateAuthorDto } from './dtos';

const authorId = 1;
const userPayload: UserPayload = {
  id: 1,
  firstName: 'Mike',
  lastName: 'Hussy',
  email: 'mike@test.com',
  verified: true,
  role: 'author',
};
const mockAuthor: AuthorEntity = {
  id: authorId,
  firstName: 'Jane',
  lastName: 'Austen',
  bio: 'British novelist known for "Pride and Prejudice".',
  birthDate: new Date('1775-12-16'),
} as AuthorEntity;

const authorResponse = {
  success: true,
  status: 'SUCCESS',
  statusCode: 200,
  path: '/api/v1/authors',
  timestamp: '2025-07-03T16:45:28.297Z',
};

jest.mock('@/common/guards', () => {
  class MockGuard {
    canActivate() {
      return true;
    }
  }
  return {
    AuthGuard: MockGuard,
    AuthorGuard: MockGuard,
    AdminGuard: MockGuard,
  };
});

describe('AuthorController author list', () => {
  let controller: AuthorController;
  let authorFacade: AuthorFacade;
  let successService: SuccessService;

  const authorListResponse = {
    ...authorResponse,
    method: 'GET',
    path: '/api/v1/authors',
    message: 'Get author list successful',
  };

  const authorList = {
    authors: [mockAuthor],
    meta: { total: 1, pages: 1, currentPage: 1 },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorFacade,
          useValue: {
            findMany: {
              execute: jest.fn(() => Promise.resolve(authorList)),
            },
          },
        },
        {
          provide: SuccessService,
          useValue: {
            ok: jest.fn(
              (_module: ModuleName, _msg: string, data: typeof authorList) => ({
                ...authorListResponse,
                data,
              }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthorController);
    authorFacade = module.get(AuthorFacade);
    successService = module.get(SuccessService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMany()', () => {
    it('should return a list of authors with metadata', async () => {
      const query: IRequestParams = {
        page: 1,
        size: 10,
        q: 'Austen',
        sort: [{ whom: 'id', order: 'asc' }],
      };

      const result = await controller.findMany(query);
      expect(authorFacade.findMany.execute).toHaveBeenCalledWith(query);
      expect(successService.ok).toHaveBeenCalledWith(
        ModuleName.Author,
        'author-list',
        authorList,
      );

      expect(result).toEqual({
        ...authorListResponse,
        data: authorList,
      });
    });

    it('should handle empty author list gracefully', async () => {
      const emptyResponse = {
        authors: [],
        meta: { total: 0, pages: 0, currentPage: 1 },
      };

      jest
        .spyOn(authorFacade.findMany, 'execute')
        .mockResolvedValueOnce(emptyResponse);
      jest
        .spyOn(successService, 'ok')
        .mockImplementationOnce((_module, _msg, data) =>
          Promise.resolve({
            ...authorListResponse,
            data,
          }),
        );

      const query: IRequestParams = { page: 1, size: 10, q: 'Data not found' };
      const result = await controller.findMany(query);

      expect(authorFacade.findMany.execute).toHaveBeenCalledWith(query);
      expect(successService.ok).toHaveBeenCalledWith(
        ModuleName.Author,
        'author-list',
        emptyResponse,
      );

      expect(result).toEqual({
        ...authorListResponse,
        data: emptyResponse,
      });
    });
  });
});

describe('AuthorController author detail', () => {
  let controller: AuthorController;
  let authorFacade: AuthorFacade;
  let successService: SuccessService;

  const authorDetailResponse = {
    ...authorResponse,
    method: 'GET',
    path: `/api/v1/authors/${authorId}`,
    message: 'Get author detail successful',
  };

  const mockUserDetailUseCase = {
    execute: jest.fn().mockResolvedValue(mockAuthor),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorFacade,
          useValue: {
            userDetail: mockUserDetailUseCase,
          },
        },
        {
          provide: SuccessService,
          useValue: {
            ok: jest.fn(
              (_module: ModuleName, _msg: string, data: typeof mockAuthor) => ({
                ...authorDetailResponse,
                data,
              }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthorController);
    authorFacade = module.get(AuthorFacade);
    successService = module.get(SuccessService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne()', () => {
    it('should return a detail author', async () => {
      const result = await controller.detail(authorId, userPayload);
      expect(authorFacade.userDetail.execute).toHaveBeenCalledWith(
        authorId,
        userPayload,
      );
      expect(successService.ok).toHaveBeenCalledWith(
        ModuleName.Author,
        'author-detail',
        mockAuthor,
      );

      expect(result.data).toEqual(mockAuthor);
      expect(result).toEqual({
        ...authorDetailResponse,
        data: mockAuthor,
      });
    });

    it('should return user detail', async () => {
      jest
        .spyOn(authorFacade.userDetail, 'execute')
        .mockResolvedValueOnce(mockAuthor);

      jest
        .spyOn(successService, 'ok')
        .mockImplementationOnce((_module, _msg, data) =>
          Promise.resolve({
            ...authorDetailResponse,
            data,
          }),
        );

      const result = await controller.detail(authorId, userPayload);
      expect(result.data).toEqual(mockAuthor);
    });
  });
});

describe('AuthorController update author', () => {
  let controller: AuthorController;
  let authorFacade: AuthorFacade;
  let successService: SuccessService;

  const authorUpdateResponse = {
    ...authorResponse,
    method: 'PATCH',
    path: `/api/v1/authors/${authorId}`,
    message: 'Author updated successful',
  };

  const mockAuthorDto: UpdateAuthorDto = {
    id: 1,
    firstName: 'Jane',
    lastName: 'Austen',
    bio: 'British novelist known for "Pride and Prejudice".',
    birthDate: new Date('1775-12-16'),
  } as AuthorEntity;

  const mockAuthorResponse = mockAuthor;
  const mockUserDetailUseCase = {
    execute: jest.fn().mockResolvedValue(mockAuthor),
  };
  const mockUserUpdateUseCase = {
    execute: jest.fn().mockResolvedValue(mockAuthor),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorFacade,
          useValue: {
            userDetail: mockUserDetailUseCase,
            update: mockUserUpdateUseCase,
          },
        },
        {
          provide: SuccessService,
          useValue: {
            ok: jest.fn(
              (_module: ModuleName, _msg: string, data: typeof mockAuthor) => ({
                ...authorUpdateResponse,
                data,
              }),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthorController);
    authorFacade = module.get(AuthorFacade);
    successService = module.get(SuccessService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update()', () => {
    it('should return a updated author', async () => {
      const result = await controller.update(
        authorId,
        mockAuthorDto,
        userPayload,
      );
      expect(authorFacade.userDetail.execute).toHaveBeenCalledWith(
        authorId,
        userPayload,
      );
      expect(authorFacade.update.execute).toHaveBeenCalledWith(
        authorId,
        mockAuthorDto,
      );
      expect(successService.ok).toHaveBeenCalledWith(
        ModuleName.Author,
        'update-author',
        mockAuthorResponse,
      );

      expect(result.data).toEqual(mockAuthor);
      expect(result).toEqual({
        ...authorUpdateResponse,
        data: mockAuthorResponse,
      });
    });

    it('should return updated author', async () => {
      jest
        .spyOn(authorFacade.userDetail, 'execute')
        .mockResolvedValueOnce(mockAuthor);

      jest
        .spyOn(authorFacade.update, 'execute')
        .mockResolvedValueOnce(mockAuthor);

      jest
        .spyOn(successService, 'ok')
        .mockImplementationOnce((_module, _msg, data) =>
          Promise.resolve({
            ...authorUpdateResponse,
            data,
          }),
        );

      const result = await controller.update(
        authorId,
        mockAuthorDto,
        userPayload,
      );
      expect(result.data).toEqual(mockAuthor);
    });
  });
});

describe('AuthorController delete author', () => {
  let controller: AuthorController;
  let authorFacade: AuthorFacade;
  let successService: SuccessService;

  const authorRemoveResponse = {
    ...authorResponse,
    method: 'DELETE',
    path: `/api/v1/authors/${authorId}`,
    message: 'Author deleted successful',
  };

  const mockAuthorResponse = mockAuthor;
  const mockAuthorDeleteUseCase = {
    execute: jest.fn().mockResolvedValue(mockAuthorResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        {
          provide: AuthorFacade,
          useValue: {
            remove: mockAuthorDeleteUseCase,
          },
        },
        {
          provide: SuccessService,
          useValue: {
            noContent: jest.fn(
              (_module: ModuleName, _msg: string) => authorRemoveResponse,
            ),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthorController);
    authorFacade = module.get(AuthorFacade);
    successService = module.get(SuccessService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('delete()', () => {
    it('should return a deleted author', async () => {
      const result = await controller.remove(authorId);
      expect(authorFacade.remove.execute).toHaveBeenCalledWith(authorId);
      expect(successService.noContent).toHaveBeenCalledWith(
        ModuleName.Author,
        'delete-author',
      );
      expect(result).toEqual(authorRemoveResponse);
    });

    it('should return deleted author', () => {
      jest.spyOn(authorFacade.remove, 'execute');
      jest
        .spyOn(successService, 'noContent')
        .mockImplementationOnce((_module, _msg) =>
          Promise.resolve(authorRemoveResponse),
        );
    });
  });
});
