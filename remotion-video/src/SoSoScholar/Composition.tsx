import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Img,
  staticFile,
  spring,
  useVideoConfig,
} from "remotion";

interface Scholar {
  id: number;
  name: string;
  tier: number;
  prize: string;
  avatar: string;
  awards?: string[];
}

interface Props {
  scholars: Scholar[];
  totalPrize: number;
  sceneDuration: number;
  maxPerPage: number;
}

const tierMeta: Record<number, { title: string; desc: string }> = {
  1: { title: "Excellence Tier", desc: "Setting the new standard of crypto intelligence" },
  2: { title: "Strategic Insights", desc: "Mastering market dynamics with precision" },
  3: { title: "Research Contributors", desc: "Exceptional depth and consistent quality" },
  4: { title: "Rising Stars", desc: "Emerging voices shaping the future of Web3" },
};

// 背景网格组件
const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const translateY = (frame % 240) * (80 / 240);

  return (
    <div
      style={{
        position: "absolute",
        inset: -400,
        backgroundImage: `
          linear-gradient(rgba(250, 204, 21, 0.28) 1.5px, transparent 1.5px),
          linear-gradient(90deg, rgba(250, 204, 21, 0.28) 1.5px, transparent 1.5px)
        `,
        backgroundSize: "80px 80px",
        transform: `perspective(350px) rotateX(65deg) translateY(${translateY}px)`,
        maskImage: "radial-gradient(ellipse at center, black 15%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 15%, transparent 85%)",
      }}
    />
  );
};

// 粒子组件
const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 20 }, (_, i) => {
    const startX = (i * 37) % 100;
    const duration = 300 + (i % 5) * 60;
    const progress = ((frame + i * 30) % duration) / duration;
    const y = 675 - progress * 750;
    const drift = Math.sin(i) * 150;
    const x = startX + (progress * drift) / 100;
    const opacity = progress < 0.2 ? progress * 2.5 : progress > 0.8 ? (1 - progress) * 2.5 : 0.5;
    const size = 1 + (i % 3);

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#FACC15",
          left: `${x}%`,
          top: y,
          opacity,
        }}
      />
    );
  });

  return <>{particles}</>;
};

// 数字滚动动画组件
const AnimatedNumber: React.FC<{
  value: string;
  color: string;
  sceneFrame: number;
}> = ({ value, color, sceneFrame }) => {
  const { fps } = useVideoConfig();

  const match = value.match(/^([^\d]*)(\d[\d,]*)([^\d]*)$/);
  const prefix = match?.[1] || "";
  const numStr = match?.[2] || value;
  const suffix = match?.[3] || "";
  const targetNum = parseInt(numStr.replace(/,/g, ""), 10);

  const progress = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 30, stiffness: 80, mass: 0.5 },
  });

  const currentNum = Math.round(targetNum * progress);
  const formattedNum = currentNum.toLocaleString();

  return (
    <div
      style={{
        fontSize: 48,
        fontWeight: 900,
        lineHeight: 1,
        marginBottom: 8,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}{formattedNum}{suffix}
    </div>
  );
};

// 数据卡片组件
const DataModule: React.FC<{
  value: string;
  label: string;
  color: string;
  sceneFrame: number;
}> = ({ value, label, color, sceneFrame }) => {
  const { fps } = useVideoConfig();

  const scaleSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.5 },
  });

  const opacity = interpolate(sceneFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        borderLeft: "3.5px solid #FACC15",
        padding: "22px 35px",
        backdropFilter: "blur(25px)",
        flex: 1,
        textAlign: "center",
        minWidth: 220,
        opacity,
        transform: `scale(${0.8 + scaleSpring * 0.2})`,
      }}
    >
      <AnimatedNumber value={value} color={color} sceneFrame={sceneFrame} />
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6b7280",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
};

