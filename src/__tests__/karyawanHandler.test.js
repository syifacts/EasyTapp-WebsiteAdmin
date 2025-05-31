const { tambahKaryawan } = require('../scripts/karyawanHandler');

const mockSelectEq = jest.fn();
const mockUpdateEq = jest.fn();

const mockSelect = jest.fn(() => ({
  eq: mockSelectEq
}));

const mockInsert = jest.fn();
const mockUpdate = jest.fn(() => ({
  eq: mockUpdateEq
}));

const mockSupabase = {
  from: jest.fn((tableName) => {
    if (tableName === 'employees') {
      return {
        select: mockSelect,
        insert: mockInsert,
      };
    } else if (tableName === 'rfid_tag') {
      return {
        update: mockUpdate,
      };
    }
    return {};
  }),
};

beforeEach(() => {
  jest.clearAllMocks();
});

test('berhasil menambahkan karyawan baru', async () => {
  mockSelectEq.mockReturnValueOnce({ data: [] }); // ID tidak ada
  mockInsert.mockReturnValueOnce({ data: [{ id: 1 }], error: null });
  mockUpdateEq.mockReturnValueOnce({}); // update status berhasil

  const result = await tambahKaryawan({
    id: 1,
    name: 'Udin',
    rfid_tag: '123456',
    currentHashedPassword: 'hashedpass',
    supabase: mockSupabase
  });

  expect(result.success).toBe(true);
  expect(result.message).toBe('Data berhasil ditambahkan');
});

test('gagal jika ID sudah ada', async () => {
  mockSelectEq.mockReturnValueOnce({ data: [{ id: 1 }] });

  const result = await tambahKaryawan({
    id: 1,
    name: 'Udin',
    rfid_tag: '123456',
    currentHashedPassword: 'hashedpass',
    supabase: mockSupabase
  });

  expect(result.success).toBe(false);
  expect(result.message).toBe('ID sudah ada, silakan pilih ID lain');
});

test('gagal jika ada error saat insert', async () => {
  mockSelectEq.mockReturnValueOnce({ data: [] });
  mockInsert.mockReturnValueOnce({
    data: null,
    error: { code: '400', message: 'Insert failed' }
  });

  const result = await tambahKaryawan({
    id: 2,
    name: 'Budi',
    rfid_tag: '654321',
    currentHashedPassword: 'hashedpass',
    supabase: mockSupabase
  });

  expect(result.success).toBe(false);
  expect(result.message).toMatch(/Gagal menambahkan data/);
});

test('gagal jika nama kosong dan RFID tidak tersedia', async () => {
  const result = await tambahKaryawan({
    id: 1,
    name: '',
    rfid_tag: '',
    currentHashedPassword: 'pass',
    supabase: mockSupabase
  });

  expect(result.success).toBe(false);
  expect(result.message).toBe('Semua field wajib diisi.');
});
