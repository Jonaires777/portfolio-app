import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";

const SiderLogo = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();

  return (
    <div
      className="flex items-center justify-center gap-2 h-16 px-2 cursor-pointer border-b border-white/10"
      onClick={() => navigate("/")}
    >
      <img src="/pngegg.png" alt="Insight Hub" className="w-8 h-8" />
      {width >= 768 && (
        <span className="text-white text-lg font-semibold whitespace-nowrap">
          Insight Hub
        </span>
      )}
    </div>
  );
};

export default SiderLogo;
