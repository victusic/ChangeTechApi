export interface ShopDTO {
  id: number;
  image: string;
  link: string;
}
export interface ViewStatisticDTO {
  visits: number;
  selections: number;
  stats: string;
  recalls: string;
}

export interface VisitDTO {
  _id: number;
  count: number;
}

export interface SelectionDTO {
  _id: number;
  count: number;
}
