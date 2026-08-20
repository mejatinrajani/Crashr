import PartyCard from '../components/PartyCard';

export default function Home() {
  // Mock data - eventually fetched from FastAPI
  const parties = [
    { id: 1, title: "Midnight Rooftop Chill", host: "Alex", time: "Tonight, 10:00 PM", location: "Downtown Heights", price: "$15" },
    { id: 2, title: "Neon Basement Rave", host: "Sam", time: "Friday, 11:30 PM", location: "Westside Warehouse", price: "$25" },
    { id: 3, title: "Sunday Sunset Acoustic", host: "Maya", time: "Sunday, 5:00 PM", location: "Lakeview Terrace", price: "$10" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
      <header className="mb-12 mt-8">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
          Find your <span className="text-[#10B981]">vibe.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Discover exclusive, vetted house parties happening around you tonight.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {parties.map((party) => (
          <PartyCard key={party.id} party={party} />
        ))}
      </div>
    </div>
  );
}