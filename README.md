# ストック管理アプリ

日用品やオフィス用品などの在庫を効率的に管理するためのWebアプリケーションです。

## 主な機能

- ボードごとに在庫アイテムを管理
- カテゴリーや店舗別の表示切り替え
- ドラッグ&ドロップでアイテムの並び替え
- WebRTCを使用したリアルタイムの共有機能
- レスポンシブデザイン

## 技術スタック

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand (状態管理)
- PeerJS (WebRTC)
- DnD Kit (ドラッグ&ドロップ)
- Lucide React (アイコン)

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## ビルドとデプロイ

### ローカルビルド

```bash
# TypeScriptのコンパイルとプロダクションビルド
npm run build

# ビルドしたアプリケーションのプレビュー
npm run preview
```

### Netlifyへのデプロイ

1. GitHubリポジトリにプッシュ
2. Netlifyでリポジトリを連携
3. 以下のビルド設定を行う：
   - Build command: `npm run build`
   - Publish directory: `dist`

## 開発ガイドライン

- コンポーネントは機能ごとに分割し、再利用可能な設計を心がける
- Tailwind CSSを使用してスタイリング
- コードフォーマットはESLintとPrettierを使用

## ライセンス

MIT