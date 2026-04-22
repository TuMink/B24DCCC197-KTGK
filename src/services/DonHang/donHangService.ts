import { IOrder, OrderStatus } from '@/typings/donHang';

const STORAGE_KEY = 'donHang_list';

const getDuLieuMauMacDinh = (): IOrder[] => {
  const now = new Date().toISOString();
  return [
    {
      id: '1',
      maDonHang: 'DH001',
      idKhachHang: '1',
      tenKhachHang: 'Nguyễn Văn A',
      ngayDatHang: '2024-04-20',
      cacSanPham: [
        {
          idSanPham: '1',
          tenSanPham: 'Laptop Dell',
          soLuong: 1,
          giaBan: 15000000,
          thanhTien: 15000000,
        },
      ],
      tongTien: 15000000,
      trangThai: OrderStatus.CHO_XAC_NHAN,
      ghiChu: '',
      ngayTao: now,
      ngayCapNhat: now,
    },
    {
      id: '2',
      maDonHang: 'DH002',
      idKhachHang: '2',
      tenKhachHang: 'Trần Thị B',
      ngayDatHang: '2024-04-21',
      cacSanPham: [
        {
          idSanPham: '2',
          tenSanPham: 'Mouse Logitech',
          soLuong: 2,
          giaBan: 500000,
          thanhTien: 1000000,
        },
      ],
      tongTien: 1000000,
      trangThai: OrderStatus.DANG_GIAO,
      ghiChu: '',
      ngayTao: now,
      ngayCapNhat: now,
    },
  ];
};

export const layDanhSachDonHang = (): IOrder[] => {
  const duLieu = localStorage.getItem(STORAGE_KEY);
  if (!duLieu) {
    const duLieuMacDinh = getDuLieuMauMacDinh();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(duLieuMacDinh));
    return duLieuMacDinh;
  }
  return JSON.parse(duLieu);
};

export const themDonHang = (donHang: Omit<IOrder, 'id' | 'ngayTao' | 'ngayCapNhat'>): IOrder => {
  const danhSach = layDanhSachDonHang();
  const idMoi = Date.now().toString();
  const now = new Date().toISOString();

  const donHangMoi: IOrder = {
    ...donHang,
    id: idMoi,
    ngayTao: now,
    ngayCapNhat: now,
  };

  danhSach.push(donHangMoi);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSach));
  return donHangMoi;
};

export const capNhatDonHang = (id: string, duLieuCapNhat: Partial<IOrder>): IOrder | null => {
  const danhSach = layDanhSachDonHang();
  const chiSo = danhSach.findIndex((dh) => dh.id === id);

  if (chiSo === -1) {
    return null;
  }

  const now = new Date().toISOString();
  danhSach[chiSo] = {
    ...danhSach[chiSo],
    ...duLieuCapNhat,
    ngayCapNhat: now,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSach));
  return danhSach[chiSo];
};

export const xoaDonHang = (id: string): boolean => {
  const danhSach = layDanhSachDonHang();
  const chiSo = danhSach.findIndex((dh) => dh.id === id);

  if (chiSo === -1) {
    return false;
  }

  danhSach.splice(chiSo, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSach));
  return true;
};

export const kiemTraMaDonHangTonTai = (maDonHang: string, idBiLoaiTru?: string): boolean => {
  const danhSach = layDanhSachDonHang();
  return danhSach.some((dh) => dh.maDonHang === maDonHang && dh.id !== idBiLoaiTru);
};

export const layDonHangTheoId = (id: string): IOrder | null => {
  const danhSach = layDanhSachDonHang();
  return danhSach.find((dh) => dh.id === id) || null;
};

export const xoaDuLieuLocalStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
