import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Type,
  AlignLeft,
  Save,
  X,
  Loader2,
} from "lucide-react";

import Animate from "@/components/animation/Animate.jsx";
import api from "@/components/api/api.js";

export default function CreateDocumentPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

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

  function validateForm() {
    const newErrors = {};
    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      newErrors.title = "Title is required.";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("access");

      const response = await api.post("/documents/", {
        title: formData.title.trim(),
      });

      const data = response.data;

      navigate("/documents/" + data.id);
    } catch (err) {
      console.error(err);
      if (err.response) {
        console.log("BACKEND ERROR:", err.response.data);
        setErrors(err.response.data);
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/documents" className="btn btn-sm btn-ghost">
            <ArrowLeft size={16} />
            Back to Documents
          </Link>
        </div>

        {/* Hero */}
        <Animate>
          <div className="hero rounded-3xl border bg-base-200">
            <div className="hero-content">
              <div>
                <h1 className="text-3xl font-bold">Create Document</h1>
                <p className="text-base-content/70">
                  Create a new document. You can add versions later.
                </p>
              </div>
            </div>
          </div>
        </Animate>

        {/* Form */}
        <Animate>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card bg-base-200 border">
              <div className="card-body space-y-4">
                <h2 className="card-title">Document Details</h2>

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
                    <span className="text-error text-sm">
                      {errors.title}
                    </span>
                  )}
                </div>

                {errors.form && (
                  <div className="alert alert-error">
                    <span>{errors.form}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Link to="/documents" className="btn btn-ghost">
                <X size={16} />
                Cancel
              </Link>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Create Document
                  </>
                )}
              </button>
            </div>
          </form>
        </Animate>
      </div>
    </section>
  );
}