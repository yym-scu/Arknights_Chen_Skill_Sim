# 🇨🇳 中国大陆访问部署说明

您提到的 "Cloudflare 托管的域名在国内环境无法访问" 是一个非常普遍的现象。Cloudflare 的边缘节点（尤其是免费版）在中国大陆的连通性经常受到干扰（DNS 污染或 SNI 阻断）。

以下是几种解决方案：

## 1. 既然已经部署在 Vercel

Vercel 默认提供的 `*.vercel.app` 域名在中国大陆的访问情况通常优于 Cloudflare 的 `*.pages.dev`。

- **推荐**：直接分享 Vercel 分配的 `xxx.vercel.app` 域名给国内用户。
- **注意**：Vercel 的 IP 也偶尔会被阻断，但通常比 CF 稳定。

## 2. 部署到 Zeabur (推荐)

[Zeabur](https://zeabur.com) 是一个对国内开发者非常友好的部署平台（类似 Vercel）。

- **优势**：它的服务器位于**香港**或**日本**，对中国大陆的直连速度非常快，且域名极少被墙。
- **操作**：
  1. 使用 GitHub 登录 Zeabur。
  2. 导入这个仓库。
  3. 它会自动识别 Next.js 并完成部署。
  4. 使用它提供的默认域名进行访问。

## 3. 使用自定义域名 + 优选 CDN (进阶)

如果您必须使用自己的域名：

- **方案 A**：将域名 DNS 解析托管到 **DNSPod** 或 **Aliyun DNS**，设置国内线路解析到国内的主机，国外线路解析到 Vercel/Cloudflare。
- **方案 B**：购买一个国内或香港的云服务器（各厂商的轻量应用服务器，约 20元/月），使用 Nginx 反向代理到 Vercel。

```nginx
# Nginx 反向代理示例
location / {
    proxy_pass https://your-project.vercel.app;
    proxy_ssl_server_name on;
    proxy_set_header Host your-project.vercel.app;
}
```

## 4. 关于本项目此时的优化

针对移动端的兼容性修复（夸克黑屏、QQ 浏览器黑边、Chrome 灰框）已经包含在本次更新中。无论您部署在哪个平台，只要用户能加载网页，显示效果都会得到修正。
