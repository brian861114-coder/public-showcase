# 一鍵啟動 NOTES 部落格（網站 + Keystatic 後台）
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$hostName = '127.0.0.1'
$port = 4321
$siteUrl = "http://${hostName}:${port}/"
$adminUrl = "http://${hostName}:${port}/keystatic/"

function Test-PortOpen {
  try {
    $client = New-Object System.Net.Sockets.TcpClient
    $async = $client.BeginConnect($hostName, $port, $null, $null)
    $wait = $async.AsyncWaitHandle.WaitOne(300)
    $ok = $wait -and $client.Connected
    $client.Close()
    return $ok
  } catch {
    return $false
  }
}

Write-Host ''
Write-Host 'NOTES 部落格一鍵啟動' -ForegroundColor Cyan
Write-Host "網站：$siteUrl"
Write-Host "後台：$adminUrl"
Write-Host ''

$alreadyRunning = Test-PortOpen
if (-not $alreadyRunning) {
  Write-Host '正在啟動開發伺服器...' -ForegroundColor Yellow
  Start-Process `
    -FilePath 'cmd.exe' `
    -ArgumentList '/k', "npm run dev -- --host $hostName --port $port" `
    -WorkingDirectory $PSScriptRoot

  $deadline = (Get-Date).AddSeconds(90)
  while (-not (Test-PortOpen)) {
    if ((Get-Date) -gt $deadline) {
      Write-Host '啟動逾時，請確認已安裝依賴（npm install）。' -ForegroundColor Red
      exit 1
    }
    Start-Sleep -Milliseconds 500
  }
  Write-Host '伺服器已就緒。' -ForegroundColor Green
} else {
  Write-Host "偵測到埠 $port 已在運行，直接開啟瀏覽器。" -ForegroundColor Green
}

Start-Process $siteUrl
Start-Sleep -Milliseconds 400
Start-Process $adminUrl

Write-Host ''
Write-Host '已開啟網站與後台分頁。' -ForegroundColor Cyan
Write-Host '要停止伺服器：關閉標題為「NOTES Blog」或執行 npm 的命令視窗。' -ForegroundColor DarkGray
Write-Host ''
