(function() {
    const resultElement = document.createElement('p');
    resultElement.id = 'result';
    document.body.appendChild(resultElement);

    const accessDeniedElement = document.createElement('div');
    accessDeniedElement.id = 'accessDenied';
    accessDeniedElement.textContent = '访问被拒绝：您未通过人工验证。';
    accessDeniedElement.style.display = 'none';
    accessDeniedElement.style.backgroundColor = 'white';
    accessDeniedElement.style.position = 'fixed';
    accessDeniedElement.style.top = '0';
    accessDeniedElement.style.left = '0';
    accessDeniedElement.style.width = '100%';
    accessDeniedElement.style.height = '100%';
    accessDeniedElement.style.zIndex = '9999';
    document.body.appendChild(accessDeniedElement);

    let isVerified = false;
    let verificationTimeout;

    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        return { equation: `${num1} ${operator} ${num2}`, answer: eval(`${num1} ${operator} ${num2}`) };
    }

    function drawCaptcha() {
        const captcha = generateCaptcha();
        const captchaText = document.createElement('p');
        captchaText.textContent = `请计算：${captcha.equation}`;
        captchaText.style.marginTop = '50px';
        captchaText.style.textAlign = 'center';
        accessDeniedElement.appendChild(captchaText);

        const userInput = document.createElement('input');
        userInput.type = 'text';
        userInput.id = 'userInput';
        userInput.placeholder = '输入计算结果';
        userInput.style.display = 'block';
        userInput.style.margin = '20px auto';
        accessDeniedElement.appendChild(userInput);

        const validateButton = document.createElement('button');
        validateButton.textContent = '验证';
        validateButton.onclick = () => validateCaptcha(captcha.answer);
        validateButton.style.display = 'block';
        validateButton.style.margin = '20px auto';
        accessDeniedElement.appendChild(validateButton);
    }

    function validateCaptcha(answer) {
        const userInput = document.getElementById('userInput').value;
        if (parseInt(userInput) === answer) {
            resultElement.textContent = '验证通过！';
            resultElement.style.color = 'green';
            isVerified = true;
            accessDeniedElement.style.display = 'none';
            clearTimeout(verificationTimeout);
            localStorage.setItem('verificationPassed', Date.now());
        } else {
            resultElement.textContent = '验证失败，请重试。';
            resultElement.style.color = 'red';
        }
    }

    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
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
                resultElement.textContent = '滑动检测到。可能是人类用户。';
                resultElement.style.color = 'green';
            } else {
                resultElement.textContent = '未检测到显著滑动。开始验证码验证。';
                resultElement.style.color = 'red';
                drawCaptcha();
            }
        });
    }

    setTimeout(() => {
        if (!isVerified) {
            accessDeniedElement.style.display = 'block';
        }
    }, 3000);

    const verificationPassed = localStorage.getItem('verificationPassed');
    if (verificationPassed && Date.now() - verificationPassed < 20 * 60 * 1000) {
        isVerified = true;
    }
})();
