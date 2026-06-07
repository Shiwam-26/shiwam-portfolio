$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$entry = "127.0.0.1   shiwam-portfolio"
$content = Get-Content $hostsPath -Raw
if ($content -notmatch "shiwam-portfolio") {
    Add-Content -Path $hostsPath -Value "`r`n$entry" -Encoding ASCII
    Write-Host "SUCCESS: shiwam-portfolio added to hosts file!"
} else {
    Write-Host "ALREADY EXISTS: shiwam-portfolio already in hosts file."
}
