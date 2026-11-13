export default function SectionTitle({ eyebrow, title, align = 'center', light = false, as: Tag = 'h2' }) {
  const center = align === 'center';
  return (
    <div className={center ? 'text-center' : ''}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className={`font-display font-bold text-3xl leading-tight ${light ? 'text-white' : 'text-navy'}`}>{title}</Tag>
      <div className={`divider mt-4 ${center ? '' : '!justify-start'}`}>
        <span className="line"></span>
        <i className={`fa-solid fa-heart text-xs ${light ? 'text-silver-light' : 'text-leaf'}`}></i>
        <span className="line"></span>
      </div>
    </div>
  );
}
