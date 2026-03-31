import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  GitBranchPlus,
  FileText,
  AlignLeft,
  Upload,
  Save,
  X,
  History,
} from "lucide-react";
import { getDocumentById, getActiveVersionByDocumentId } from "@/data/mockData";

import Animate from "@/components/animation/Animate.jsx";

export default function CreateVersionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const numericId = Number(id);
  const document = getDocumentById(numericId);
  const activeVersion = getActiveVersionByDocumentId(numericId);

  const [formData, setFormData] = useState({
    versionLabel: "",
    summary: "",
    content: "",
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
    const trimmedVersionLabel = formData.versionLabel.trim();
    const trimmedSummary = formData.summary.trim();
    const trimmedContent = formData.content.trim();

    if (!trimmedVersionLabel) {
      newErrors.versionLabel = "Version label is required.";
    } else if (!/^v\d+$/i.test(trimmedVersionLabel)) {
      newErrors.versionLabel =
        "Version label must be in format like v1, v2, v10.";
    }

    if (!trimmedSummary) {
      newErrors.summary = "Change summary is required.";
    } else if (trimmedSummary.length < 10) {
      newErrors.summary = "Change summary must be at least 10 characters.";
    }

    if (!trimmedContent && !selectedFile) {
      newErrors.form =
        "Please provide either version content or an attachment.";
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

    console.log("Create version payload:", {
      documentId: numericId,
      parentVersionId: activeVersion?.id || null,
      versionLabel: formData.versionLabel.trim(),
      summary: formData.summary.trim(),
      content: formData.content.trim(),
      file: selectedFile,
    });

    navigate(`/documents/${numericId}`);
  }

  if (!document) {
    return (
      <section className="px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body items-center text-center">
              <h1 className="text-2xl font-bold">Document not found</h1>
              <p className="text-base-content/70">
                Cannot create a version because this document does not exist in
                the current mock data.
              </p>
              <Link to="/documents" className="btn btn-primary mt-2">
                Back to Documents
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/documents/${numericId}`}
            className="btn btn-sm btn-ghost border border-base-300 hover:white hover:text-white transition w-fit"
          >
            <ArrowLeft size={16} />
            Back to Details
          </Link>
        </div>


{/* Create Version */}
<Animate variant="fade-down">
        <div className="hero rounded-3xl border border-base-300 bg-base-200">
          <div className="hero-content w-full flex-col items-start justify-between gap-6 py-8 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <GitBranchPlus size={16} />
                <span>Version Management</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Create Version
              </h1>

              <p className="max-w-3xl text-base-content/70">
                Create a new version for{" "}
                <span className="font-medium">{document.title}</span> based on
                the current active version.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-white bg-primary shadow-md shadow-primary/30 border border-primary">
                  <FileText size={14} />
                  Active{" "}
                  {activeVersion ? `v${activeVersion.versionNumber}` : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
</Animate>

<Animate>
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body gap-5">
              <div>
                <h2 className="card-title text-xl">Version Information</h2>
                <p className="text-sm text-base-content/70">
                  Define the new version label and add a short summary of the
                  changes.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2 font-medium">
                      <History size={16} />
                      Based On
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={
                      activeVersion ? `v${activeVersion.versionNumber}` : ""
                    }
                    disabled
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2 font-medium">
                      <GitBranchPlus size={16} />
                      New Version Label
                    </span>
                  </label>
                  <input
                    type="text"
                    name="versionLabel"
                    placeholder="e.g. v4"
                    className={`input input-bordered w-full ${
                      errors.versionLabel ? "input-error" : ""
                    }`}
                    value={formData.versionLabel}
                    onChange={handleChange}
                  />
                  {errors.versionLabel && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.versionLabel}
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text flex items-center gap-2 font-medium">
                    <AlignLeft size={16} />
                    Change Summary
                  </span>
                </label>
                <textarea
                  name="summary"
                  placeholder="Describe what changed in this version"
                  className={`textarea textarea-bordered min-h-28 w-full ${
                    errors.summary ? "textarea-error" : ""
                  }`}
                  value={formData.summary}
                  onChange={handleChange}
                />
                {errors.summary && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.summary}
                    </span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="card border border-base-300 bg-base-200 shadow-sm">
            <div className="card-body gap-5">
              <div>
                <h2 className="card-title text-xl">Version Content</h2>
                <p className="text-sm text-base-content/70">
                  Update the content for the new version or attach a revised
                  file.
                </p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Content</span>
                </label>
                <textarea
                  name="content"
                  placeholder="Write the updated content for this version..."
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
                  the document details page until backend integration is ready.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              to={`/documents/${numericId}`}
              className="btn btn-ghost gap-2"
            >
              <X size={16} />
              Cancel
            </Link>

            <button type="submit" className="btn btn-primary gap-2">
              <Save size={16} />
              Create Version
            </button>
          </div>
        </form>
        </Animate>
      </div>
    </section>
  );
}
