import { useMemo } from "react";
import { ExternalLink, FileText, Minus, Plus, AlertCircle } from "lucide-react";
import useTheme from "@/hooks/useTheme";

const DiffViewer = ({ diffData, rawContent }) => {
  const { theme } = useTheme();

  const { lines, additions, deletions } = useMemo(() => {
    if (!diffData) return { lines: [], additions: 0, deletions: 0 };

    let diffLines = diffData.diff || [];
    if (
      diffData.has_parent === false &&
      diffLines.length === 0 &&
      diffData.new_content
    ) {
      diffLines = diffData.new_content
        .split("\n")
        .map((v) => ({ type: "insert", value: v }));
    }

    let oNum = 0;
    let nNum = 0;
    let adds = 0;
    let dels = 0;
    const numbered = diffLines.map((entry) => {
      let o = "";
      let n = "";
      if (entry.type === "equal") {
        oNum++;
        nNum++;
        o = oNum;
        n = nNum;
      } else if (entry.type === "delete") {
        oNum++;
        dels++;
        o = oNum;
      } else if (entry.type === "insert") {
        nNum++;
        adds++;
        n = nNum;
      }
      return { ...entry, o, n };
    });
    return { lines: numbered, additions: adds, deletions: dels };
  }, [diffData]);

  if (!diffData && !rawContent) return null;

  // 1. Check for .txt support only
  const isTxtFile = (filename) => filename?.toLowerCase().endsWith('.txt');
  const oldIsTxt = diffData?.old_filename ? isTxtFile(diffData.old_filename) : true;
  const newIsTxt = diffData?.new_filename ? isTxtFile(diffData.new_filename) : true;

  if (diffData && (!oldIsTxt || !newIsTxt)) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-base-content/40 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl bg-base-200/5">
        <AlertCircle size={36} className="text-warning opacity-60" />
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-tight">Format Not Supported</p>
          <p className="text-[11px] mt-1 opacity-70">Diffs can only be shown for .txt files.</p>
        </div>
      </div>
    );
  }

  if (diffData?.can_compare === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[160px] text-base-content/30 gap-4 border-2 border-dashed border-base-content/10 rounded-2xl">
        <FileText size={36} className="opacity-40" />
        <p className="text-xs max-w-xs text-center font-semibold leading-relaxed">
          {diffData.message}
        </p>
        {diffData.file_url && (
          <a
            href={diffData.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm bg-primary gap-2 hover:bg-primary/60 text-white rounded-xl text-[10px] uppercase tracking-widest font-black"
          >
            <ExternalLink size={12} /> View File
          </a>
        )}
      </div>
    );
  }

  const hasStats = lines.length > 0;

  if (!diffData && rawContent) {
    const rawLines = rawContent.split("\n");
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="overflow-y-auto overflow-x-hidden flex-1 rounded-xl border border-base-300/20 bg-base-950/40 shadow-inner custom-scrollbar">
          <div className="font-mono text-[12px] leading-6 w-full">
            {rawLines.map((line, i) => (
              <div
                key={i}
                className="flex items-start hover:bg-primary/5 transition-colors border-b border-base-300/5 last:border-0"
              >
                <span className="sticky left-0 w-12 shrink-0 text-right pr-3 py-0.5 text-base-content/25 select-none border-r border-base-300/15 bg-base-950/80 font-bold text-[11px] self-start pt-[3px]">
                  {i + 1}
                </span>
                <span className="whitespace-pre-wrap break-all py-0.5 px-4 text-base-content/75 min-w-0 flex-1">
                  {line || "\u00A0"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* 2. Version Comparison Info Div */}
      <div className="flex flex-wrap items-center gap-3 mb-3 p-2 bg-base-950/20 rounded-lg border border-base-300/10 text-[10px] font-bold uppercase tracking-tight">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-error/20 text-error border border-error/20">OLD / SELECTED</span>
          <span className="text-base-content/40 truncate max-w-[150px]">
            {diffData?.old_filename || "Original"} ({diffData?.old_filename?.split('.').pop() || 'N/A'})
          </span>
        </div>
        <div className="text-base-content/20">vs</div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-success/20 text-success border border-success/20">NEW / CURRENT</span>
          <span className="text-base-content/40 truncate max-w-[150px]">
            {diffData?.new_filename || "Current"} ({diffData?.new_filename?.split('.').pop() || 'N/A'})
          </span>
        </div>
      </div>

      {hasStats && (
        <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest shrink-0 pb-2.5 mb-2.5 border-b border-base-300/20">
          <span className="flex items-center gap-1.5 text-success">
            <Plus size={11} />
            {additions} Addition{additions !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5 text-error">
            <Minus size={11} />
            {deletions} Deletion{deletions !== 1 ? "s" : ""}
          </span>
          <span className="ml-auto text-base-content/20">
            {lines.length} line{lines.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="overflow-y-auto overflow-x-hidden flex-1 rounded-xl border border-base-300/20 bg-base-950/40 shadow-inner custom-scrollbar">
        <div className="font-mono text-[12px] leading-6 w-full">
          {lines.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-base-content/20 text-[10px] font-black uppercase tracking-widest">
              No Differences Found
            </div>
          ) : (
            lines.map((entry, i) => {
              const isDel = entry.type === "delete";
              const isIns = entry.type === "insert";

              const rowBg = isDel
                ? "bg-error/15 hover:bg-error/20"
                : isIns
                  ? "bg-success/15 hover:bg-success/20"
                  : "hover:bg-base-content/5";

              const gutterBg = isDel
                ? (theme === "light" ? "bg-error/10" : "bg-error/20")
                : isIns
                  ? "bg-success/20"
                  : "bg-base-200/60";

              const prefix = isDel ? "−" : isIns ? "+" : " ";
              const prefixClr = isDel
                ? "text-red-400"
                : isIns
                  ? "text-success"
                  : "text-transparent";
              const numClr = isDel
                ? (theme === "light" ? "text-red-900" : "text-red-200")
                : isIns
                  ? "text-success/60"
                  : "text-base-content/30";

              return (
                <div
                  key={i}
                  className={`flex items-start transition-colors border-b border-base-content/5 last:border-0 ${rowBg}`}
                >
                  <div className={`sticky left-0 flex shrink-0 select-none border-r border-base-content/10 z-10 ${gutterBg} ${numClr}`}>
                    <span className="w-10 text-right pr-2 py-0.5 text-[10px] font-bold self-start pt-[4px]">
                      {entry.o}
                    </span>
                    <span className="w-10 text-right pr-2 py-0.5 text-[10px] font-bold self-start pt-[4px]">
                      {entry.n}
                    </span>
                  </div>
                  <span className={`w-5 shrink-0 text-center py-0.5 select-none font-black self-start pt-[3px] ${prefixClr}`}>
                    {prefix}
                  </span>
                  <span className="whitespace-pre-wrap break-all py-0.5 pl-2 pr-4 text-base-content/80 min-w-0 flex-1">
                    {entry.value || "\u00A0"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DiffViewer;