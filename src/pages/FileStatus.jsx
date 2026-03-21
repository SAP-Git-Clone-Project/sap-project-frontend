import React from "react";

const FileStatus = ({ status }) => {
  const colors = {
    approved: "#22C55E",
    pending: "#FBBF24",
    rejected: "#EF4444",
  };

  const spin = status.toLowerCase() === "pending" ? "animate-spin" : "";

  return (
    <span
      className={`inline-block w-3 h-3 rounded-full ${spin}`}
      style={{
        backgroundColor: colors[status.toLowerCase()] || "#888",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    />
  );
};

export default FileStatus;