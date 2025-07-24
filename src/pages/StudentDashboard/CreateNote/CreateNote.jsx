import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useAxios from "../../../hooks/useAxios";

const CreateNote = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
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
      const { data } = await axiosInstance.post("/api/student-notes", noteData);
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
    <div className="container mx-auto lg:px-4 py-8 max-w-3xl">
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h1 className="card-title text-2xl md:text-3xl mb-8">
            Create New Note
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Email Field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base">Your Email</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="input input-bordered w-full"
                  readOnly
                />
              </div>

              {/* Title Field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base">Note Title*</span>
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter note title"
                  className="input input-bordered w-full"
                />
                {errors.title && (
                  <span className="label-text-alt text-error mt-1">
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Description Field */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-base">Description*</span>
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  placeholder="Write your detailed note here..."
                  className="textarea textarea-bordered w-full h-40"
                />
                {errors.description && (
                  <span className="label-text-alt text-error mt-1">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary px-8"
                disabled={createNote.isLoading}
              >
                {createNote.isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
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
