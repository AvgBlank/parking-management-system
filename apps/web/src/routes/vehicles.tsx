import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Car, Plus, Trash2 } from "lucide-react";
import { vehicleApi } from "../lib/api";
import type { Vehicle } from "../lib/api";

export const Route = createFileRoute("/vehicles")({
  component: VehiclesComponent,
});

function VehiclesComponent() {
  const [vehicles, setVehicles] = React.useState<Array<Vehicle>>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [licencePlate, setLicencePlate] = React.useState("");
  const [model, setModel] = React.useState("");
  const [registering, setRegistering] = React.useState(false);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await vehicleApi.getVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVehicles();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licencePlate.trim()) return;

    try {
      setRegistering(true);
      await vehicleApi.registerVehicle({ licencePlate, model });
      setLicencePlate("");
      setModel("");
      await fetchVehicles(); // Refresh list
    } catch (err: any) {
      alert(err.message || "Failed to register vehicle");
    } finally {
      setRegistering(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await vehicleApi.deleteVehicle(id);
      await fetchVehicles(); // Refresh list
    } catch (err: any) {
      alert(err.message || "Failed to delete vehicle");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          My Vehicles
        </h1>
        <p className="text-gray-500 max-w-2xl">
          Manage your registered vehicles. You can add new ones for automated
          parking access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Register Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Car className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Add Vehicle
              </h2>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Licence Plate *
                </label>
                <input
                  type="text"
                  required
                  value={licencePlate}
                  onChange={(e) => setLicencePlate(e.target.value)}
                  placeholder="e.g. ABC-1234"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Model (Optional)
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Tesla Model 3"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={registering}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {registering ? (
                  "Registering..."
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add Vehicle
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Vehicles List */}
        <div className="md:col-span-2">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-white border border-gray-100 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center h-full">
              <div className="bg-gray-50 text-gray-400 p-4 rounded-full mb-4">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No vehicles found
              </h3>
              <p className="text-gray-500 text-sm max-w-sm">
                You haven't registered any vehicles yet. Add your first one
                using the form.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div
                  key={v.id}
                  className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md font-mono text-sm tracking-wide inline-block border border-gray-200">
                        {v.licencePlate}
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        {v.model || "Unknown Model"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(v.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400 justify-between">
                    <span>ID: {v.id.substring(0, 8)}...</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
