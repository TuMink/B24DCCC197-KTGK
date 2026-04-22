import React from 'react';
import { Tag } from 'antd';
import { OrderStatus } from '@/typings/donHang';

interface ITheTagTrangThaiProps {
  trangThai: OrderStatus;
}

const TheTagTrangThai: React.FC<ITheTagTrangThaiProps> = ({ trangThai }) => {
  const cauHinhTrangThai: Record<OrderStatus, { mau: string; tenHienThi: string }> = {
    [OrderStatus.CHO_XAC_NHAN]: {
      mau: 'processing',
      tenHienThi: 'Chờ xác nhận',
    },
    [OrderStatus.DANG_GIAO]: {
      mau: 'blue',
      tenHienThi: 'Đang giao',
    },
    [OrderStatus.HOAN_THANH]: {
      mau: 'success',
      tenHienThi: 'Hoàn thành',
    },
    [OrderStatus.HUY]: {
      mau: 'error',
      tenHienThi: 'Hủy',
    },
  };

  const { mau, tenHienThi } = cauHinhTrangThai[trangThai];

  return <Tag color={mau}>{tenHienThi}</Tag>;
};

export default TheTagTrangThai;
