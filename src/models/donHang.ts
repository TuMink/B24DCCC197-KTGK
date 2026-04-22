import { Effect, Reducer } from 'umi';
import { IOrder, IOrderFilter } from '@/typings/donHang';
import {
  layDanhSachDonHang,
  themDonHang,
  capNhatDonHang,
  xoaDonHang,
} from '@/services/DonHang/donHangService';

export interface IDonHangState {
  danhSach: IOrder[];
  donHangChon: IOrder | null;
  dangTai: boolean;
  loiThu: null | string;
  boLocHienTai: IOrderFilter;
  danhSachLoc: IOrder[];
}

interface IDonHangModel {
  namespace: 'donHang';
  state: IDonHangState;
  effects: {
    layDanhSach: Effect;
    themMoi: Effect;
    capNhat: Effect;
    xoa: Effect;
  };
  reducers: {
    duyetDanhSach: Reducer<IDonHangState>;
    duyetDonHangChon: Reducer<IDonHangState>;
    capNhatTrangThaiTai: Reducer<IDonHangState>;
    capNhatLoi: Reducer<IDonHangState>;
    capNhatBoLoc: Reducer<IDonHangState>;
    capNhatDanhSachLoc: Reducer<IDonHangState>;
    xoaLoi: Reducer<IDonHangState>;
  };
}

const initialState: IDonHangState = {
  danhSach: [],
  donHangChon: null,
  dangTai: false,
  loiThu: null,
  boLocHienTai: {
    tuKhoa: '',
    trangThai: '',
    sxTheo: 'ngayDatHang',
    thuTuSx: 'desc',
  },
  danhSachLoc: [],
};

const donHangModel: IDonHangModel = {
  namespace: 'donHang',
  state: initialState,
  effects: {
    *layDanhSach(_, { put }) {
      yield put({
        type: 'capNhatTrangThaiTai',
        payload: true,
      });
      try {
        const duLieu = layDanhSachDonHang();
        yield put({
          type: 'duyetDanhSach',
          payload: duLieu,
        });
      } catch (loi) {
        yield put({
          type: 'capNhatLoi',
          payload: 'Không thể tải danh sách đơn hàng',
        });
      } finally {
        yield put({
          type: 'capNhatTrangThaiTai',
          payload: false,
        });
      }
    },
    *themMoi({ payload }, { put, select }) {
      yield put({
        type: 'capNhatTrangThaiTai',
        payload: true,
      });
      try {
        themDonHang(payload);
        yield put({
          type: 'layDanhSach',
        });
      } catch (loi) {
        yield put({
          type: 'capNhatLoi',
          payload: 'Không thể thêm đơn hàng',
        });
      } finally {
        yield put({
          type: 'capNhatTrangThaiTai',
          payload: false,
        });
      }
    },
    *capNhat({ payload }, { put, select }) {
      const { id, duLieu } = payload;
      yield put({
        type: 'capNhatTrangThaiTai',
        payload: true,
      });
      try {
        capNhatDonHang(id, duLieu);
        yield put({
          type: 'layDanhSach',
        });
      } catch (loi) {
        yield put({
          type: 'capNhatLoi',
          payload: 'Không thể cập nhật đơn hàng',
        });
      } finally {
        yield put({
          type: 'capNhatTrangThaiTai',
          payload: false,
        });
      }
    },
    *xoa({ payload }, { put, select }) {
      yield put({
        type: 'capNhatTrangThaiTai',
        payload: true,
      });
      try {
        xoaDonHang(payload);
        yield put({
          type: 'layDanhSach',
        });
      } catch (loi) {
        yield put({
          type: 'capNhatLoi',
          payload: 'Không thể xóa đơn hàng',
        });
      } finally {
        yield put({
          type: 'capNhatTrangThaiTai',
          payload: false,
        });
      }
    },
  },
  reducers: {
    duyetDanhSach(state, { payload }) {
      return {
        ...state,
        danhSach: payload,
        danhSachLoc: payload,
      };
    },
    duyetDonHangChon(state, { payload }) {
      return {
        ...state,
        donHangChon: payload,
      };
    },
    capNhatTrangThaiTai(state, { payload }) {
      return {
        ...state,
        dangTai: payload,
      };
    },
    capNhatLoi(state, { payload }) {
      return {
        ...state,
        loiThu: payload,
      };
    },
    capNhatBoLoc(state, { payload }) {
      return {
        ...state,
        boLocHienTai: payload,
      };
    },
    capNhatDanhSachLoc(state, { payload }) {
      return {
        ...state,
        danhSachLoc: payload,
      };
    },
    xoaLoi(state) {
      return {
        ...state,
        loiThu: null,
      };
    },
  },
};

export default donHangModel;
