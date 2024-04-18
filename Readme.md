# 打包app

- Android

```md
eas build -p android --profile preview
```

- iOS

```md
eas build -p ios --profile preview
```
- internal 发布到内部测试 expo App 上的命令

```md
eas update --branch preview --message "Updating the app"
```

