import React, { useState } from 'react';
import { Card, Input, Select, Button, Row, Col, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { IOrderFilter } from '@/typings/donHang';
import { OrderStatus } from '@/typings/donHang';

interface IBoLocDonHangProps {
  boLoc: IOrderFilter;
  onBoLocThayDoi: (boLoc: IOrderFilter) => void;
}

const BoLocDonHang: React.FC<IBoLocDonHangProps> = ({ boLoc, onBoLocThayDoi }) => {
  const capNhatTuKhoa = (tuKhoa: string) => {
    onBoLocThayDoi({
      ...boLoc,
      tuKhoa,
    });
  };

  const capNhatTrangThai = (trangThai: OrderStatus | '') => {
    onBoLocThayDoi({
      ...boLoc,
      trangThai,
    });
  };

  const capNhatSapXepTheo = (sxTheo: 'ngayDatHang' | 'tongTien') => {
    onBoLocThayDoi({
      ...boLoc,
      sxTheo,
    });
  };

  const capNhatThuTuSapXep = (thuTuSx: 'asc' | 'desc') => {
    onBoLocThayDoi({
      ...boLoc,
      thuTuSx,
    });
  };

  const xoaBoLoc = () => {
    onBoLocThayDoi({
      tuKhoa: '',
      trangThai: '',
      sxTheo: 'ngayDatHang',
      thuTuSx: 'desc',
    });
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Tìm kiếm mã đơn hoặc khách hàng"
            prefix={<SearchOutlined />}
            value={boLoc.tuKhoa}
            onChange={(e) => capNhatTuKhoa(e.target.value)}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            value={boLoc.trangThai || undefined}
            onChange={capNhatTrangThai}
            style={{ width: '100%' }}
            options={[
              { label: 'Chờ xác nhận', value: OrderStatus.CHO_XAC_NHAN },
              { label: 'Đang giao', value: OrderStatus.DANG_GIAO },
              { label: 'Hoàn thành', value: OrderStatus.HOAN_THANH },
              { label: 'Hủy', value: OrderStatus.HUY },
            ]}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            value={boLoc.sxTheo}
            onChange={capNhatSapXepTheo}
            style={{ width: '100%' }}
            options={[
              { label: 'Sắp xếp theo ngày', value: 'ngayDatHang' },
              { label: 'Sắp xếp theo tiên', value: 'tongTien' },
            ]}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Select
            value={boLoc.thuTuSx}
            onChange={capNhatThuTuSapXep}
            style={{ width: '100%' }}
            options={[
              { label: 'Tăng dần', value: 'asc' },
              { label: 'Giảm dần', value: 'desc' },
            ]}
          />
        </Col>
      </Row>

      <Row style={{ marginTop: 12 }} justify="end">
        <Button
          icon={<ClearOutlined />}
          onClick={xoaBoLoc}
          style={{ backgroundColor: '#f0f0f0' }}
        >
          Xóa lọc
        </Button>
      </Row>
    </Card>
  );
};

export default BoLocDonHang;
