# 四版衣物洗护矩阵

这是一个可直接部署到 nginx 的静态网站发布包。

## 包含内容

- 根目录 `index.html`：四版本切换入口，带悬浮侧边栏
- `versions/main/`：main / kimi K3
- `versions/gptversion/`：gptversion / GPT-5 Terra
- `versions/clauVersion/`：clauVersion / Claude Opus 4.8
- `versions/clauV2/`：clauV2 / Claude Fable 5

## nginx 部署

1. 解压压缩包：

```bash
unzip versionSwitcher-nginx.zip -d /var/www/wl-of-site
```

2. 将 nginx 的站点根目录指向解压后的目录，例如：

```nginx
server {
    listen 80;
    server_name _;
    root /var/www/wl-of-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. 检查并重载 nginx：

```bash
nginx -t
nginx -s reload
```

打开站点根地址即可使用左侧悬浮栏切换四个版本。四个版本的文件已包含在包内，不需要额外部署其他分支或配置反向代理。

## 本地预览

在解压目录执行：

```bash
python3 -m http.server 8081
```

然后访问 `http://localhost:8081/`。

## 目录说明

本包是纯静态资源，不需要 Node.js、构建工具或后端服务。所有图片、CSS 和 JavaScript 均使用相对路径，适合部署到域名根路径或 nginx 的静态目录中。
