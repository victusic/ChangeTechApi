const db = require('../dbconfig/pg');

class productPageController {
    async getPriceCategory(req, res){
        const category = req.params.category;
        const region = req.query.region;
        let pricesCategory;

        switch (region) {
            case 'Ru':
                pricesCategory = await db.query('SELECT id, "nameRu" AS "name" FROM "PriceCategoryProduct" WHERE category = $1', [category]);
                break;
            case 'Kz':
                pricesCategory = await db.query('SELECT id, "nameKz" AS "name" FROM "PriceCategoryProduct" WHERE category = $1', [category]);
                break;
            default:
                pricesCategory = await db.query('SELECT id, "nameEng" AS "name" FROM "PriceCategoryProduct" WHERE category = $1', [category]);
                break;
        }

        res.json(pricesCategory.rows);
    }

    async getProductParams(req, res){
        const id = req.params.id;

        const params = await db.query('SELECT * FROM "Parameters" WHERE id IN (SELECT parameters FROM "ProductParameters" WHERE product = $1)', [id]);

        res.json(params.rows);
    }

    async getProductShops(req, res){
        const id = req.params.id;
        const region = req.query.region;

        const shops = await db.query('SELECT shop AS id, name, image, rate, link, price FROM "ProductShop" AS PS INNER JOIN "Shop" AS SH ON PS.shop = SH.id WHERE PS.product = $1 AND PS.region = (SELECT id FROM "Region" WHERE name = $2)', [id, region]);

        res.json(shops.rows);
    }

    async getProducts(req, res){
        const region = req.query.region;
        const category = req.query.category;
        const priceCategory = req.query.priceCategory;
        const vector = req.query.vector;

        //user Vector
        const usersStartVector = vector.split("|");

        const vectorRatio = await db.query('SELECT ratio FROM "VectorParameters" WHERE category = $1', [category]);

        const ratioArray = vectorRatio.rows.map(obj => parseInt(obj.ratio));

        let userVector = [];
        usersStartVector.forEach((element, index) => {
            userVector.push(element * ratioArray[index])
        });

        //console.log(userVector)

        //productVectors

        const productsData = await db.query('SELECT product, "vectorParameters", value FROM "ProductVectorParameters" WHERE product IN (SELECT id FROM "Product" WHERE id IN (SELECT product FROM "ProductPriceCategory" WHERE "priceCategory" = $1))', [priceCategory]);

        let allProductsVector = [];
        let usedProducts = [];

        productsData.rows.forEach((item, index) => {
            if (usedProducts.includes(item.product)) {
                allProductsVector[item.product][item.vectorParameters ] = parseInt(item.value);
            } else {
                allProductsVector[item.product] = [item.product];
                allProductsVector[item.product][item.vectorParameters ] = parseInt(item.value);
                usedProducts.push(item.product)
            }
        });

        //del empty values
        allProductsVector = allProductsVector.filter(function (element) {
            return element !== null;
        });
        allProductsVector.forEach((item, index) => {
            allProductsVector[index] = item.filter(function (element) {
                return element !== null;
            });
        });

        allProductsVector.forEach(item => {
            ratioArray.forEach((element, index) => {
                item[index+1] *= element;
            });
        });

        //Euclidean distance
        allProductsVector.forEach(item => {
            userVector.forEach((element, index) => {
                item[index+1] = Math.pow(element - item[index+1], 2);
            });
        });

        allProductsVector.forEach(item => {
            //console.log(item)
            item.forEach((element, index) => {
                if(index != 0){
                    item[1] += element;
                }
            });
            item[1] = Math.sqrt(item[1])
            item.splice(2);
        });

        //sort and delete

        allProductsVector.sort((a, b) => a[1] - b[1]);
        allProductsVector.splice(3);

        //get products

        let products;

        switch (region) {
            case 'Ru':
                products = await db.query('SELECT id, name, "officialLink", image, "descriptionRu" AS "description" FROM "Product" WHERE id IN ($1, $2, $3) ORDER BY CASE id WHEN $1 THEN 1 WHEN $2 THEN 2 WHEN $3 THEN 3 END', [allProductsVector[0][0], allProductsVector[1][0], allProductsVector[2][0]]);
                break;
            case 'Kz':
                products = await db.query('SELECT id, name, "officialLink", image, "descriptionKz" AS "description" FROM "Product" WHERE id IN ($1, $2, $3) ORDER BY CASE id WHEN $1 THEN 1 WHEN $2 THEN 2 WHEN $3 THEN 3 END', [allProductsVector[0][0], allProductsVector[1][0], allProductsVector[2][0]]);
                break;
            default:
                products = await db.query('SELECT id, name, "officialLink", image, "descriptionEng" AS "description" FROM "Product" WHERE id IN ($1, $2, $3) ORDER BY CASE id WHEN $1 THEN 1 WHEN $2 THEN 2 WHEN $3 THEN 3 END', [allProductsVector[0][0], allProductsVector[1][0], allProductsVector[2][0]]);
                break;
        }

        allProductsVector.forEach((item, index) => {
            res.setHeader('product-'+ (index+1) +'-coincidence', item[1]);
        });

        res.json(products.rows);
    }
}

module.exports = new productPageController()