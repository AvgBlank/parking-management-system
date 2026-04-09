import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ShieldAlert, Trash2 } from "lucide-react";
import { adminApi } from "../lib/api";

export const Route = createFileRoute("/admin-tools")({
  component: AdminToolsComponent,
});

function AdminToolsComponent() {
  const [targetId, setTargetId] = React.useState("");
  const [resourceType, setResourceType] = React.useState<
    "floor" | "slot" | "parking-lot"
  >("floor");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim()) return;

    if (
      !confirm(
        `WARNING: You are about to permanently delete ${resourceType} with ID ${targetId}. Proceed?`,
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      if (resourceType === "floor") {
        await adminApi.deleteFloor(targetId);
      } else if (resourceType === "slot") {
        await adminApi.deleteSlot(targetId);
      } else {
        await adminApi.deleteParkingLot(targetId);
      }

      setMessage({
        type: "success",
        text: `Successfully deleted ${resourceType} ${targetId}`,
      });
      setTargetId("");
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to delete resource",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Area
          </h1>
          <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-100 rounded-full flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3" />
            Restricted
          </span>
        </div>
        <p className="text-gray-500 max-w-2xl">
          Core system management. Exercise caution: these actions are permanent
          and cannot be undone.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        <div className="bg-red-50/50 border-b border-red-100 p-6 flex gap-4 items-start">
          <div className="p-2 text-red-600 bg-red-100 rounded-full shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-900 mb-1">
              Delete System Resources
            </h2>
            <p className="text-red-700/80 text-sm">
              Manually drop Floor, Slot, or Parking Lot resources by ID. Ensure
              no overlapping dependencies exist before deletion.
            </p>
          </div>
        </div>

        <div className="p-6">
          {message && (
            <div
              className={`p-4 rounded-xl mb-6 text-sm font-medium ${message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"}`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleDelete} className="space-y-6 max-w-lg">
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">
                Select Resource Type
              </label>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {(["floor", "slot", "parking-lot"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setResourceType(type)}
                    className={`flex-1 text-sm font-medium py-2 rounded-lg capitalize transition-colors ${
                      resourceType === type
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {type.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Resource ID *
              </label>
              <input
                type="text"
                required
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all font-mono text-sm"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading || !targetId.trim()}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  "Processing..."
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" /> Force Delete
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
