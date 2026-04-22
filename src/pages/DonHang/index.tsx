import React, { useEffect, useState } from 'react';
import { Card, Button, Space, message, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, useDispatch } from 'umi';
import { IOrder, IOrderFilter, OrderStatus } from '@/typings/donHang';
import { IKhachHang } from '@/typings/khachHang';
import { ISanPham } from '@/typings/sanPham';
import { IDonHangState } from '@/models/donHang';
import { IKhachHangState } from '@/models/khachHang';
import { ISanPhamState } from '@/models/sanPham';
import BangDonHang from './components/BangDonHang';
import BieuMauDonHang from './components/BieuMauDonHang';
import BoLocDonHang from './components/BoLocDonHang';
import { xoaDonHang } from '@/services/DonHang/donHangService';

interface IDonHangPageProps {
  donHang: IDonHangState;
  khachHang: IKhachHangState;
  sanPham: ISanPhamState;
}

const DonHangPage: React.FC<IDonHangPageProps> = ({
  donHang,
  khachHang,
  sanPham,
}) => {
  const dispatch = useDispatch();
  const [moThemSua, setMoThemSua] = useState(false);
  const [donHangCapNhat, setDonHangCapNhat] = useState<IOrder | null>(null);
  const [danhSachLoc, setDanhSachLoc] = useState<IOrder[]>([]);

  useEffect(() => {
    dispatch({
      type: 'donHang/layDanhSach',
    });
    dispatch({
      type: 'khachHang/layDanhSach',
    });
    dispatch({
      type: 'sanPham/layDanhSach',
    });
  }, [dispatch]);

  useEffect(() => {
    locDonHang(donHang.boLocHienTai);
  }, [donHang.danhSach]);

  const locDonHang = (boLoc: IOrderFilter) => {
    let duLieuLoc = [...donHang.danhSach];

    if (boLoc.tuKhoa) {
      const tuKhoaHoa = boLoc.tuKhoa.toLowerCase();
      duLieuLoc = duLieuLoc.filter(
        (dh) =>
          dh.maDonHang.toLowerCase().includes(tuKhoaHoa) ||
          dh.tenKhachHang.toLowerCase().includes(tuKhoaHoa),
      );
    }

    if (boLoc.trangThai) {
      duLieuLoc = duLieuLoc.filter((dh) => dh.trangThai === boLoc.trangThai);
    }

    duLieuLoc.sort((a, b) => {
      let gia1, gia2;
      if (boLoc.sxTheo === 'ngayDatHang') {
        gia1 = new Date(a.ngayDatHang).getTime();
        gia2 = new Date(b.ngayDatHang).getTime();
      } else {
        gia1 = a.tongTien;
        gia2 = b.tongTien;
      }

      return boLoc.thuTuSx === 'asc' ? gia1 - gia2 : gia2 - gia1;
    });

    setDanhSachLoc(duLieuLoc);
    dispatch({
      type: 'donHang/capNhatDanhSachLoc',
      payload: duLieuLoc,
    });
  };

  const xuLyBoLocThayDoi = (boLoc: IOrderFilter) => {
    dispatch({
      type: 'donHang/capNhatBoLoc',
      payload: boLoc,
    });
    locDonHang(boLoc);
  };

  const xuLyThemDonHang = () => {
    setDonHangCapNhat(null);
    setMoThemSua(true);
  };

  const xuLySuaDonHang = (donHang: IOrder) => {
    setDonHangCapNhat(donHang);
    setMoThemSua(true);
  };

  const xuLyDongModal = () => {
    setMoThemSua(false);
    setDonHangCapNhat(null);
  };

  const xuLyGuiDonHang = (duLieu: Omit<IOrder, 'id' | 'ngayTao' | 'ngayCapNhat'>) => {
    if (donHangCapNhat) {
      dispatch({
        type: 'donHang/capNhat',
        payload: {
          id: donHangCapNhat.id,
          duLieu,
        },
      });
      message.success('Cập nhật đơn hàng thành công');
    } else {
      dispatch({
        type: 'donHang/themMoi',
        payload: duLieu,
      });
      message.success('Thêm đơn hàng thành công');
    }
  };

  const xuLyXoaDonHang = (donHang: IOrder) => {
    dispatch({
      type: 'donHang/xoa',
      payload: donHang.id,
    });
    message.success('Xóa đơn hàng thành công');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <h1 style={{ margin: 0 }}>Quản lý đơn hàng</h1>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={xuLyThemDonHang}
          >
            Thêm đơn hàng
          </Button>
        </Col>
      </Row>

      <BoLocDonHang
        boLoc={donHang.boLocHienTai}
        onBoLocThayDoi={xuLyBoLocThayDoi}
      />

      <Card>
        <BangDonHang
          duLieu={danhSachLoc}
          dangTai={donHang.dangTai}
          onSua={xuLySuaDonHang}
          onXoa={xuLyXoaDonHang}
          onLayLaiDanhSach={() => {
            dispatch({ type: 'donHang/layDanhSach' });
          }}
        />
      </Card>

      <BieuMauDonHang
        visible={moThemSua}
        donHangCapNhat={donHangCapNhat}
        danhSachKhachHang={khachHang.danhSach}
        danhSachSanPham={sanPham.danhSach}
        onDong={xuLyDongModal}
        onGui={xuLyGuiDonHang}
        dangTai={donHang.dangTai}
      />
    </div>
  );
};

export default connect(({ donHang, khachHang, sanPham }: {
  donHang: IDonHangState;
  khachHang: IKhachHangState;
  sanPham: ISanPhamState;
}) => ({
  donHang,
  khachHang,
  sanPham,
}))(DonHangPage);