// 头像组件 - 更大的尺寸
const AvatarItem: React.FC<{
  scholar: Scholar;
  index: number;
  total: number;
  sceneFrame: number;
}> = ({ scholar, index, total, sceneFrame }) => {
  const { fps } = useVideoConfig();

  const scaleSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.6 },
  });

  const opacity = interpolate(sceneFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 固定大尺寸，不再根据人数缩小
  const avatarSize = 120;
  const imgSize = 105;
  const fontSize = 14;

  const frame = useCurrentFrame();
  const angle = (frame * 6 + index * 45) % 360;

  const isRemoteUrl = scholar.avatar.startsWith("http://") || scholar.avatar.startsWith("https://");
  const avatarSrc = isRemoteUrl ? scholar.avatar : staticFile(scholar.avatar.replace("./", ""));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity,
        transform: `scale(${0.7 + scaleSpring * 0.3})`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: avatarSize,
          height: avatarSize,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 旋转光环 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: `conic-gradient(from ${angle}deg, transparent 5%, #FACC15, transparent 65%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: 3,
          }}
        />
        {/* 黑色底圈 */}
        <div
          style={{
            position: "absolute",
            inset: 7,
            backgroundColor: "black",
            borderRadius: "50%",
          }}
        />
        {/* 头像图片 */}
        <Img
          src={avatarSrc}
          style={{
            width: imgSize,
            height: imgSize,
            borderRadius: "50%",
            objectFit: "cover",
            position: "relative",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontSize,
            fontWeight: 700,
            color: "rgba(255,255,255,0.85)",
            display: "block",
          }}
        >
          @{scholar.name}
        </span>
        <span
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "#FACC15",
            display: "block",
            marginTop: 6,
          }}
        >
          {scholar.prize}
        </span>
        {scholar.awards && scholar.awards.length > 0 && (
          <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
            {scholar.awards.map((award, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: "#000",
                  backgroundColor: "#FACC15",
                  padding: "2px 6px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                }}
              >
                {award}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 汇总场景
const SummaryScene: React.FC<{
  scholars: Scholar[];
  totalPrize: number;
  sceneFrame: number;
}> = ({ scholars, totalPrize, sceneFrame }) => {
  const prizeDisplay = totalPrize >= 1000 ? `$${Math.round(totalPrize / 1000)}k` : `$${totalPrize}`;
  const stats = [
    { val: String(scholars.length), lab: "Winners", col: "#FACC15" },
    { val: prizeDisplay, lab: "Prize Pool", col: "#F97316" },
    { val: "4,279", lab: "Submissions", col: "#22D3EE" },
    { val: "15+", lab: "Regions", col: "#22D3EE" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 32,
        padding: "0 40px",
        width: "100%",
      }}
    >
      {stats.map((s, i) => (
        <DataModule
          key={i}
          value={s.val}
          label={s.lab}
          color={s.col}
          sceneFrame={sceneFrame}
        />
      ))}
    </div>
  );
};

// 获奖者场景
const WinnersScene: React.FC<{
  scholars: Scholar[];
  sceneFrame: number;
}> = ({ scholars, sceneFrame }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
        padding: "0 40px",
      }}
    >
      {scholars.map((s, i) => (
        <AvatarItem
          key={s.id}
          scholar={s}
          index={i}
          total={scholars.length}
          sceneFrame={sceneFrame}
        />
      ))}
    </div>
  );
};

// 生成所有页面的配置
function generatePages(scholars: Scholar[], maxPerPage: number) {
  const pages: Array<{
    type: "summary" | "winners";
    tier?: number;
    scholars?: Scholar[];
    pageInTier?: number;
    totalPagesInTier?: number;
  }> = [];

  // 第一页：汇总
  pages.push({ type: "summary" });

  // 按 tier 分页
  for (let tier = 1; tier <= 4; tier++) {
    const tierScholars = scholars.filter((s) => s.tier === tier);
    const totalPagesInTier = Math.ceil(tierScholars.length / maxPerPage);

    for (let pageIdx = 0; pageIdx < totalPagesInTier; pageIdx++) {
      const start = pageIdx * maxPerPage;
      const end = Math.min(start + maxPerPage, tierScholars.length);
      pages.push({
        type: "winners",
        tier,
        scholars: tierScholars.slice(start, end),
        pageInTier: pageIdx + 1,
        totalPagesInTier,
      });
    }
  }

  return pages;
}

export const SoSoScholarVideo: React.FC<Props> = ({
  scholars,
  totalPrize,
  sceneDuration,
  maxPerPage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pages = generatePages(scholars, maxPerPage);
  const currentPageIdx = Math.min(
    Math.floor(frame / sceneDuration),
    pages.length - 1
  );
  const sceneFrame = frame % sceneDuration;
  const currentPage = pages[currentPageIdx];

  // 获取当前页的 meta 信息
  const meta = currentPage.type === "summary"
    ? { title: "Season III Summary", desc: "Redefining crypto intelligence through data" }
    : tierMeta[currentPage.tier!];

  // 页码显示（如果一个 tier 有多页）
  const pageIndicator = currentPage.type === "winners" && currentPage.totalPagesInTier! > 1
    ? ` (${currentPage.pageInTier}/${currentPage.totalPagesInTier})`
    : "";

  const titleSpring = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at center, #151515 0%, #000 100%)",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <GridBackground />

      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 900,
          background: "radial-gradient(circle, rgba(250, 204, 21, 0.1) 0%, transparent 70%)",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(100px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle, transparent 40%, rgba(0,0,0,0.9) 100%)",
          pointerEvents: "none",
        }}
      />

      <Particles />

      {/* 顶部标题 */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          zIndex: 50,
          textAlign: "center",
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 20}px)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 12px",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 9999,
            background: "rgba(255,255,255,0.05)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#eab308",
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: "0.3em",
              color: "#d1d5db",
              textTransform: "uppercase",
            }}
          >
            SoSoScholar 2025 Winners
          </span>
        </div>

        <h1
          style={{
            fontSize: 80,
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            marginBottom: 10,
            background: "linear-gradient(to bottom, #FFFFFF 40%, #FACC15 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          #SoSoScholar 2025
        </h1>

        <p
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: "linear-gradient(to right, rgba(255,255,255,0.4) 0%, #fff 50%, rgba(255,255,255,0.4) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {meta.title}{pageIndicator}
        </p>
      </div>

      {/* 主内容区 */}
      <div
        style={{
          position: "absolute",
          top: 260,
          left: 80,
          right: 80,
          bottom: 140,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {currentPage.type === "summary" ? (
          <SummaryScene
            scholars={scholars}
            totalPrize={totalPrize}
            sceneFrame={sceneFrame}
          />
        ) : (
          <WinnersScene
            scholars={currentPage.scholars!}
            sceneFrame={sceneFrame}
          />
        )}
      </div>

      {/* 底部品牌 */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 80,
          right: 80,
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Img
            src={staticFile("sosovalue-logo.svg")}
            style={{
              height: 40,
              width: "auto",
              filter: "drop-shadow(0 0 15px rgba(250,204,21,0.3))",
            }}
          />
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#4b5563",
              letterSpacing: "0.4em",
              marginBottom: 4,
            }}
          >
            WWW.SOSOVALUE.COM
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: "rgba(255,255,255,0.3)",
              fontStyle: "italic",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              maxWidth: 300,
            }}
          >
            {meta.desc}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
