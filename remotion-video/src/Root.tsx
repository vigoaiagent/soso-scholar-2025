import { Composition } from "remotion";
import { SoSoScholarVideo } from "./SoSoScholar/Composition";
import scholarsData from "./data/scholars_data.json";

export const RemotionRoot: React.FC = () => {
  const scholars = scholarsData.scholars;
  const totalPrize = scholars.reduce((sum, s) => {
    const prize = parseInt(String(s.prize).replace(/[$,]/g, "") || "0");
    return sum + prize;
  }, 0);

  const fps = 30;
  const sceneDuration = 4 * fps; // 4 秒每场景

  // 每页最多显示 5 人
  const maxPerPage = 5;

  // 计算每个 tier 需要的页数
  const tierCounts = [1, 2, 3, 4].map((tier) => {
    const count = scholars.filter((s) => s.tier === tier).length;
    return Math.ceil(count / maxPerPage);
  });

  // 总页数 = 1 (汇总页) + 各 tier 的页数
  const totalPages = 1 + tierCounts.reduce((a, b) => a + b, 0);
  const totalDuration = totalPages * sceneDuration;

  return (
    <>
      <Composition
        id="SoSoScholarShowcase"
        component={SoSoScholarVideo}
        durationInFrames={totalDuration}
        fps={fps}
        width={1200}
        height={675}
        defaultProps={{
          scholars,
          totalPrize,
          sceneDuration,
          maxPerPage,
        }}
      />
    </>
  );
};
