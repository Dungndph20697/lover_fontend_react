import qrCodeImg from "../../assets/imgQR/QR_Code (1).png";

export default function TopupQRModal({ topupAmount, setTopupAmount }) {

    const user = JSON.parse(localStorage.getItem("userData"));
    const topupCode = user?.topupCode || "UNKNOWN";

    return (
        <div className="modal fade" id="qrTopupModal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5>Nạp tiền bằng QR</h5>
                        <button className="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div className="modal-body text-center">

                        {/* QR TĨNH */}
                        <img src={qrCodeImg} className="img-fluid mb-3" />

                        {/* NỘI DUNG CHUYỂN TIỀN */}
                        <p>
                            Nội dung chuyển khoản:
                            <br />
                            <b className="text-danger">{topupCode}</b>
                        </p>

                        {/* NHẬP TIỀN */}
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Nhập số tiền..."
                            value={topupAmount}
                            onChange={(e) => setTopupAmount(e.target.value)}
                        />
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" data-bs-dismiss="modal">
                            Đóng
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
