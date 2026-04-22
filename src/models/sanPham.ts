import { Effect, Reducer } from 'umi';
import { ISanPham } from '@/typings/sanPham';
import { layDanhSachSanPham } from '@/services/DonHang/sanPhamService';

export interface ISanPhamState {
  danhSach: ISanPham[];
  dangTai: boolean;
}

interface ISanPhamModel {
  namespace: 'sanPham';
  state: ISanPhamState;
  effects: {
    layDanhSach: Effect;
  };
  reducers: {
    duyetDanhSach: Reducer<ISanPhamState>;
    capNhatTrangThaiTai: Reducer<ISanPhamState>;
  };
}

const initialState: ISanPhamState = {
  danhSach: [],
  dangTai: false,
};

const sanPhamModel: ISanPhamModel = {
  namespace: 'sanPham',
  state: initialState,
  effects: {
    *layDanhSach(_, { put }) {
      yield put({
        type: 'capNhatTrangThaiTai',
        payload: true,
      });
      try {
        const duLieu = layDanhSachSanPham();
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
      } as ISanPhamState; // Đã ép kiểu tại đây
    },
    capNhatTrangThaiTai(state, { payload }) {
      return {
        ...state,
        dangTai: payload,
      } as ISanPhamState; // Đã ép kiểu tại đây
    },
  },
};

export default sanPhamModel;