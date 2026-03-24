Write-Host "Waiting for Docker engine to be ready..."
for ($i = 0; $i -lt 24; $i = $i + 1) {
    Start-Sleep -Seconds 5
    $output = docker ps 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Docker is ready!"
        docker ps
        exit 0
    }
    Write-Host "Attempt $($i + 1): Not ready yet..."
}
Write-Host "Timed out waiting for Docker"
exit 1
