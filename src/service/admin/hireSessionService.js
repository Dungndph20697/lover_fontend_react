import hireSessionApi from '../../config/hireSessionApi';

const STATUS_MAP = {
  'PENDING': 'Chờ phản hồi',
  'ACCEPTED': 'Đã nhận',
  'COMPLETED': 'Đã hoàn thành',
  'REVIEW_REPORT': 'Duyệt báo cáo',
};

const hireSessionService = {
  // Lấy danh sách đơn đặt thuê với xử lý dữ liệu
  async fetchHireSessions(page = 0, size = 20) {
    try {
      const response = await hireSessionApi.getAllHireSessions(page, size);
      const data = response.data;

      return {
        content: data.content.map((item, index) => ({
          ...item,
          stt: page * size + index + 1,
          providerName: item.ccdv?.name || item.ccdv?.username || item.ccdv?.email || 'N/A',
          userName: item.user?.name || item.user?.username || item.user?.email || 'N/A',
          date: new Date(item.startTime).toLocaleDateString('vi-VN'),
          totalPrice: item.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 ₫',
          statusDisplay: STATUS_MAP[item.status] || item.status,
          statusCode: item.status,
        })),
        totalPages: data.totalPages,
        totalElements: data.totalElements,
        currentPage: data.number,
        pageSize: data.size,
        hasNext: data.hasNext,
        hasPrevious: data.hasPrevious,
      };
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn đặt thuê:', error);
      throw error;
    }
  },

  // Lấy chi tiết đơn thuê
  async getHireSessionDetail(hireSessionId) {
    try {
      const response = await hireSessionApi.getHireSessionDetail(hireSessionId);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn:', error);
      throw error;
    }
  },

  // Duyệt báo cáo
  async approveReport(hireSessionId) {
    try {
      const response = await hireSessionApi.approveReport(hireSessionId);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi duyệt báo cáo:', error);
      throw error;
    }
  },

  // Từ chối báo cáo
  async rejectReport(hireSessionId) {
    try {
      const response = await hireSessionApi.rejectReport(hireSessionId);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi từ chối báo cáo:', error);
      throw error;
    }
  },

  // Duyệt đơn
  async approveHireSession(hireSessionId) {
    try {
      const response = await hireSessionApi.approveHireSession(hireSessionId);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi duyệt đơn:', error);
      throw error;
    }
  },

  // Xác định hành động hiển thị cho đơn
  getActions(hireSession) {
    console.log('getActions - HireSession:', hireSession);
    console.log('statusCode:', hireSession.statusCode);
    console.log('status:', hireSession.status);
    
    const actions = [];

    // Nếu là REVIEW_REPORT, hiển thị nút duyệt báo cáo
    if (hireSession.statusCode === 'REVIEW_REPORT') {
      console.log('Adding reviewReport action');
      actions.push({ type: 'reviewReport', label: 'Xem & Duyệt', icon: '👁️' });
    }

    // Nếu là PENDING, hiển thị nút duyệt đơn
    if (hireSession.statusCode === 'PENDING') {
      actions.push({ type: 'approve', label: 'Duyệt', icon: '✓' });
    }

    console.log('Final actions:', actions);
    return actions;
  },
};

export default hireSessionService;