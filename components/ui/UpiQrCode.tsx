"use client";

interface Props {
  upiId: string;
  amount: number;
  name?: string;
  note?: string;
  size?: number;
}

export default function UpiQrCode({ upiId, amount, name = "UPSCPrepNotes", note = "Ultimate Compilation", size = 220 }: Props) {
  const uri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&tn=${encodeURIComponent(note)}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(uri)}&margin=12`;

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={qrUrl}
        alt="UPI QR Code"
        width={size}
        height={size}
        className="rounded-xl border border-black/[0.06]"
        onError={(e) => {
          // fallback if QR API fails
          const el = e.currentTarget;
          el.style.display = "none";
          el.parentElement!.querySelector(".qr-fallback")?.classList.remove("hidden");
        }}
      />
      <div className="qr-fallback hidden text-center">
        <p className="text-xs text-gray-500 mb-1">Pay to this UPI ID:</p>
        <code className="text-sm font-bold text-gray-900">{upiId}</code>
      </div>
      <p className="text-[10px] text-gray-400 text-center leading-relaxed">
        Scan with GPay / PhonePe<br />or any UPI app
      </p>
    </div>
  );
}
