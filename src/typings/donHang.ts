export enum OrderStatus {
  CHO_XAC_NHAN = 'cho_xac_nhan',
  DANG_GIAO = 'dang_giao',
  HOAN_THANH = 'hoan_thanh',
  HUY = 'huy',
}

export interface IOrderItem {
  idSanPham: string;
  tenSanPham: string;
  soLuong: number;
  giaBan: number;
  thanhTien: number;
}

export interface IOrder {
  id: string;
  maDonHang: string;
  idKhachHang: string;
  tenKhachHang: string;
  ngayDatHang: string;
  cacSanPham: IOrderItem[];
  tongTien: number;
  trangThai: OrderStatus;
  ghiChu?: string;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface IOrderFilter {
  tuKhoa: string;
  trangThai: OrderStatus | '';
  sxTheo: 'ngayDatHang' | 'tongTien';
  thuTuSx: 'asc' | 'desc';
}
