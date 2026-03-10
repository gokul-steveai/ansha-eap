export default function HalaxyBookingIframe({link}:{link:string}) {

  return (
    <div className="flex-1 h-full overflow-hidden rounded-lg">
      <iframe
        src={link}
        allow="payment"
        style={{ border: 0, width: "100%", height: "100%" }}
        title="Halaxy booking widget"
        loading="lazy"
      />
    </div>
  );
}
