import type { Request } from "express";
import type { Query } from "mongoose";

type QueryString = Request["query"];

class APIFeatures<T> {
  query: Query<T[], T>;
  queryString: QueryString;

  constructor(query: Query<T[], T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    const sortValue = this.queryString.sort;

    if (typeof sortValue === "string") {
      const sortBy = sortValue.split(",").join(" ");
      this.query.sort(`${sortBy} -date`);
    }

    return this;
  }

  limitFields() {
    const fieldsValue = this.queryString.fields;

    if (typeof fieldsValue === "string") {
      const fields = fieldsValue.split(",").join(" ");
      this.query.select(fields);
    } else {
      this.query.select("-deleted -user -__v");
    }

    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 30;
    const skip = (page - 1) * limit;

    if (this.queryString.page || this.queryString.limit) {
      this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

export default APIFeatures;
