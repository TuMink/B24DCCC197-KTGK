import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, DatePicker, InputNumber, message, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IOrder, OrderStatus, IOrderItem } from '@/typings/donHang';
import { IKhachHang } from '@/typings/khachHang';
import { ISanPham } from '@/typings/sanPham';
import moment from 'moment';

const { Text } = Typography;

interface IBieuMauDonHangProps {
  visible: boolean;
  donHangCapNhat: IOrder | null;
  danhSachKhachHang: IKhachHang[];
  danhSachSanPham: ISanPham[];
  onDong: () => void;
  onGui: (duLieu: Omit<IOrder, 'id' | 'ngayTao' | 'ngayCapNhat'>) => void;
  dangTai: boolean;
}

const BieuMauDonHang: React.FC<IBieuMauDonHangProps> = ({
  visible,
  donHangCapNhat,
  danhSachKhachHang,
  danhSachSanPham,
  onDong,
  onGui,
  dangTai,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (donHangCapNhat) {
        form.setFieldsValue({
          ...donHangCapNhat,
          ngayDatHang: moment(donHangCapNhat.ngayDatHang),
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          trangThai: OrderStatus.CHO_XAC_NHAN,
          ngayDatHang: moment(),
          cacSanPham: [],
          tongTien: 0,
        });
      }
    }
  }, [visible, donHangCapNhat, form]);

  const xuLyThayDoiGiaTri = (changedValues: any, allValues: any) => {
    if (changedValues.cacSanPham) {
      const cacSanPhamMoi = [...(allValues.cacSanPham || [])];
      let tongTienMoi = 0;

      cacSanPhamMoi.forEach((item: any) => {
        if (item && item.idSanPham) {
          const sanPhamGoc = danhSachSanPham.find((sp) => sp.id === item.idSanPham);
          if (sanPhamGoc) {
            item.tenSanPham = sanPhamGoc.ten;
            item.giaBan = sanPhamGoc.gia;
            item.soLuong = item.soLuong || 1;
            item.thanhTien = item.giaBan * item.soLuong;
          }
          tongTienMoi += item.thanhTien || 0;
        }
      });

      form.setFieldsValue({
        cacSanPham: cacSanPhamMoi,
        tongTien: tongTienMoi,
      });
    }
  };

  const kiemTraMaDonHang = async (_: any, value: string) => {
    if (!value) return Promise.resolve();

    const duLieuRaw = localStorage.getItem('danh_sach_don_hang');
    if (duLieuRaw) {
      const danhSach: IOrder[] = JSON.parse(duLieuRaw);
      const tonTai = danhSach.find(
        (dh) => dh.maDonHang === value && dh.id !== donHangCapNhat?.id
      );
      if (tonTai) {
        return Promise.reject(new Error('Mã đơn hàng này đã tồn tại!'));
      }
    }
    return Promise.resolve();
  };

  const xuLyHoanThanh = (values: any) => {
    if (!values.cacSanPham || values.cacSanPham.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 sản phẩm cho đơn hàng!');
      return;
    }

    const khachHangGoc = danhSachKhachHang.find((kh) => kh.id === values.idKhachHang);

    const duLieuGui: Omit<IOrder, 'id' | 'ngayTao' | 'ngayCapNhat'> = {
      maDonHang: values.maDonHang,
      idKhachHang: values.idKhachHang,
      tenKhachHang: khachHangGoc ? khachHangGoc.ten : '',
      ngayDatHang: values.ngayDatHang.format('YYYY-MM-DD'),
      cacSanPham: values.cacSanPham as IOrderItem[],
      tongTien: values.tongTien || 0,
      trangThai: values.trangThai,
      ghiChu: values.ghiChu,
    };

    onGui(duLieuGui);
  };

  return (
    <Modal
      title={donHangCapNhat ? 'Chỉnh sửa đơn hàng' : 'Thêm mới đơn hàng'}
      visible={visible}
      onCancel={onDong}
      onOk={() => form.submit()}
      confirmLoading={dangTai}
      width={850}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={xuLyHoanThanh}
        onValuesChange={xuLyThayDoiGiaTri}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="maDonHang"
              label="Mã đơn hàng"
              rules={[
                { required: true, message: 'Vui lòng nhập mã đơn hàng' },
                { validator: kiemTraMaDonHang },
              ]}
            >
              <Input placeholder="VD: DH001" disabled={!!donHangCapNhat} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="idKhachHang"
              label="Khách hàng"
              rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
            >
              <Select
                showSearch
                placeholder="Chọn khách hàng..."
                optionFilterProp="children"
                options={danhSachKhachHang.map((kh) => ({ label: kh.ten, value: kh.id }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ngayDatHang"
              label="Ngày đặt hàng"
              rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="trangThai"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select
                placeholder="Chọn trạng thái..."
                options={[
                  { label: 'Chờ xác nhận', value: OrderStatus.CHO_XAC_NHAN },
                  { label: 'Đang giao', value: OrderStatus.DANG_GIAO },
                  { label: 'Hoàn thành', value: OrderStatus.HOAN_THANH },
                  { label: 'Hủy', value: OrderStatus.HUY },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ marginBottom: 16, marginTop: 8 }}>
          <Text strong style={{ fontSize: 16 }}>Danh sách sản phẩm</Text>
        </div>

        <Form.List name="cacSanPham">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={12} align="middle" style={{ marginBottom: 16 }}>
                  <Col span={9}>
                    <Form.Item
                      {...restField}
                      name={[name, 'idSanPham']}
                      rules={[{ required: true, message: 'Chọn Sản phẩm' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        showSearch
                        placeholder="Chọn sản phẩm"
                        optionFilterProp="children"
                        options={danhSachSanPham.map((sp) => ({
                          label: `${sp.ten} (${sp.gia.toLocaleString('vi-VN')} đ)`,
                          value: sp.id,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item
                      {...restField}
                      name={[name, 'soLuong']}
                      rules={[{ required: true, message: 'Nhập số lượng' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber min={1} placeholder="SL" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      {...restField}
                      name={[name, 'giaBan']}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        disabled
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        style={{ width: '100%' }}
                        addonAfter="đ"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      {...restField}
                      name={[name, 'thanhTien']}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber
                        disabled
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        style={{ width: '100%' }}
                        addonAfter="đ"
                        style={{ color: '#cf1322', fontWeight: 'bold' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={1} style={{ textAlign: 'center' }}>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: '#ff4d4f', fontSize: '18px', cursor: 'pointer' }}
                    />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Thêm sản phẩm vào đơn hàng
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Row justify="end" style={{ marginBottom: 16 }}>
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <Text strong style={{ fontSize: 18, marginRight: 16 }}>Tổng tiền đơn hàng:</Text>
            <Form.Item name="tongTien" noStyle>
              <InputNumber
                disabled
                formatter={(value) => `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ fontWeight: 'bold', width: '200px', fontSize: 18, color: '#1890ff' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="ghiChu" label="Ghi chú">
          <Input.TextArea rows={3} placeholder="Nhập ghi chú cho đơn hàng..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BieuMauDonHang;