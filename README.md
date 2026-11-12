# バイトシフトのアプリ（現在リファクタリング中）

## アプリケーション概要
自身のパソコンでgoogle calendarに登録できるようする

## アプリURL（デプロイ先）
https://baito-shift-app.vercel.app

## 使用技術
* フロントエンド: React, TypeScript
* バックエンド: Spring Boot, Java 
* データベース: MySQL
* インフラ・その他: 

## ✨ 主な機能
* 自身のgoogle calendarへのログイン機能
* アルバイトの仕事内容、時間、一緒に働く人の名前などの編集
* データベースへの登録
* google calendarで予定の入力

## 💡 開発の背景・目的
自分のアルバイト先のシフトが紙で張り出されるため、毎回手入力するのに時間がかかったり、間違えて入力することもあった。

## 🔥 工夫した点・苦労した点
* フロントエンドでTypscriptでの開発は初めてであったため、Geminiに相談しながら進めた
* **Google Calendarへの登録:** Google Calendarへのログインや登録をバックエンド側の処理に変更
* **UI/UXのこだわり:** はじめにログイン画面をさせて、登録画面を左右に分けて確認しやすいように、人の目で最終判断をするような設計

## 🚀 ローカルでの環境構築手順
1. リポジトリのクローン: `git clone https://github.com/your/repo.git`
2. パッケージのインストール: `npm install`
3. サーバーの起動: `npm run dev`
