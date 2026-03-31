import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Type,
  AlignLeft,
  Upload,
  Save,
  X,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";

export default function CreateDocumentPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      form: "",
    }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    setErrors((prev) => ({
      ...prev,
      file: "",
      form: "",
    }));
  }

  function validateForm() {
    const newErrors = {};
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const trimmedContent = formData.content.trim();

    if (!trimmedTitle) {
      newErrors.title = "Title is required.";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!trimmedDescription) {
      newErrors.description = "Description is required.";
    } else if (trimmedDescription.length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    if (!trimmedContent && !selectedFile) {
      newErrors.form =
        "Please provide either document content or an attachment.";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Create document payload:", {
      title: formData.title.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      content: formData.content.trim(),
      file: selectedFile,
    });

    navigate("/documents");
  }

  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link to="/documents"  className="btn btn-sm btn-ghost border border-base-300 hover:white hover:text-white transition w-fit">
            <ArrowLeft size={16} />
            Back to Documents
          </Link>
        </div>


{/* Create Document */}
<Animate variant="fade-down">
        <div className="hero rounded-3xl border border-base-300 bg-base-200">
          <div className="hero-content w-full flex-col items-start justify-between gap-6 py-8 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <FileText size={16} />
                <span>Document Management</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Create Document
              </h1>

              <p className="max-w-2xl text-base-content/70">
                Create a new document record and prepare its initial content for
                future version tracking and review.
              </p>
            </div>
          </div>
        </div>
</Animate>

<Animate>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body gap-5">
              <div>
                <h2 className="card-title text-xl">Document Information</h2>
                <p className="text-sm text-base-content/70">
                  Fill in the main details for the new document.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2 font-medium">
                      <Type size={16} />
                      Title
                    </span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter document title"
                    className={`input input-bordered w-full ${
                      errors.title ? "input-error" : ""
                    }`}
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {errors.title && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.title}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2 font-medium">
                      <FileText size={16} />
                      Category
                    </span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Policy, Handbook, Agreement"
                    className="input input-bordered w-full"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2 font-medium">
                    <AlignLeft size={16} />
                    Description
                  </span>
                </label>
                <textarea
                  name="description"
                  placeholder="Write a short description for the document"
                  className={`textarea textarea-bordered min-h-28 w-full ${
                    errors.description ? "textarea-error" : ""
                  }`}
                  value={formData.description}
                  onChange={handleChange}
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.description}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body gap-5">
              <div>
                <h2 className="card-title text-xl">Initial Content</h2>
                <p className="text-sm text-base-content/70">
                  Add the initial document content or attach a file for the
                  first version.
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Content</span>
                </label>
                <textarea
                  name="content"
                  placeholder="Write the initial document content here..."
                  className="textarea textarea-bordered min-h-40 w-full"
                  value={formData.content}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2 font-medium">
                    <Upload size={16} />
                    Attachment
                  </span>
                </label>

                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={handleFileChange}
                />

                {selectedFile && (
                  <p className="mt-2 text-sm text-base-content/70">
                    Selected file:{" "}
                    <span className="font-medium">{selectedFile.name}</span>
                  </p>
                )}
              </div>

              {errors.form && (
                <div className="alert alert-error">
                  <span>{errors.form}</span>
                </div>
              )}

              <div className="alert border border-base-300 bg-base-100">
                <span className="text-sm text-base-content/70">
                  For now this page uses mock behavior. On submit it returns to
                  the documents list until backend integration is ready.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link to="/documents" className="btn btn-ghost gap-2">
              <X size={16} />
              Cancel
            </Link>

            <button type="submit" className="btn btn-primary gap-2">
              <Save size={16} />
              Create Document
            </button>
          </div>
        </form>
        </Animate>
      </div>
    </section>
  );
}
