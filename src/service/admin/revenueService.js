import revenueApi from '../../config/revenueApi';

const revenueService = {
  // Lấy danh sách doanh thu từ danh sách CCDV
  async fetchRevenuesByCcdvList(ccdvList = []) {
    try {
      const revenues = [];
      
      for (const ccdv of ccdvList) {
        const total = await revenueApi.getTotalRevenueByCcdv(ccdv.id);
        revenues.push({
          id: ccdv.id,
          ccdvId: ccdv.id,
          ccdvName: ccdv.username || 'N/A',
          ccdvEmail: ccdv.email || 'N/A',
          amount: total || 0,
          formattedAmount: (total || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        });
      }
      
      return revenues;
    } catch (error) {
      console.error('Lỗi khi lấy doanh thu CCDV:', error);
      throw error;
    }
  },

  // Lấy doanh thu của 1 CCDV
  async getTotalRevenueByCcdv(ccdvId) {
    try {
      const response = await revenueApi.getTotalRevenueByCcdv(ccdvId);
      return response;
    } catch (error) {
      console.error('Lỗi khi lấy tổng doanh thu:', error);
      throw error;
    }
  },

  // Tính tổng doanh thu
  calculateTotalRevenue(revenues) {
    return revenues.reduce((total, item) => total + (item.amount || 0), 0);
  },
};

export default revenueService;