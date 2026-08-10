import React, { useEffect, useState } from "react";
import { Trash2, Edit3, Plus, Loader2 } from "lucide-react";
import { BeforeAfterPair } from "@/src/types";
import { deleteBeforeAfterProject, getBeforeAfterProjects } from "@/src/services/api";

export const AdminBeforeAfterManager: React.FC = () => {
  const [projects, setProjects] = useState<BeforeAfterPair[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProjects = () => {
    setLoading(true);
    getBeforeAfterProjects({ limit: 10 })
      .then((res) => setProjects(res.projects || [])) // Fixed Syntax Error (removed extra semicolon)
      .catch((err: any) => alert(err?.message || "Failed to fetch projects"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transformation project?")) {
      try {
        await deleteBeforeAfterProject(id);
        alert("Deleted successfully!");
        fetchProjects(); // Reload list after successful deletion
      } catch (err: any) {
        alert(err?.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Manage Before/After Projects
          </h2>
          <p className="text-sm text-slate-500">View and manage all showcase items</p>
        </div>
        <button
          onClick={() => alert("Open Add Modal")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          No projects found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold uppercase text-xs">
              <tr>
                <th className="p-3">Preview</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category/Trade</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50">
                  <td className="p-3">
                    <div className="flex gap-2">
                      <img
                        src={p.beforeImage}
                        alt="Before"
                        className="w-10 h-10 object-cover rounded"
                        title="Before"
                      />
                      <img
                        src={p.afterImage}
                        alt="After"
                        className="w-10 h-10 object-cover rounded"
                        title="After"
                      />
                    </div>
                  </td>
                  <td className="p-3 font-medium text-slate-800 dark:text-white">{p.title}</td>
                  <td className="p-3">{p.trade || "N/A"}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => alert(`Edit ID: ${p.id}`)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded transition"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};