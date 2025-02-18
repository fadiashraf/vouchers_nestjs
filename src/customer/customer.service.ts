import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existingCustomer = await this.findByEmail(createCustomerDto.email);
    if (existingCustomer) {
      throw new ConflictException('Email already exists');
    }
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  private async findByEmail(email: string): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { email } });
  }

  async getCustomerByEmail(email: string): Promise<Customer | void> {
    const customer = await this.findByEmail(email);
    if (!customer) {
      throw new NotFoundException('Email not found.');
    }
    return customer;
  }

  getCustomers({
    offset,
    limit,
    where,
  }: {
    offset: number;
    limit: number;
    where?: FindOptionsWhere<Customer>[] | undefined;
  }): Promise<Array<Customer>> {
    return this.customerRepository.find({
      skip: offset,
      take: limit,
      where,
    });
  }

  countCustomers(where?: FindManyOptions<Customer>) {
    return this.customerRepository.count(where);
  }
}
