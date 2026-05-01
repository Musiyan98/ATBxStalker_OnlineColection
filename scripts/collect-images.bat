@echo off
echo 📸 Збір всіх зображень карток...
echo.

if not exist "video_GENAI\_all_images" mkdir "video_GENAI\_all_images"

set success=0
set failed=0

for /L %%i in (1,1,48) do (
  if exist "public\images\cards\gallery\card-%%i\card-%%i-large.jpg" (
    copy "public\images\cards\gallery\card-%%i\card-%%i-large.jpg" "video_GENAI\_all_images\card-%%i-large.jpg" >nul
    echo ✅ Card %%i: Скопійовано
    set /a success+=1
  ) else (
    echo ❌ Card %%i: Не знайдено
    set /a failed+=1
  )
)

echo.
echo ==================================================
echo ✨ Готово!
echo    Успішно: %success%/48
echo    Не знайдено: %failed%/48
echo.
echo 📁 Всі зображення в: video_GENAI\_all_images\
echo ==================================================
pause
