(function() {
    const resultElement = document.createElement('p');
    resultElement.id = 'result';
    document.body.appendChild(resultElement);

    const captchaContainer = document.createElement('div');
    captchaContainer.id = 'captchaContainer';
    document.body.appendChild(captchaContainer);

    const accessDeniedElement = document.createElement('div');
    accessDeniedElement.id = 'accessDenied';
    accessDeniedElement.textContent = 'Access Denied: You did not pass the human verification.';
    accessDeniedElement.style.display = 'none';
    document.body.appendChild(accessDeniedElement);

    let captchaText = generateCaptcha();
    let isVerified = false; // 标志变量，表示是否通过验证

    function generateCaptcha() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return captcha;
    }

    function drawCaptcha() {
        const canvas = document.createElement('canvas');
        canvas.id = 'captchaCanvas';
        canvas.width = 150;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.font = '30px Arial';
        ctx.fillStyle = '#f4f4f4';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#007bff';
        ctx.fillText(captchaText, 20, 35);
        captchaContainer.innerHTML = '';
        captchaContainer.appendChild(canvas);

        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.id = 'userInput';
        userInput.placeholder = 'Enter the captcha';
        captchaContainer.appendChild(userInput);

        const validateButton = document.createElement('button');
        validateButton.textContent = 'Validate';
        validateButton.onclick = validateCaptcha;
        captchaContainer.appendChild(validateButton);
    }

    function validateCaptcha() {
        const userInput = document.getElementById('userInput').value;
        if (userInput === captchaText) {
            resultElement.textContent = 'Captcha is correct!';
            resultElement.style.color = 'green';
            isVerified = true; // 设置标志为true，表示通过验证
            accessDeniedElement.style.display = 'none'; // 隐藏拒绝访问消息
        } else {
            resultElement.textContent = 'Captcha is incorrect. Try again.';
            resultElement.style.color = 'red';
        }
    }

    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let mouseMovements = 0;
    let clicks = 0;
    let touchDistance = 0;

    if (isMobile) {
        document.body.addEventListener('touchstart', function(event) {
            touchDistance = 0;
        });

        document.body.addEventListener('touchmove', function(event) {
            touchDistance += Math.sqrt(
                Math.pow(event.touches[0].clientX - event.touches[0].target.offsetLeft, 2) +
                Math.pow(event.touches[0].clientY - event.touches[0].target.offsetTop, 2)
            );
        });

        document.body.addEventListener('touchend', function() {
            if (touchDistance > 10) {
                resultElement.textContent = 'Swipe detected. Likely a human user.';
                resultElement.style.color = 'green';
            } else {
                resultElement.textContent = 'No significant swipe detected. Initiating captcha verification.';
                resultElement.style.color = 'red';
                drawCaptcha();
            }
        });
    } else {
        document.body.addEventListener('mousemove', function() {
            mouseMovements++;
        });

        document.body.addEventListener('click', function() {
            clicks++;
        });

        setTimeout(function() {
            if (mouseMovements > 5 && clicks > 0) {
                resultElement.textContent = 'Likely a human user.';
                resultElement.style.color = 'green';
            } else {
                resultElement.textContent = 'Could be a bot. Initiating captcha verification.';
                resultElement.style.color = 'red';
                drawCaptcha();
            }
        }, 10000);
    }

    // 检查是否通过验证
    if (!isVerified) {
        accessDeniedElement.style.display = 'block'; // 显示拒绝访问消息
        // 可以选择在这里添加更多逻辑，比如重定向到另一个页面或完全关闭页面
        // window.location.href = 'about:blank'; // 示例：重定向到空白页
    }
})();
