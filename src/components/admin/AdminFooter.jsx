import React from "react";

export default function AdminFooter() {
  return (
    <footer className="bg-light text-center py-3 mt-5 border-top">
      <p className="mb-0 text-muted">
        © {new Date().getFullYear()} Lover Admin — Trung tâm điều hành dịch vụ
      </p>
    </footer>
  );
}

