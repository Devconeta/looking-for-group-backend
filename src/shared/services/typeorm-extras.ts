import { SelectQueryBuilder } from 'typeorm';

// TODO: remove this once it is provided by TypeORM (in case that ever happens)
declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    whereExists<T>(query: SelectQueryBuilder<T>): this;
    andWhereExists<T>(query: SelectQueryBuilder<T>): this;
    orWhereExists<T>(query: SelectQueryBuilder<T>): this;
  }
}

SelectQueryBuilder.prototype.whereExists = function (query: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
  return this.where(`EXISTS (${query.getQuery()})`, query.getParameters());
};

SelectQueryBuilder.prototype.andWhereExists = function (query: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
  return this.andWhere(`EXISTS (${query.getQuery()})`, query.getParameters());
};

SelectQueryBuilder.prototype.orWhereExists = function (query: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
  return this.orWhere(`EXISTS (${query.getQuery()})`, query.getParameters());
};
