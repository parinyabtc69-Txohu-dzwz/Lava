param (
    [string]$Message = "Auto update"
)
Write-Host "Adding files..." -ForegroundColor Cyan
git add .
Write-Host "Committing with message: '$Message'" -ForegroundColor Cyan
git commit -m $Message
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main
Write-Host "Done!" -ForegroundColor Green