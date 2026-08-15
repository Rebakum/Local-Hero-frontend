import React, { useEffect, useState } from "react";
import { Trash2, Edit3, Plus, Loader2 } from "lucide-react";
import { BeforeAfterPair } from "@/src/types";
import { deleteBeforeAfterProject, getBeforeAfterProjects } from "@/src/services/api";
import { DataTable } from "../../../../Components/ui/DataTable";

export const AdminBeforeAfterManager: React.FC = () => {
  const [projects, setProjects] = useState<BeforeAfterPair[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProjects = () => {
    setLoading(true);
    getBeforeAfterProjects({ limit: 500 })
      .then((res) => setProjects(res.projects || []))
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Manage Before/After Projects
          </h2>
          <p className="text-sm text-slate-500">View and manage all showcase items</p>
        </div>
        <button
          onClick={() => alert("Open Add Modal")}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      <DataTable<BeforeAfterPair>
        isLoading={loading}
        loadingText="Loading projects..."
        data={projects}
        rowKey={(p) => p.id}
        searchable
        searchPlaceholder="Search projects..."
        searchKeys={(p) => [p.title, p.trade ?? '']}
        sortable
        emptyTitle="No projects found"
        emptyDescription="Add your first before & after project."
        columns={[
          {
            key: 'preview',
            header: 'Preview',
            render: (p) => (
              <div className="flex gap-2">
                <img src={p.beforeImage} alt="Before" className="w-10 h-10 object-cover rounded" title="Before" />
                <img src={p.afterImage} alt="After" className="w-10 h-10 object-cover rounded" title="After" />
              </div>
            ),
          },
          {
            key: 'title',
            header: 'Title',
            sortValue: (p) => p.title,
            render: (p) => <span className="font-medium text-slate-800 dark:text-white">{p.title}</span>,
          },
          {
            key: 'trade',
            header: 'Category/Trade',
            sortValue: (p) => p.trade ?? '',
            render: (p) => p.trade || "N/A",
          },
        ]}
        actions={(p) => (
          <>
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
          </>
        )}
      />
    </div>
  );
};
