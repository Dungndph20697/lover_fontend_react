import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

// Component hiển thị danh sách CCDV (dịch vụ)
export function CCDVList({ services }) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">📋 Danh sách dịch vụ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <Card key={s.id} className="rounded-2xl shadow-md p-5">
            <h3 className="text-xl font-semibold mb-2">{s.name}</h3>
            <p className="text-gray-700 mb-3">{s.description}</p>
            <p className="font-bold text-lg text-pink-600">{s.price}K / giờ</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Trang khi người dùng đăng nhập
export function LoggedInHome() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Chào mừng bạn trở lại 👋</h1>
      <ProvidersList />
    </div>
  );
}