import { Request, Response } from 'express';
import {
  PriceCategoryDTO,
  ProductDTO,
  ProductParametersElDTO,
  ProductShopDTO,
  Query,
} from '../types';

const db = require('../../dbconfig/pg');

class productPageController {
  async getPriceCategory(req: Request, res: Response) {
    const category = req.params.category;
    const region = req.query.region;
    let pricesCategory: Query<PriceCategoryDTO[]>;

    switch (region) {
      case 'RU':
        pricesCategory = await db.query(
          'SELECT id, "nameRU" AS "name" FROM "PriceCategoryProduct" WHERE category = $1',
          [category]
        );
        break;
      case 'KZ':
        pricesCategory = await db.query(
          'SELECT id, "nameKZ" AS "name" FROM "PriceCategoryProduct" WHERE category = $1',
          [category]
        );
        break;
      default:
        pricesCategory = await db.query(
          'SELECT id, "nameENG" AS "name" FROM "PriceCategoryProduct" WHERE category = $1',
          [category]
        );
        break;
    }

    res.json(pricesCategory.rows);
  }

  async getProductParams(req: Request, res: Response) {
    const id = req.params.id;

    const params: Query<ProductParametersElDTO> = await db.query(
      'SELECT * FROM "Parameters" WHERE id IN (SELECT parameters FROM "ProductParameters" WHERE product = $1)',
      [id]
    );

    res.json(params.rows);
  }

  async getProductShops(req: Request, res: Response) {
    const id = req.params.id;
    const region = req.query.region;

    const shops: Query<ProductShopDTO> = await db.query(
      `SELECT shop AS id, name, image, rate, link, price FROM "ProductShop" AS PS INNER JOIN "Shop" AS SH ON PS.shop = SH.id WHERE PS.product = $1 AND PS.region = (SELECT id FROM "Region" WHERE name = $2)`,
      [id, region]
    );

    res.json(shops.rows);
  }

  async getProducts(req: Request, res: Response) {
    const region = req.query.region;
    const category = req.query.category;
    const priceCategory = req.query.priceCategory;
    const vector: string = req.query.vector as string;

    //user Vector
    const usersStartVector = vector.split('|');

    const vectorRatio = await db.query(
      'SELECT ratio FROM "VectorParameters" WHERE category = $1',
      [category]
    );

    const ratioArray: number[] = vectorRatio.rows.map(
      (obj: { ratio: string }) => parseInt(obj.ratio)
    );

    let userVector: number[] = [];
    usersStartVector.forEach((element: string, index: number) => {
      userVector.push(parseInt(element) * ratioArray[index]);
    });

    //productVectors

    const productsData = await db.query(
      'SELECT product, "vectorParameters", value FROM "ProductVectorParameters" WHERE product IN (SELECT id FROM "Product" WHERE id IN (SELECT product FROM "ProductPriceCategory" WHERE "priceCategory" = $1))',
      [priceCategory]
    );

    let allProductsVector: number[][] = [];
    let usedProducts: number[] = [];

    productsData.rows.forEach(
      (item: { product: number; vectorParameters: number; value: string }) => {
        if (usedProducts.includes(item.product)) {
          allProductsVector[item.product][item.vectorParameters] = parseInt(
            item.value
          );
        } else {
          allProductsVector[item.product] = [item.product];
          allProductsVector[item.product][item.vectorParameters] = parseInt(
            item.value
          );
          usedProducts.push(item.product);
        }
      }
    );

    //del empty values
    allProductsVector = allProductsVector.filter(function (element) {
      return element !== null;
    });
    allProductsVector.forEach((item, index) => {
      allProductsVector[index] = item.filter(function (element: number) {
        return element !== null;
      });
    });

    allProductsVector.forEach((item) => {
      ratioArray.forEach((element: number, index: number) => {
        item[index + 1] *= element;
      });
    });

    //Euclidean distance
    allProductsVector.forEach((item) => {
      userVector.forEach((element, index) => {
        item[index + 1] = Math.pow(element - item[index + 1], 2);
      });
    });

    allProductsVector.forEach((item) => {
      item.forEach((element: number, index: number) => {
        if (index != 0) {
          item[1] += element;
        }
      });
      item[1] = Math.sqrt(item[1]);
      item.splice(2);
    });

    //sort and delete

    allProductsVector.sort((a, b) => a[1] - b[1]);
    allProductsVector.splice(3);

    //get products

    let products: Query<ProductDTO[]>;

    switch (region) {
      case 'RU':
        products = await db.query(
          'SELECT id, name, "officialLink", image, "descriptionRu" AS "description" FROM "Product" WHERE id IN ($1, $2, $3) ORDER BY CASE id WHEN $1 THEN 1 WHEN $2 THEN 2 WHEN $3 THEN 3 END',
          [
            allProductsVector[0][0],
            allProductsVector[1][0],
            allProductsVector[2][0],
          ]
        );
        break;
      case 'KZ':
        products = await db.query(
          'SELECT id, name, "officialLink", image, "descriptionKz" AS "description" FROM "Product" WHERE id IN ($1, $2, $3) ORDER BY CASE id WHEN $1 THEN 1 WHEN $2 THEN 2 WHEN $3 THEN 3 END',
          [
            allProductsVector[0][0],
            allProductsVector[1][0],
            allProductsVector[2][0],
          ]
        );
        break;
      default:
        products = await db.query(
          'SELECT id, name, "officialLink", image, "descriptionEng" AS "description" FROM "Product" WHERE id IN ($1, $2, $3) ORDER BY CASE id WHEN $1 THEN 1 WHEN $2 THEN 2 WHEN $3 THEN 3 END',
          [
            allProductsVector[0][0],
            allProductsVector[1][0],
            allProductsVector[2][0],
          ]
        );
        break;
    }

    allProductsVector.forEach((item, index) => {
      res.setHeader('product-' + (index + 1) + '-coincidence', item[1]);
    });

    res.json(products.rows);
  }
}

module.exports = new productPageController();
