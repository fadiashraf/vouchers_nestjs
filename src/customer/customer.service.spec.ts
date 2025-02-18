import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

describe('CustomerService', () => {
  let service: CustomerService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let repository: Repository<Customer>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createCustomerDto: CreateCustomerDto = {
      email: 'test@example.com',
      name: 'test',
    };

    const mockCustomer = {
      id: 1,
      email: 'test@example.com',
      name: 'test',
    };

    it('should create a new customer successfully', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockCustomer);
      mockRepository.save.mockResolvedValue(mockCustomer);

      const result = await service.create(createCustomerDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createCustomerDto.email },
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createCustomerDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockCustomer);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockCustomer);

      await expect(service.create(createCustomerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createCustomerDto.email },
      });
      expect(mockRepository.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getCustomerByEmail', () => {
    const email = 'test@example.com';
    const mockCustomer = {
      id: 1,
      email,
      name: 'test',
    };

    it('should return a customer when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockCustomer);

      const result = await service.getCustomerByEmail(email);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw NotFoundException when customer not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getCustomerByEmail(email)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('getCustomers', () => {
    const mockCustomers = [
      { id: 1, email: 'test1@example.com', name: 'test1' },
      { id: 2, email: 'test2@example.com', name: 'test2' },
    ];

    const queryParams = {
      offset: 0,
      limit: 10,
      where: [{}],
    };

    it('should return an array of customers', async () => {
      mockRepository.find.mockResolvedValue(mockCustomers);

      const result = await service.getCustomers(queryParams);

      expect(mockRepository.find).toHaveBeenCalledWith({
        skip: queryParams.offset,
        take: queryParams.limit,
        where: queryParams.where,
      });
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('countCustomers', () => {
    const mockCount = 2;
    const mockWhere = {};

    it('should return the count of customers', async () => {
      mockRepository.count.mockResolvedValue(mockCount);

      const result = await service.countCustomers(mockWhere);
      expect(mockRepository.count).toHaveBeenCalledWith(mockWhere);
      expect(result).toBe(mockCount);
    });
  });
});
