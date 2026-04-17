import { useMemo } from "react";
import { ExternalLink, FileText, Minus, Plus, AlertCircle } from "lucide-react";
import useTheme from "@/hooks/useTheme";

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1000 && i < units.length - 1) {
    size /= 1000;
    i++;
  }
  return `${size.toFixed(size >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
};

const getExt = (filename = "") =>
  filename.includes(".") ? filename.split(".").pop().toUpperCase() : "N/A";

const getSize = (size) => (typeof size === "number" ? size : 0);

const DiffViewer = ({ diffData, rawContent }) => {
  const { theme } = useTheme();

  const isInitialVersion = diffData?.has_parent === false;

  const { splitLines, additions, deletions, singleLines } = useMemo(() => {
    if (!diffData) return { splitLines: [], additions: 0, deletions: 0, singleLines: [] };

    if (diffData.has_parent === false) {
      const lines = (diffData.new_content || "").split("\n").map((v, i) => ({
        num: i + 1,
        value: v,
        type: "insert",
      }));

      return {
        singleLines: lines,
        splitLines: [],
        additions: lines.length,
        deletions: 0,
      };
    }

    let diffLines = diffData.diff || [];

    let oNum = 0;
    let nNum = 0;
    let adds = 0;
    let dels = 0;

    const pairs = [];
    let i = 0;

    while (i < diffLines.length) {
      const current = diffLines[i];

      if (current.type === "equal") {
        oNum++;
        nNum++;
        pairs.push({
          left: { ...current, num: oNum },
          right: { ...current, num: nNum },
        });
        i++;
      } else if (current.type === "delete") {
        dels++;
        oNum++;

        const next = diffLines[i + 1];
        if (next && next.type === "insert") {
          adds++;
          nNum++;
          pairs.push({
            left: { ...current, num: oNum },
            right: { ...next, num: nNum },
          });
          i += 2;
        } else {
          pairs.push({
            left: { ...current, num: oNum },
            right: { type: "empty" },
          });
          i++;
        }
      } else if (current.type === "insert") {
        adds++;
        nNum++;
        pairs.push({
          left: { type: "empty" },
          right: { ...current, num: nNum },
        });
        i++;
      }
    }

    return {
      splitLines: pairs,
      additions: adds,
      deletions: dels,
      singleLines: [],
    };
  }, [diffData]);

  if (!diffData && !rawContent) return null;

  const isTxtFile = (filename) =>
    filename?.toLowerCase().endsWith(".txt");

  const oldIsTxt = diffData?.old_filename
    ? isTxtFile(diffData.old_filename)
    : true;

  const newIsTxt = diffData?.new_filename
    ? isTxtFile(diffData.new_filename)
    : true;

  const showUnsupportedFormat = diffData && (!oldIsTxt || !newIsTxt);
  const showCannotCompare = diffData?.can_compare === false;

  const oldName = diffData?.old_filename || "Original";
  const newName = diffData?.new_filename || "Current";

  const DiffRow = ({ left, right }) => {
    const getBg = (type) => {
      if (type === "delete") return "bg-error/10";
      if (type === "insert") return "bg-success/10";
      if (type === "empty") return "bg-base-300/5";
      return "hover:bg-base-content/5";
    };

    return (
      <div className="flex border-b border-base-content/5 last:border-0 min-w-[800px]">
        <div className={`flex flex-1 border-r border-base-content/10 ${getBg(left.type)}`}>
          <div className="w-10 shrink-0 text-center select-none text-base-content/30 border-r border-base-content/5 bg-base-950/20 py-0.5">
            {left.num || ""}
          </div>
          <div className="w-6 shrink-0 text-center select-none opacity-50 py-0.5">
            {left.type === "delete" ? "-" : ""}
          </div>
          <div className="px-2 py-0.5 whitespace-pre-wrap break-all flex-1 text-base-content/80">
            {left.value || (left.type === "empty" ? "" : "\u00A0")}
          </div>
        </div>

        <div className={`flex flex-1 ${getBg(right.type)}`}>
          <div className="w-10 shrink-0 text-center select-none text-base-content/30 border-r border-base-content/5 bg-base-950/20 py-0.5">
            {right.num || ""}
          </div>
          <div className="w-6 shrink-0 text-center select-none opacity-50 py-0.5">
            {right.type === "insert" ? "+" : ""}
          </div>
          <div className="px-2 py-0.5 whitespace-pre-wrap break-all flex-1 text-base-content/80">
            {right.value || (right.type === "empty" ? "" : "\u00A0")}
          </div>
        </div>
      </div>
    );
  };

  const SingleRow = ({ line }) => (
    <div className="flex border-b border-base-content/5 bg-success/5">
      <div className="w-10 text-center text-base-content/30 border-r border-base-content/10">
        {line.num}
      </div>
      <div className="w-6 text-center text-success">+</div>
      <div className="px-2 flex-1 whitespace-pre-wrap break-all">
        {line.value}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 mb-3 p-2 bg-base-950/20 rounded-lg border border-base-300/10 text-[10px] font-bold uppercase tracking-tight">
        <div className="flex items-center gap-2 flex-1">
          <span className="px-1.5 py-0.5 rounded bg-error/20 text-error border border-error/20">OLD</span>
          <span className="text-base-content/40 normal-case text-sm">
            {oldName} <span className="text-base-content/40 text-xs font-black">({formatBytes(getSize(diffData?.old_size))})</span>
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <span className="px-1.5 py-0.5 rounded bg-success/20 text-success border border-success/20">NEW</span>
          <span className="text-base-content/40 normal-case text-sm">
            {newName} <span className="text-base-content/40 text-xs font-black">({formatBytes(getSize(diffData?.new_size))})</span>
          </span>
        </div>
      </div>

      {showUnsupportedFormat ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-base-content/40 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl bg-base-200/5">
          <AlertCircle size={36} className="text-warning opacity-60" />
          <p className="text-sm font-bold uppercase">Format Not Supported</p>
        </div>
      ) : showCannotCompare ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-base-content/30 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl">
          <FileText size={36} className="opacity-40" />
          <p className="text-xs text-center font-semibold">{diffData.message}</p>
          {diffData.file_url && (
            <a href={diffData.file_url} target="_blank" className="btn btn-sm bg-primary text-white text-[10px]">
              <ExternalLink size={12} /> View File
            </a>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest shrink-0 pb-2.5 mb-2.5 border-b border-base-300/20">
            <span className="flex items-center gap-1.5 text-success">
              <Plus size={11} /> {additions} Additions
            </span>
            <span className="flex items-center gap-1.5 text-error">
              <Minus size={11} /> {deletions} Deletions
            </span>
          </div>

          <div className="overflow-auto flex-1 rounded-xl border border-base-300/20 bg-base-950/40 shadow-inner custom-scrollbar">
            <div className="font-mono text-[12px] leading-6 w-full min-w-max">
              {isInitialVersion ? (
                singleLines.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-base-content/20 text-[10px] font-black uppercase tracking-widest">
                    No Content
                  </div>
                ) : (
                  singleLines.map((line) => (
                    <SingleRow key={line.num} line={line} />
                  ))
                )
              ) : splitLines.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-base-content/20 text-[10px] font-black uppercase tracking-widest">
                  No Differences Found
                </div>
              ) : (
                splitLines.map((pair, i) => (
                  <DiffRow key={i} left={pair.left} right={pair.right} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiffViewer;