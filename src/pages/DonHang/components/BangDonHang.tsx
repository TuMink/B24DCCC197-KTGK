import React from 'react';
import { Table, Tooltip, Space, Button, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { IOrder, OrderStatus } from '@/typings/donHang';
import TheTagTrangThai from './TheTagTrangThai';
import { xoaDonHang } from '@/services/DonHang/donHangService';

interface IBangDonHangProps {
  duLieu: IOrder[];
  dangTai: boolean;
  onSua: (donHang: IOrder) => void;
  onXoa: (donHang: IOrder) => void;
  onLayLaiDanhSach: () => void;
}

const BangDonHang: React.FC<IBangDonHangProps> = ({
  duLieu,
  dangTai,
  onSua,
  onXoa,
  onLayLaiDanhSach,
}) => {
  const xuLyXoa = (donHang: IOrder) => {
    if (donHang.trangThai !== OrderStatus.CHO_XAC_NHAN) {
      message.warning('Chỉ có thể hủy ở trạng thái Chờ xác nhận');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng?',
      content: `Bạn có chắn chắn muốn hủy đơn hàng? ${donHang.maDonHang}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
      onOk() {
        onXoa(donHang);
      },
    });
  };

  const cacs: ColumnsType<IOrder> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'maDonHang',
      key: 'maDonHang',
      width: 100,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'tenKhachHang',
      key: 'tenKhachHang',
      width: 150,
    },
    {
      title: 'Ngày đặt hàng',
      dataIndex: 'ngayDatHang',
      key: 'ngayDatHang',
      width: 120,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      width: 120,
      render: (text: number) => `${text.toLocaleString('vi-VN')} VND`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (trangThai: OrderStatus) => <TheTagTrangThai trangThai={trangThai} />,
    },
    {
      title: 'Hành động',
      key: 'hanhDong',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Sửa đơn ">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onSua(record)}
            />
          </Tooltip>
          <Tooltip title="Hủy đơn hàng">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => xuLyXoa(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={cacs}
      dataSource={duLieu}
      rowKey="id"
      loading={dangTai}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng cộng ${total} don hang`,
      }}
      scroll={{ x: 800 }}
    />
  );
};

export default BangDonHang;
