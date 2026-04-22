import { ISanPham } from '@/typings/sanPham';

export const layDanhSachSanPham = (): ISanPham[] => {
  return [
    {
      id: '1',
      ten: 'Laptop Dell XPS 13',
      gia: 15000000,
      soLuongTon: 5,
      moTa: 'Laptop cao cap, CPU Intel i7',
    },
    {
      id: '2',
      ten: 'Mouse Logitech MX Master',
      gia: 500000,
      soLuongTon: 20,
      moTa: 'Chuot khong day, nhan ung nhanh',
    },
    {
      id: '3',
      ten: 'Ban phim Mechanical',
      gia: 800000,
      soLuongTon: 10,
      moTa: 'Ban phim co cac, switch Cherry MX',
    },
    {
      id: '4',
      ten: 'Man hinh Dell U2720Q',
      gia: 5000000,
      soLuongTon: 3,
      moTa: 'Man hinh 27 inch 4K UHD',
    },
    {
      id: '5',
      ten: 'Tai nghe Sony WH-1000XM5',
      gia: 3000000,
      soLuongTon: 8,
      moTa: 'Tai nghe khong day, khong nhieu am',
    },
  ];
};

export const laySanPhamTheoId = (id: string): ISanPham | null => {
  const danhSach = layDanhSachSanPham();
  return danhSach.find((sp) => sp.id === id) || null;
};
