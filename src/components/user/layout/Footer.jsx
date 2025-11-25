import React from "react";

export default function Footer() {
  return (
    <footer className="text-center py-3 bg-light mt-auto border-top">
      <small className="text-muted">
        © {new Date().getFullYear()} Lover — Kết nối bằng trái tim 💗
      </small>
    </footer>
  );
}
