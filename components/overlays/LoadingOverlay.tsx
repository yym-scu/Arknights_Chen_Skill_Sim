export default function LoadingOverlay() {
    return (
        <div className="absolute inset-0 bg-black/85 z-50 flex flex-col justify-center items-center backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-transparent border-t-[#ff3333] rounded-full animate-spin mb-4" />
            <div className="text-gray-300 text-xs animate-pulse">
                全图穷举演算中...
            </div>
        </div>
    );
}
