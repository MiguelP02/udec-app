$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Paso($texto) { Write-Host ""; Write-Host "==> $texto" -ForegroundColor Green }

$destino = Join-Path $env:USERPROFILE 'flutter'
$binFlutter = Join-Path $destino 'bin'

# 1. Git (Flutter lo necesita en Windows)
Paso 'Revisando Git...'
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    if (Test-Path 'C:\Program Files\Git\cmd\git.exe') {
        $env:Path += ';C:\Program Files\Git\cmd'
    } elseif (Get-Command winget -ErrorAction SilentlyContinue) {
        Write-Host 'Git no esta instalado. Instalandolo con winget...'
        winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
        $env:Path += ';C:\Program Files\Git\cmd'
    } else {
        Write-Host 'No se encontro Git ni winget.' -ForegroundColor Red
        Write-Host 'Instala Git desde https://git-scm.com/download/win y vuelve a ejecutar este instalador.'
        exit 1
    }
}
Write-Host 'Git listo.'

# 2. SDK de Flutter
if (Test-Path (Join-Path $binFlutter 'flutter.bat')) {
    Paso "Flutter ya esta instalado en $destino"
} else {
    Paso 'Consultando la ultima version estable de Flutter...'
    $info = Invoke-RestMethod 'https://storage.googleapis.com/flutter_infra_release/releases/releases_windows.json'
    $hash = $info.current_release.stable
    $rel = $info.releases | Where-Object { $_.hash -eq $hash -and $_.channel -eq 'stable' } | Select-Object -First 1
    $url = "$($info.base_url)/$($rel.archive)"
    $zip = Join-Path $env:TEMP 'flutter_sdk.zip'

    Paso "Descargando Flutter $($rel.version) (cerca de 1 GB, puede tardar varios minutos)..."
    Write-Host $url
    if (Get-Command curl.exe -ErrorAction SilentlyContinue) {
        curl.exe -L --fail -o $zip $url
        if ($LASTEXITCODE -ne 0) { throw 'La descarga fallo. Revisa tu conexion a internet.' }
    } else {
        Invoke-WebRequest -Uri $url -OutFile $zip
    }

    Paso "Descomprimiendo en $destino ..."
    if (Get-Command tar.exe -ErrorAction SilentlyContinue) {
        tar.exe -xf $zip -C $env:USERPROFILE
    } else {
        Expand-Archive -Path $zip -DestinationPath $env:USERPROFILE -Force
    }
    Remove-Item $zip -ErrorAction SilentlyContinue
}

# 3. Agregar Flutter al PATH del usuario
Paso 'Agregando Flutter al PATH de tu usuario...'
$pathUsuario = [Environment]::GetEnvironmentVariable('Path', 'User')
if (-not $pathUsuario) { $pathUsuario = '' }
if ($pathUsuario -notlike "*$binFlutter*") {
    $nuevo = if ($pathUsuario) { "$pathUsuario;$binFlutter" } else { $binFlutter }
    [Environment]::SetEnvironmentVariable('Path', $nuevo, 'User')
}
$env:Path += ";$binFlutter"

# 4. Primera ejecucion
Paso 'Preparando Flutter por primera vez (descarga el SDK de Dart)...'
& (Join-Path $binFlutter 'flutter.bat') config --no-analytics
& (Join-Path $binFlutter 'flutter.bat') --version

Paso 'Revisando el entorno (flutter doctor)...'
& (Join-Path $binFlutter 'flutter.bat') doctor

Write-Host ''
Write-Host '==========================================' -ForegroundColor Green
Write-Host ' Flutter quedo instalado.' -ForegroundColor Green
Write-Host ' Para el prototipo web solo necesitas que'
Write-Host ' "Chrome" o "Edge" aparezca con [OK] arriba.'
Write-Host ' Ahora haz doble clic en EJECUTAR.bat'
Write-Host '==========================================' -ForegroundColor Green
