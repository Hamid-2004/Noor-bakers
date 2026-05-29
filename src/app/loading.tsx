export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute h-full w-full animate-spin rounded-full border-4 border-[#0b2c5d]/20 border-t-[#0b2c5d]" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-[#0b2c5d]/10" />
      </div>
      <p className="mt-4 text-sm font-medium tracking-wider text-[#0b2c5d]/70 uppercase animate-pulse">
        Loading Noor Bakers...
      </p>
    </div>
  );
}
