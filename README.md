# googlehome-irkit

Google Homeから IRKit を操作するための Google Cloud Functions

## 開発環境の構築

このリポジトリをクローン
```
git clone
```
依存モジュールのインストール
```
npm i # or yarn i
```
このリポジトリのルートディレクトリに`.credentials.json`を作成する。  
IRKitの`clientkey`と`deviceid`を以下のように記述する。
```
{
  "clientkey": "XXXXXYYYYYZZZZZ111112222233333",
  "deviceid": "XXXXXYYYYYZZZZZ111112222233333"
}
```

## 開発用コマンド

ローカル実行
```
npm run dev -- --data='{"op":"ROOM_LIGHT_OFF"}'
```
ビルド
```
npm run build
```

## 新しい赤外線信号の追加

`src/messages.js`に追加する。書き方は当該ファイルを参照。  
ここに追加した信号は、post時のopパラメータでIRKitに送信できるようになる。

## 新しい送信パターンの追加

通常は単一の信号をIRKitに送信するだけだが、`src/index.js`の`switch`文の部分に新しい分岐を追加することで、独自の処理を加えてから信号を送信することが可能。  
一度のAPIコールで複数の信号の送信したりもできる。

## Google Cloud Functions へのデプロイ

最新版をビルドしてGitにプッシュする
```
npm run build
git add .
git commit -m 'build'
git push origin master
```
その後、Cloud Functionsのコンソールからデプロイを行う
