import React from "react";
import { useState, useEffect } from "react";
import { searchUser } from "../../../service/search-user/searchUser";
import { Link } from "react-router-dom";
import { searchUserWithCity } from "../../../service/search-user/searchUser";

export default function HeroSection() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ageFrom, setAgeFrom] = useState(null);
  const [ageTo, setAgeTo] = useState(null);
  const [gender, setGender] = useState(null);
  const [city, setCity] = useState(null);
  const [sort, setSort] = useState(null);
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      const data = await searchUserWithCity();
      setCityList(data);
    };
    fetchCities();
  }, []);

  const handleSearch = async () => {
    // if (!keyword.trim()) return;
    setLoading(true);

    try {
      const searchRequest = {
        name: keyword,
        ageFrom: ageFrom,
        ageTo: ageTo,
        gender: gender,
        city: city,
        sort: sort,
        page: 0,
        size: 12,
      };
      const data = await searchUser(searchRequest);
      setResults(data.content); // Page<CcdvProfile> có field `content` chứa danh sách
    } catch (err) {
      console.log("Lỗi khi tìm kiếm người dùng:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="hero-section d-flex align-items-center text-center text-white position-relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "80vh",
      }}
    >
      {/* Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "linear-gradient(rgba(0,0,0,0.5), rgba(255,0,80,0.5))",
          zIndex: 0,
        }}
      ></div>

      {/* Content */}
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <h1 className="fw-bold display-4 mb-3">
          Kết nối – Trò chuyện –{" "}
          <span className="text-danger bg-white bg-opacity-75 px-2 rounded">
            Tìm tình yêu
          </span>
        </h1>
        <p className="lead text-light mx-auto w-75 mb-4">
          ❤️ Lover giúp bạn tìm người đồng hành, chia sẻ cảm xúc và trải nghiệm
          những buổi hẹn hò đầy thú vị.
        </p>

        {/* Ô tìm kiếm */}
        <div className="d-flex justify-content-center">
          <div
            className="input-group w-75 w-md-50 shadow-lg"
            style={{ borderRadius: "50px", overflow: "hidden", maxWidth: 600 }}
          >
            <input
              type="text"
              className="form-control border-0 py-3 px-4"
              placeholder="🔍 Tìm người yêu theo tên, thành phố..."
              style={{
                borderTopLeftRadius: "50px",
                borderBottomLeftRadius: "50px",
              }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="btn btn-danger px-4 fw-semibold"
              style={{
                borderTopRightRadius: "50px",
                borderBottomRightRadius: "50px",
              }}
              onClick={handleSearch}
            >
              {loading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>
        </div>

        {/* Bộ lọc nâng cao */}
        <div className="row justify-content-center mt-3 mb-4">
          {/* Tuổi */}
          <div className="col-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Tuổi từ"
              value={ageFrom || ""}
              onChange={(e) => setAgeFrom(e.target.value ? parseInt(e.target.value) : null)}
            />
          </div>
          <div className="col-6 col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Tuổi đến"
              value={ageTo || ""}
              onChange={(e) => setAgeTo(e.target.value ? parseInt(e.target.value) : null)}
            />
          </div>

          {/* Giới tính */}
          <div className="col-6 col-md-2 d-flex align-items-center">
            <select
              className="form-select"
              value={gender || ""}
              onChange={(e) => setGender(e.target.value || null)}
            >
              <option value="">Giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Thành phố */}
          <div className="col-6 col-md-2 d-flex align-items-center">
            <select
              className="form-select"
              value={city || ""}
              onChange={(e) => setCity(e.target.value || null)}
            >
              <option value="">Thành phố</option>
              {cityList.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="col-6 col-md-2 d-flex align-items-center">
            <select
              className="form-select"
              value={sort || ""}
              onChange={(e) => setSort(e.target.value || null)}
            >
              <option value="">Sắp xếp</option>
              <option value="view_desc">Lượt xem nhiều nhất</option>
              <option value="view_asc">Lượt xem ít nhất</option>
              <option value="hire_desc">Lượt thuê nhiều nhất</option>
              <option value="hire_asc">Lượt thuê ít nhất</option>
            </select>
          </div>
        </div>

        {/* Hiển thị kết quả */}
        <div className="row justify-content-center">
          {results.map((profile) => (
            <Link
              to={`/profile/${profile.user.id}`}
              key={profile.id}
              className="col-6 col-md-3 mb-4"
            >
              <div className="card text-dark shadow-sm">
                <img
                  src={profile.avatar || "/default-avatar.png"}
                  className="card-img-top"
                  alt={profile.fullName}
                  style={{ height: 200, objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{profile.fullName}</h5>
                  <p className="card-text">{profile.city}</p>
                  <p className="card-text">{profile.gender}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
