export default function ProvidersList() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    getLatestProviders(12).then(data => setProviders(data));
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto py-10">
      <h2 className="text-3xl font-bold text-center mb-10">💖 Gợi ý nổi bật</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {providers.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="rounded-2xl shadow-xl overflow-hidden">
              <div className="relative">
                <img
                  src={p.avatar}
                  alt={p.fullName}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow">
                  <Heart size={16} className="text-red-500" />
                  <span className="text-sm font-semibold">{p.likes}</span>
                </div>
              </div>

              <CardContent className="text-center p-6">
                <h3 className="text-xl font-semibold">{p.fullName}</h3>
                <p className="text-gray-600 mb-3">{p.city}</p>

                <p className="text-gray-700 mb-3">Năm sinh: {p.yearOfBirth}</p>
                <p className="text-gray-700 mb-4">Giới tính: {p.gender}</p>

                <p className="font-bold text-lg text-gray-800 mb-4">
                  {p.pricePerHour}K / giờ
                </p>

                <Button className="rounded-full">Xem hồ sơ</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}