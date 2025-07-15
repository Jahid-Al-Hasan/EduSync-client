import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";
import { Edit, Trash2, Check, X, NotebookText } from "lucide-react";

const ManageNotes = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "" });

  // Fetch user's notes
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["user-notes", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/api/student-notes?email=${user?.email}`
      );
      return data;
    },
  });

  // Delete note mutation
  const deleteNote = useMutation({
    mutationFn: async (noteId) => {
      const { data } = await axiosSecure.delete(`/api/student-notes/${noteId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-notes"]);
      Swal.fire("Deleted!", "Your note has been deleted.", "success");
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      Swal.fire("Error!", "Failed to delete note.", "error");
    },
  });

  // Update note mutation
  const updateNote = useMutation({
    mutationFn: async ({ id, updatedNote }) => {
      const { data } = await axiosSecure.patch(
        `/api/student-notes/${id}`,
        updatedNote
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-notes"]);
      Swal.fire("Updated!", "Your note has been updated.", "success");
      setEditingId(null);
    },
    onError: (error) => {
      console.error("Error updating note:", error);
      Swal.fire("Error!", "Failed to update note.", "error");
    },
  });

  const handleDelete = (noteId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNote.mutate(noteId);
      }
    });
  };

  const startEditing = (note) => {
    setEditingId(note._id);
    setEditForm({
      title: note.title,
      description: note.description,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitUpdate = (noteId) => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      Swal.fire("Error!", "Title and description cannot be empty", "error");
      return;
    }
    updateNote.mutate({ id: noteId, updatedNote: editForm });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your notes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-6">
            <NotebookText className="w-8 h-8" />
            <h1 className="card-title text-2xl md:text-3xl">
              Manage Your Notes
            </h1>
          </div>

          {notes.length === 0 ? (
            <div className="text-center py-8">
              <p>You haven't created any notes yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note._id} className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    {editingId === note._id ? (
                      <>
                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          className="input input-bordered mb-2 w-full"
                          placeholder="Note title"
                        />
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          className="textarea textarea-bordered w-full h-32"
                          placeholder="Note content"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => submitUpdate(note._id)}
                            disabled={updateNote.isLoading}
                          >
                            {updateNote.isLoading ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Save
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={cancelEditing}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2 className="card-title text-lg">{note.title}</h2>
                        <p className="whitespace-pre-line text-gray-700">
                          {note.description}
                        </p>
                        <div className="flex justify-end gap-2 mt-3">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => startEditing(note)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            className="btn btn-error btn-sm"
                            onClick={() => handleDelete(note._id)}
                            disabled={deleteNote.isLoading}
                          >
                            {deleteNote.isLoading ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageNotes;
