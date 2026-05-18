import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowSVG: true,
    domains: ["img.shields.io"],
  },
};

export default withMDX(config);
