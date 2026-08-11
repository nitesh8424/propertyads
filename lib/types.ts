export type Property = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  property_type: string;
  area: string;
  road_width: string;
  facing: string;
  availability: string;
  email: string;
  mobile: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  primary_photo_id: number | null;
};
export type Photo = {
  id: number;
  property_id: number;
  mime_type: string;
  file_name: string;
  is_primary: boolean;
  sort_order: number;
};
