import { useState } from 'react'
import { FiImage, FiFileText, FiUser, FiPlus } from 'react-icons/fi'

type AttachmentType = 'image' | 'document' | 'contact'

type AttachmentMenuProps = {
  onSelect?: (type: AttachmentType) => void
}

const options: { type: AttachmentType; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { type: 'image', label: 'Photo / Video', Icon: FiImage },
  { type: 'document', label: 'Document', Icon: FiFileText },
  { type: 'contact', label: 'Contact', Icon: FiUser },
]

function AttachmentMenu({ onSelect }: AttachmentMenuProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (type: AttachmentType) => {
    onSelect?.(type)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Add attachment"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#30363d] bg-[#161b22] text-[#e6edf3] shadow-sm shadow-black/30 transition hover:bg-[#21262d] active:translate-y-px sm:h-10 sm:w-10"
      >
        <FiPlus className="text-lg" />
      </button>

      {open && (
        <div className="absolute bottom-11 left-0 z-20 w-44 origin-bottom-left rounded-2xl border border-[#30363d] bg-[#161b22]/98 p-1.5 text-xs text-[#e6edf3] shadow-[0_18px_45px_rgba(1,4,9,0.9)] backdrop-blur-md attachment-menu">
          {options.map((opt, idx) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => handleSelect(opt.type)}
              className="attachment-option flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-[#21262d]"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0d1117] text-[#e6edf3] shadow-sm shadow-black/40">
                <opt.Icon className="text-[15px]" />
              </span>
              <span className="text-[11px] font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default AttachmentMenu


