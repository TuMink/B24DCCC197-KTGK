import { IKhachHang } from '@/typings/khachHang';

export const layDanhSachKhachHang = (): IKhachHang[] => {
  return [
    {
      id: '1',
      ten: 'Nguyễn Văn A',
      soDienThoai: '0912345678',
      email: 'nguyenvana@email.com',
      diaChi: '123 Nguyễn Huệ, HCMC',
    },
    {
      id: '2',
      ten: 'Trần Thị B',
      soDienThoai: '0987654321',
      email: 'tranthib@email.com',
      diaChi: '456 Võ Văn Kiệt, HCMC',
    },
    {
      id: '3',
      ten: 'Lê Minh C',
      soDienThoai: '0901234567',
      email: 'leminhc@email.com',
      diaChi: '789 Trần Hưng Đạo, HCMC',
    },
    {
      id: '4',
      ten: 'Phàm Quốc D',
      soDienThoai: '0934567890',
      email: 'phamquocd@email.com',
      diaChi: '321 Cách Mạng Tháng 8, HCMC',
    },
  ];
};

export const layKhachHangTheoId = (id: string): IKhachHang | null => {
  const danhSach = layDanhSachKhachHang();
  return danhSach.find((kh) => kh.id === id) || null;
};
