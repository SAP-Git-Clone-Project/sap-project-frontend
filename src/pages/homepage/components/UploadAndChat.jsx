import React from 'react'
import { Upload } from 'lucide-react'
import notify from "@/components/toaster/notify";
import Animate from "@/components/animation/Animate";

const UploadAndChat = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      <Animate variant="fade-left">
        <div className="card bg-base-200 p-6">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Chat Bubbles</h2>
          <div className="flex flex-col gap-3">
            <div className="chat chat-start">
              <div className="chat-image avatar placeholder">
                <div className="w-8 rounded-full bg-purple text-white"><span className="text-xs font-bold">SM</span></div>
              </div>
              <div className="chat-bubble chat-bubble-primary text-sm">Can we merge dark mode today?</div>
              <div className="chat-footer text-xs text-base-content/50 mt-0.5">Stefan · 10:42 AM</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-image avatar placeholder">
                <div className="w-8 rounded-full bg-primary text-primary-content"><span className="text-xs font-bold">MP</span></div>
              </div>
              <div className="chat-bubble chat-bubble-success text-sm">CI is passing. I'll approve now.</div>
              <div className="chat-footer text-xs text-base-content/50 mt-0.5">Maria · 10:45 AM</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-image avatar placeholder">
                <div className="w-8 rounded-full bg-teal text-white"><span className="text-xs font-bold">AK</span></div>
              </div>
              <div className="chat-bubble text-sm">One more review comment first.</div>
              <div className="chat-footer text-xs text-base-content/50 mt-0.5">Amal · 10:48 AM</div>
            </div>
          </div>
        </div>
      </Animate>
    </div>
  )
}

export default UploadAndChat