# run-demo.ps1
$baseUrl = "http://localhost:5000/api"

Write-Host "`n--- STARTING PROJECT DEMO ---" -ForegroundColor Yellow

# 1. Signup
Write-Host "Step 1: Signing up a new Admin user..." -NoNewline
$signupBody = @{ name = "Admin User"; email = "demo@example.com"; password = "password123"; role = "Admin" } | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$baseUrl/auth/signup" -Method Post -ContentType "application/json" -Body $signupBody
    Write-Host " [SUCCESS]" -ForegroundColor Green
} catch {
    Write-Host " [ALREADY EXISTS/ERROR]" -ForegroundColor Gray
}

# 2. Login
Write-Host "Step 2: Logging in to get JWT Token..." -NoNewline
$loginBody = @{ email = "demo@example.com"; password = "password123" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
$token = $response.token
Write-Host " [TOKEN RECEIVED]" -ForegroundColor Green

# 3. Add Records
Write-Host "Step 3: Adding sample financial records..." -NoNewline
$headers = @{ Authorization = "Bearer $token" }

$records = @(
    @{ amount = 8000; type = "income"; category = "Salary"; description = "Project payment" },
    @{ amount = 1200; type = "expense"; category = "Rent"; description = "Office rent" },
    @{ amount = 300; type = "expense"; category = "Internet"; description = "Fiber optic bill" }
)

foreach ($record in $records) {
    Invoke-RestMethod -Uri "$baseUrl/records" -Method Post -ContentType "application/json" -Headers $headers -Body ($record | ConvertTo-Json)
}
Write-Host " [RECORDS ADDED]" -ForegroundColor Green

# 4. View Dashboard
Write-Host "`n--- FINAL DASHBOARD RESULT ---" -ForegroundColor Cyan
$dashboard = Invoke-RestMethod -Uri "$baseUrl/dashboard" -Method Get -Headers $headers
$dashboard | ConvertTo-Json -Depth 4
Write-Host "`n--- DEMO COMPLETE ---" -ForegroundColor Yellow
