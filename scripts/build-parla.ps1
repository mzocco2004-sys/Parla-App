$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$dist = Join-Path $root "dist"
$assets = Join-Path $dist "assets"

New-Item -ItemType Directory -Force -Path $assets | Out-Null

Push-Location $root

& ".\node_modules\.bin\tailwindcss.cmd" -i ".\src\styles.css" -o ".\dist\assets\style.css" --minify

& ".\node_modules\@esbuild\win32-x64\esbuild.exe" "src/main.tsx" `
  --bundle `
  --format=esm `
  --jsx=automatic `
  --loader:.ts=ts `
  --loader:.tsx=tsx `
  --outfile="dist/assets/app.js" `
  '--define:import.meta.env.DEV=false' `
  '--define:import.meta.env.VITE_ENABLE_MOCK_AI="\"false\""' `
  '--define:import.meta.env.VITE_AI_ENDPOINT="\"\""'

Pop-Location

$html = @"
<!doctype html>
<html lang="it">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Parla trasforma pensieri vocali in task, idee e promemoria automaticamente."
    />
    <title>Parla | Il resto succede</title>
    <link rel="stylesheet" href="/assets/style.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/app.js"></script>
  </body>
</html>
"@

Set-Content -LiteralPath (Join-Path $dist "index.html") -Value $html -Encoding UTF8

Write-Host "Build statica pronta in $dist"
