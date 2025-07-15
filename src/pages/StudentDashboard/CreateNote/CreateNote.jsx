import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const CreateNote = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      title: "",
      description: "",
    },
  });

  // Mutation to create note
  const createNote = useMutation({
    mutationFn: async (noteData) => {
      const { data } = await axiosSecure.post("/api/student-notes", noteData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-notes"]);
      Swal.fire("Success!", "Your note has been created.", "success");
      reset();
      navigate("/dashboard/all-notes");
    },
    onError: (error) => {
      console.error("Error creating note:", error);
      Swal.fire("Error!", "Failed to create note.", "error");
    },
  });

  const onSubmit = (data) => {
    createNote.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-2xl md:text-3xl mb-6">
            Create New Note
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                {...register("email")}
                className="input input-bordered"
                readOnly
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Title*</span>
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                placeholder="Note title"
                className="input input-bordered"
              />
              {errors.title && (
                <span className="text-error text-sm">
                  {errors.title.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description*</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Write your note here..."
                className="textarea textarea-bordered h-32"
              />
              {errors.description && (
                <span className="text-error text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createNote.isLoading}
              >
                {createNote.isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Create Note"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
