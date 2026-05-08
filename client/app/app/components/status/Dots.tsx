export default function Dots() {
  const styleBase = "size-[5px] bg-gray-line rounded-[3px]";
  return (
    <div className="flex gap-[6px] ">
      <div className={`${styleBase} dot-1-animate`}></div>
      <div className={`${styleBase} dot-2-animate`}></div>
      <div className={`${styleBase} dot-3-animate`}></div>
    </div>
  );
}
