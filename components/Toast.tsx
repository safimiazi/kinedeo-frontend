interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2d1a24] text-white px-7 py-3.5 rounded-full font-nunito font-semibold z-[200] whitespace-nowrap shadow-lg shadow-black/20 text-sm">
      {message}
    </div>
  );
}
