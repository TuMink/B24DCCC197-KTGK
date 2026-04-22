import { Effect, Reducer } from 'umi';
import { IKhachHang } from '@/typings/khachHang';
import { layDanhSachKhachHang } from '@/services/DonHang/khachHangService';

export interface IKhachHangState {
  danhSach: IKhachHang[];
  dangTai?: boolean;
}

interface IKhachHangModel {
  namespace: 'khachHang';
  state: IKhachHangState;
  effects: {
    layDanhSach: Effect;
  };
  reducers: {
    duyetDanhSach: Reducer<IKhachHangState>;
    capNhatTrangThaiTai: Reducer<IKhachHangState>;
  };
}

const initialState: IKhachHangState = {
  danhSach: [],
  dangTai: false,
};

const khachHangModel: IKhachHangModel = {
  namespace: 'khachHang',
  state: initialState,
  effects: {
    *layDanhSach(_, { put }) {
      yield put({
        type: 'capNhatTrangThaiTai',
        payload: true,
      });
      try {
        const duLieu = layDanhSachKhachHang();
        yield put({
          type: 'duyetDanhSach',
          payload: duLieu,
        });
      } catch (loi) {
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
      };
    },
    capNhatTrangThaiTai(state, { payload }) {
      return {
        ...state,
        dangTai: payload,
      };
    },
  },
};

export default khachHangModel;
