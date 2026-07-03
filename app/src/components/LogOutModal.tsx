interface LogOutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoggingOut: boolean;
}

export default function LogOutModal({ isOpen, onClose, onConfirm, isLoggingOut }: LogOutModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="fixed top-24 right-6 bg-[#0A0514] border border-white/10 rounded-xl p-6 w-80 shadow-2xl animate-in slide-in-from-right-5 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-white mb-2">Logout?</h3>
                <p className="text-slate-400 text-sm mb-6">Are you sure you want to log out?</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoggingOut}
                        className="flex-1 py-2 px-4 cursor-pointer rounded-lg bg-[#060010] border border-white/10 text-slate-300 text-sm hover:border-white/20 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoggingOut}
                        className="flex-1 py-2 px-4 cursor-pointer rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm hover:bg-red-500/20 hover:border-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoggingOut ? 'Logging out...' : 'LogOut'}
                    </button>
                </div>
            </div>
        </div>
    );
}
