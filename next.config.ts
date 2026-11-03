import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cloudflare Workers não tem o otimizador de imagens do Next por padrão
  images: { unoptimized: true },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
};

export default nextConfig;

// Permite usar bindings/variáveis do Cloudflare durante o `next dev` (desabilitado em dev local para compatibilidade)
// initOpenNextCloudflareForDev();
