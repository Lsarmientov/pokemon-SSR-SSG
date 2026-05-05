# Script para arreglar problemas de pnpm en proyectos Angular
# Uso: .\fix-pnpm-angular.ps1

Write-Host "[*] Arreglando configuracion de pnpm para Angular..." -ForegroundColor Cyan

# Verificar si estamos en un proyecto Angular
if (-not (Test-Path "package.json")) {
    Write-Host "[X] Error: No se encontro package.json en el directorio actual" -ForegroundColor Red
    Write-Host "    Asegurate de estar en la raiz del proyecto Angular" -ForegroundColor Yellow
    exit 1
}

# Verificar si es un proyecto Angular
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if (-not ($packageJson.dependencies.'@angular/core')) {
    Write-Host "[!] Advertencia: No parece ser un proyecto Angular" -ForegroundColor Yellow
    $continue = Read-Host "Deseas continuar de todos modos? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 0
    }
}

Write-Host ""
Write-Host "[+] Creando archivo .npmrc con configuracion optimizada..." -ForegroundColor Green

# Crear o sobrescribir .npmrc
$npmrcContent = @"
shamefully-hoist=true
strict-peer-dependencies=false
"@

Set-Content -Path ".npmrc" -Value $npmrcContent -Encoding UTF8

Write-Host "[OK] Archivo .npmrc creado" -ForegroundColor Green

Write-Host ""
Write-Host "[+] Configurando VSCode tasks..." -ForegroundColor Green

# Crear carpeta .vscode si no existe
if (-not (Test-Path ".vscode")) {
    New-Item -ItemType Directory -Path ".vscode" | Out-Null
    Write-Host "[OK] Carpeta .vscode creada" -ForegroundColor Green
}

# Crear tasks.json
$tasksContent = @"
{
  // For more information, visit: https://go.microsoft.com/fwlink/?LinkId=733558
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Angular",
      "type": "shell",
      "command": "pnpm ng serve -o",
      "runOptions": { "runOn": "folderOpen" },
      "problemMatcher": ["`$tsc-watch"]
    }
  ]
}
"@

Set-Content -Path ".vscode/tasks.json" -Value $tasksContent -Encoding UTF8

Write-Host "[OK] Archivo tasks.json creado en .vscode" -ForegroundColor Green

Write-Host ""
Write-Host "[*] Eliminando node_modules y pnpm-lock.yaml..." -ForegroundColor Yellow

# Eliminar node_modules
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "[OK] node_modules eliminado" -ForegroundColor Green
}

# Eliminar pnpm-lock.yaml
if (Test-Path "pnpm-lock.yaml") {
    Remove-Item -Force "pnpm-lock.yaml"
    Write-Host "[OK] pnpm-lock.yaml eliminado" -ForegroundColor Green
}

Write-Host ""
Write-Host "[*] Reinstalando dependencias con pnpm..." -ForegroundColor Cyan
pnpm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] Proyecto arreglado exitosamente!" -ForegroundColor Green
	Write-Host ""
	Write-Host "[*] Ejecutando auditoria de seguridad..." -ForegroundColor Red
	pnpm approve-builds
    Write-Host ""
    Write-Host "[>] Ahora puedes ejecutar: pnpm ng serve -o" -ForegroundColor Cyan	
} else {
    Write-Host ""
    Write-Host "[X] Error al instalar dependencias" -ForegroundColor Red
    exit 1
}

$angularJsonPath = "angular.json"

# Leer angular.json
$angularJson = Get-Content $angularJsonPath -Raw | ConvertFrom-Json

# Detectar nombre del proyecto
$projectName = ($angularJson.projects | Get-Member -MemberType NoteProperty).Name
$project = $angularJson.projects.$projectName

# Si no existe, crear objeto schematics
if (-not $project.schematics) {
    $project | Add-Member -MemberType NoteProperty -Name "schematics" -Value ([PSCustomObject]@{})
}

# Configuración que quieres agregar
$schematicsConfig = @{
    "@schematics/angular:component"   = @{ type = "component" }
    "@schematics/angular:directive"   = @{ type = "directive" }
    "@schematics/angular:service"     = @{ type = "service" }
    "@schematics/angular:guard"       = @{ typeSeparator = "." }
    "@schematics/angular:interceptor" = @{ typeSeparator = "." }
    "@schematics/angular:module"      = @{ typeSeparator = "." }
    "@schematics/angular:pipe"        = @{ typeSeparator = "." }
    "@schematics/angular:resolver"    = @{ typeSeparator = "." }
}

# Agregar cada clave como propiedad dinámica
foreach ($key in $schematicsConfig.Keys) {
    if (-not $project.schematics.PSObject.Properties[$key]) {
        $project.schematics | Add-Member -MemberType NoteProperty -Name $key -Value $schematicsConfig[$key]
    } else {
        # Si existe, actualizarlo
        $project.schematics.$key = $schematicsConfig[$key]
    }
}

# Guardar cambios
$angularJson | ConvertTo-Json -Depth 20 | Out-File $angularJsonPath -Encoding UTF8

Write-Host "Schematics agregados DENTRO del proyecto correctamente."
