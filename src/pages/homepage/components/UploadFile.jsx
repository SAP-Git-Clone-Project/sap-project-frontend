import React from 'react'
import { Upload } from 'lucide-react'
import notify from "@/components/toaster/notify";
import Animate from "@/components/animation/Animate";

const UploadFile = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      <Animate variant="fade-right">
        <div className="card bg-base-200 p-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">File Upload</h2>
          <div className="border-2 border-dashed border-base-300 hover:border-primary/50 rounded-xl p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload size={20} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-base-content">Drop files or <span className="text-primary underline">browse</span></p>
              <p className="text-xs text-base-content/50 mt-1">.zip · .tar.gz · .json — max 50 MB</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => notify.loading("Uploading...")}>Select Files</button>
          </div>
        </div>
      </Animate>

     
    </div>
  )
}

export default UploadFile