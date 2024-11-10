export interface ProductDTO{
  id: number;
  name: string;
  officialLink: string;
  image: string;
  description: string;
}

export interface PriceCategoryDTO{
  id: number;
  name: string;
}

export interface ProductParametersElDTO{
  id: number;
  parameter1: string;
  parameter2: string;
  parameter3: string;
  parameter4: string;
}

export interface ProductShopDTO{
  id: number;
  name: string;
  image: string;
  rate: string;
  link: string;
  price: string;
}