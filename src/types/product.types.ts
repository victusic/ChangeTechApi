export interface ProductDTO {
  id: number;
  name: string;
  officialLink: string;
  image: string;
  description: string;
}

export interface PriceCategoryDTO {
  id: number;
  name: string;
}

export interface ProductParametersElDTO {
  id: number;
  parameters: string[];
}

export interface ProductShopDTO {
  id: number;
  name: string;
  image: string;
  rate: number;
  link: string;
  price: string;
}
