$sourceDir = "c:\Users\faruk\OneDrive\Masaüstü\brandist\brand.ist\Pages"
$targetDir = "c:\Users\faruk\OneDrive\Masaüstü\brandist\brandist-astro\src\pages"
$folders = @("tente", "cadir", "branda", "kumas-turleri")

foreach ($folder in $folders) {
    echo "Processing $folder..."
    $folderPath = Join-Path $sourceDir $folder
    $targetFolderPath = Join-Path $targetDir $folder
    
    if (Test-Path $folderPath) {
        if (-Not (Test-Path $targetFolderPath)) {
            New-Item -ItemType Directory -Force -Path $targetFolderPath | Out-Null
        }
        
        $files = Get-ChildItem -Path $folderPath -Filter "*.cshtml"
        foreach ($file in $files) {
            # Skip .cs files if accidentally matched
            if ($file.Name -match "\.cs$") { continue }
            
            $content = Get-Content -Raw -Path $file.FullName
            
            # Remove Razor top block
            $content = $content -replace '(?m)^@page[\s\S]*?@{[\s\S]*?}', ''
            
            # Remove AntiForgeryToken
            $content = $content -replace '@Html\.AntiForgeryToken\(\)', ''
            
            # Trim
            $content = $content.Trim()
            
            # Extract title
            $title = "Brand.ist"
            if ($content -match '(?i)<h1[^>]*>([\s\S]*?)</h1>') {
                $title = $matches[1] -replace '<[^>]*>?', ''
                $title = $title.Trim()
            }
            
            $layoutPath = "../../layouts/Layout.astro"
            
            $astroContent = @"
---
import Layout from '$layoutPath';
---

<Layout title="$title">
$content
</Layout>
"@
            
            $targetFileName = $file.Name -replace '\.cshtml$', '.astro'
            $targetFilePath = Join-Path $targetFolderPath $targetFileName
            
            Set-Content -Path $targetFilePath -Value $astroContent -Encoding UTF8
            echo "Migrated $($file.Name) to $targetFileName"
        }
    }
}
