export function normalizeStatus(status) {
  switch (status) {
    case "approved":
      return "APPROVED";
    case "pending_approval":
    case "pending":
      return "PENDING";
    case "draft":
      return "DRAFT";
    case "rejected":
      return "REJECTED";
    default:
      return "UNKNOWN";
  }
}

export function mapDocumentToUi(document) {
  return {
    id: document.id,
    title: document.title,
    description: document.description || "No description available yet.",
    createdBy: document.created_by,
    createdByUsername: document.created_by_username || "Unknown user",
    createdAt: document.created_at,
    updatedAt: document.updated_at,
  };
}

export function mapVersionToUi(version) {
  return {
    id: version.id,
    documentId: version.document,
    versionNumber: version.version_number,
    content: version.content,
    status: normalizeStatus(version.status),
    parentVersionId: version.parent_version,
    createdAt: version.created_at,
    isActive: version.is_active,
    filePath: version.file_path,
    fileSize: version.file_size,
    checksum: version.checksum,
    summary:
      version.summary ||
      (version.content
        ? version.content.slice(0, 80) + (version.content.length > 80 ? "..." : "")
        : "No summary available."),
    authorName: version.creator_name || "Unknown user",
  };
}